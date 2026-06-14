// Populates product metafields for shop.inheritedskincare.com product page sections.
// Uses Storefront API to get product GIDs, then Admin API to write metafields.
// Run: node --env-file=.env.local scripts/create-product-metafields.mjs

const STORE = 'leela-skincare.myshopify.com'
const ADMIN_ENDPOINT = `https://${STORE}/admin/api/2024-10/graphql.json`
const TOKEN_ENDPOINT = `https://${STORE}/admin/oauth/access_token`
const SF_ENDPOINT = `https://${STORE}/api/2024-10/graphql.json`
const SF_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN

async function getToken() {
  const res = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.SHOPIFY_CLIENT_ID,
      client_secret: process.env.SHOPIFY_CLIENT_SECRET,
      grant_type: 'client_credentials',
    }),
  })
  const json = await res.json()
  if (!json.access_token) throw new Error('No access_token: ' + JSON.stringify(json))
  return json.access_token
}

async function adminGql(token, query, variables) {
  const res = await fetch(ADMIN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ query, variables }),
  })
  const json = await res.json()
  if (json.errors) throw new Error(JSON.stringify(json.errors))
  return json.data
}

async function storefrontGql(query, variables) {
  const res = await fetch(SF_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SF_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  })
  const json = await res.json()
  if (json.errors) throw new Error(JSON.stringify(json.errors))
  return json.data
}

// ─── Step 1: Create metafield definitions ─────────────────────────────────────

const DEFINITIONS = [
  {
    name: 'Benefit Icons',
    namespace: 'custom',
    key: 'benefit_icons',
    type: 'single_line_text_field',
    description: 'Comma-separated benefit labels e.g. "Soothes,Strengthens,Hydrates,Softens"',
    ownerType: 'PRODUCT',
  },
  {
    name: 'Why You\'ll Love It',
    namespace: 'custom',
    key: 'why_you_love_it',
    type: 'multi_line_text_field',
    description: 'One benefit per line. Each line becomes a bullet point.',
    ownerType: 'PRODUCT',
  },
  {
    name: 'Who It\'s Good For',
    namespace: 'custom',
    key: 'who_its_good_for',
    type: 'multi_line_text_field',
    description: 'Plain text description of who benefits from this product.',
    ownerType: 'PRODUCT',
  },
  {
    name: 'Key Ingredients Detail',
    namespace: 'custom',
    key: 'key_ingredients_detail',
    type: 'multi_line_text_field',
    description: 'One ingredient per line in format "Ingredient Name: benefit description"',
    ownerType: 'PRODUCT',
  },
  {
    name: 'The Experience',
    namespace: 'custom',
    key: 'the_experience',
    type: 'multi_line_text_field',
    description: 'How the product smells, feels, and leaves skin. One sentence per line.',
    ownerType: 'PRODUCT',
  },
  {
    name: 'Product Details',
    namespace: 'custom',
    key: 'product_details',
    type: 'json',
    description: 'JSON object: {size, texture, skin_type, scent, packaging, made_in, certifications}',
    ownerType: 'PRODUCT',
  },
]

async function createDefinitions(token) {
  const mutation = `
    mutation CreateMetafieldDefinition($definition: MetafieldDefinitionInput!) {
      metafieldDefinitionCreate(definition: $definition) {
        createdDefinition { id name key }
        userErrors { field message code }
      }
    }
  `
  for (const def of DEFINITIONS) {
    console.log(`Creating definition: custom.${def.key} ...`)
    const data = await adminGql(token, mutation, { definition: def })
    const errs = data.metafieldDefinitionCreate?.userErrors ?? []
    if (errs.length) {
      // TAKEN means already exists — that's fine
      const alreadyExists = errs.some(e => e.code === 'TAKEN')
      if (alreadyExists) {
        console.log(`  ✓ Already exists — skipping.`)
      } else {
        console.error(`  ✗ Errors:`, JSON.stringify(errs))
      }
    } else {
      console.log(`  ✓ Created: ${data.metafieldDefinitionCreate?.createdDefinition?.id}`)
    }
  }
}

// ─── Step 2: Populate Deep Nourishing Cream ───────────────────────────────────

