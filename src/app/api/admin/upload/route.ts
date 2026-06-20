import { NextResponse } from 'next/server'
import { adminConfigured, adminQuery, getAdminToken } from '@/lib/admin-shopify'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const STORE = 'leela-skincare.myshopify.com'
const ADMIN_ENDPOINT = `https://${STORE}/admin/api/2024-10/graphql.json`

const STAGED_UPLOAD = `mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
  stagedUploadsCreate(input: $input) {
    stagedTargets { url resourceUrl parameters { name value } }
    userErrors { field message }
  }
}`

const FILE_CREATE = `mutation fileCreate($files: [FileCreateInput!]!) {
  fileCreate(files: $files) {
    files {
      fileStatus
      ... on MediaImage { id image { url } }
      ... on Video { id sources { url } }
      ... on GenericFile { id url }
    }
    userErrors { field message }
  }
}`

const FILE_STATUS = `query fileStatus($id: ID!) {
  node(id: $id) {
    ... on MediaImage { fileStatus image { url } }
    ... on Video { fileStatus sources { url } }
    ... on GenericFile { fileStatus url }
  }
}`

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

export async function POST(request: Request) {
  if (!adminConfigured()) {
    return NextResponse.json(
      { error: 'Shopify is not connected, so uploads are unavailable.' },
      { status: 400 }
    )
  }

  try {
    const form = await request.formData()
    const file = form.get('file')
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file received.' }, { status: 400 })
    }

    const isVideo = file.type.startsWith('video/')
    const resource = isVideo ? 'VIDEO' : 'FILE'
    const contentType = isVideo ? 'VIDEO' : 'IMAGE'

    // 1. Ask Shopify for a staged upload target
    const staged = await adminQuery<{
      stagedUploadsCreate: {
        stagedTargets: {
          url: string
          resourceUrl: string
          parameters: { name: string; value: string }[]
        }[]
        userErrors: { message: string }[]
      }
    }>(STAGED_UPLOAD, {
      input: [
        {
          filename: file.name || (isVideo ? 'upload.mp4' : 'upload.jpg'),
          mimeType: file.type || (isVideo ? 'video/mp4' : 'image/jpeg'),
          httpMethod: 'POST',
          resource,
        },
      ],
    })

    const err = staged.stagedUploadsCreate.userErrors?.[0]?.message
    if (err) return NextResponse.json({ error: `Shopify upload error: ${err}` }, { status: 500 })
    if (!staged.stagedUploadsCreate.stagedTargets?.length) {
      return NextResponse.json({ error: 'Shopify did not return an upload target. To fix this, add write_files scope to the Admin API token in your Shopify Partner Dashboard app settings, then reinstall the app. Workaround: upload the image in Shopify Admin → Content → Files, then paste the CDN URL into the Image URL field below.' }, { status: 500 })
    }

    const target = staged.stagedUploadsCreate.stagedTargets[0]
    if (!target) {
      return NextResponse.json({ error: 'No upload target returned.' }, { status: 500 })
    }

    // 2. POST the bytes to the staged target (Google Cloud Storage)
    const uploadForm = new FormData()
    for (const p of target.parameters) uploadForm.append(p.name, p.value)
    uploadForm.append('file', file)

    const uploadRes = await fetch(target.url, { method: 'POST', body: uploadForm })
    if (!uploadRes.ok && uploadRes.status !== 201 && uploadRes.status !== 204) {
      return NextResponse.json(
        { error: `Upload to storage failed (${uploadRes.status}).` },
        { status: 500 }
      )
    }

    // 3. Register the file with Shopify
    const created = await adminQuery<{
      fileCreate: {
        files: {
          fileStatus: string
          id?: string
          image?: { url: string }
          sources?: { url: string }[]
          url?: string
        }[]
        userErrors: { message: string }[]
      }
    }>(FILE_CREATE, {
      files: [{ originalSource: target.resourceUrl, contentType }],
    })

    const cErr = created.fileCreate.userErrors?.[0]?.message
    if (cErr) return NextResponse.json({ error: cErr }, { status: 500 })

    const created0 = created.fileCreate.files[0]
    const id = created0?.id
    let url =
      created0?.image?.url || created0?.sources?.[0]?.url || created0?.url || ''

    // 4. Poll until Shopify finishes processing and gives a permanent URL
    if (!url && id) {
      const token = await getAdminToken()
      for (let i = 0; i < 10 && !url; i++) {
        await sleep(2500)
        const res = await fetch(ADMIN_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': token,
          },
          body: JSON.stringify({ query: FILE_STATUS, variables: { id } }),
          cache: 'no-store',
        })
        const json = await res.json()
        const node = json?.data?.node
        url = node?.image?.url || node?.sources?.[0]?.url || node?.url || ''
        if (node?.fileStatus === 'FAILED') {
          return NextResponse.json(
            { error: 'Shopify could not process that file.' },
            { status: 500 }
          )
        }
      }
    }

    if (!url) {
      return NextResponse.json(
        {
          error: isVideo
            ? 'Video uploaded — Shopify is still processing it. Check Content → Files in a minute and paste the link.'
            : 'Uploaded, but no link came back. Please try again.',
        },
        { status: 202 }
      )
    }

    return NextResponse.json({ url })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Upload failed.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