const DEEP_NOURISHING_CREAM_CONTENT = {
  benefit_icons: 'Soothes,Strengthens,Hydrates,Softens',

  why_you_love_it: `Deep Hydration — locks moisture in for 24-hour softness
Barrier Support — strengthens skin's natural protective layer
Brightens Tone — pomegranate oil evens and radiates
Soothes Sensitivity — calms redness and reactive skin
Fast-Absorbing — no greasy residue, just silky skin
Face & Body — one formula for head to toe use
Natural Fragrance — lightly floral from lavender and geranium
UK-Made — crafted in small batches in Britain`,

  who_its_good_for: `Suitable for all skin types, especially those with dry, cracked, or chapped skin. Works beautifully on both face and body. Ideal if your skin is sensitive, reactive, or dehydrated.`,

  key_ingredients_detail: `Organic Washed Ghee: Ancient Ayurvedic base that delivers deep nourishment without clogging pores
Murumuru Butter: Strengthens the skin barrier and locks in long-lasting moisture
Monoi Tahiti Oil: Soothes, softens, and leaves skin with a luminous glow
Coconut Oil: Antimicrobial and deeply hydrating — softens rough patches
Jojoba Oil: Balancing and lightweight — mimics skin's natural sebum
Aloe Vera: Calms inflammation and instantly hydrates
Pomegranate Oil: Rich in antioxidants — brightens tone and firms over time`,

  the_experience: `Smells like: a subtle blend of lavender, geranium, and pomegranate — soft and grounding
Feels like: a rich, creamy balm that melts into skin on contact
Skin feels: immediately hydrated, plump, and deeply nourished`,

  product_details: JSON.stringify({
    Size: '50ml',
    Texture: 'Soft, rich cream',
    'Skin Type': 'All types — especially dry, dull, or sensitive',
    Scent: 'Lightly floral and fresh',
    Packaging: 'Sustainable, recyclable glass jar',
    'Made in': 'UK',
    Certifications: 'CPSR tested, cruelty-free',
  }),
}

async function populateDeepNourishingCream(token) {
  // Get product GID from Storefront API (public access, no special scopes)
  console.log('\nLooking up Deep Nourishing Cream via Storefront API...')
  const sfData = await storefrontGql(`
    query { productByHandle(handle: "deep-nourishing-cream") { id title } }
  `)
  const product = sfData.productByHandle
  if (!product) throw new Error('Product not found: deep-nourishing-cream')
  // Storefront GID format: gid://shopify/Product/... (same as Admin GID)
  console.log(`Found: ${product.title} (${product.id})`)

  const metafields = Object.entries(DEEP_NOURISHING_CREAM_CONTENT).map(([key, value]) => ({
    ownerId: product.id,
    namespace: 'custom',
    key,
    value: typeof value === 'string' ? value : JSON.stringify(value),
    type: key === 'product_details' ? 'json'
        : key === 'benefit_icons' ? 'single_line_text_field'
        : 'multi_line_text_field',
  }))

  console.log(`Setting ${metafields.length} metafields...`)
  const result = await adminGql(token, `
    mutation SetMetafields($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields { key value }
        userErrors { field message }
      }
    }
  `, { metafields })

  const errs = result.metafieldsSet?.userErrors ?? []
  if (errs.length) {
    console.error('Errors:', JSON.stringify(errs, null, 2))
    process.exit(1)
  }
  console.log('✓ Deep Nourishing Cream metafields populated successfully.')
  console.log('  Keys set:', result.metafieldsSet?.metafields?.map(m => m.key).join(', '))
}

async function main() {
  const token = await getToken()
  console.log('Got admin token.\n')
  // Note: metafield definitions require write_metafield_definitions scope which this token lacks.
  // Metafields can be set directly on products without formal definitions.
  await populateDeepNourishingCream(token)
  console.log('\n✓ Done. Go to Shopify Admin > Products > Deep Nourishing Cream to verify.')
  console.log('  For the other 8 products, use Shopify Admin or re-run this script with updated content.')
}

main().catch(err => { console.error(err); process.exit(1) })
