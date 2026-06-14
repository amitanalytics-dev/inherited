// One-shot script: replace the quiz section in the Shopify site.settings metafield.
// Run: node scripts/update-quiz-metafield.mjs

const STORE = 'leela-skincare.myshopify.com'
const ADMIN_ENDPOINT = `https://${STORE}/admin/api/2024-10/graphql.json`
const TOKEN_ENDPOINT = `https://${STORE}/admin/oauth/access_token`

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
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
  })
  const json = await res.json()
  if (json.errors) throw new Error(JSON.stringify(json.errors))
  return json.data
}

const NEW_QUIZ = {
  intro: {
    overline: 'Personalised Ritual',
    title: 'Find Your Perfect Ritual',
    subtitle: '3 quick questions. Instant personalised results.',
    buttonLabel: 'Shop All Products',
  },
  questions: [
    {
      id: 'ritual',
      title: 'What kind of ritual feels like you?',
      options: [
        { value: 'simple', label: 'Keep it simple', icon: 'leaf', description: '1–2 key steps, morning and night.' },
        { value: 'morning', label: 'Morning glow', icon: 'sun', description: 'Brighten and nourish for the day ahead.' },
        { value: 'evening', label: 'Evening wind-down', icon: 'moon', description: 'Cleanse and repair while you sleep.' },
        { value: 'body', label: 'Head to toe', icon: 'droplet', description: 'Soft skin everywhere, not just your face.' },
      ],
    },
    {
      id: 'concern',
      title: "What's your main skin concern?",
      options: [
        { value: 'sensitivity', label: 'Sensitivity & redness', icon: 'shield', description: 'Reactive skin, a weakened barrier.' },
        { value: 'dryness', label: 'Dryness & dehydration', icon: 'droplet', description: 'Skin feels parched, lacks moisture.' },
        { value: 'dullness', label: 'Dullness & uneven tone', icon: 'sparkles', description: 'Skin looks tired, lacks radiance.' },
        { value: 'ageing', label: 'Fine lines & firmness', icon: 'clock', description: 'Early signs of ageing, loss of firmness.' },
      ],
    },
    {
      id: 'skin_type',
      title: 'How would you describe your skin type?',
      options: [
        { value: 'dry', label: 'Dry & tight', icon: 'cactus', description: 'Feels rough, flaky, or tight after cleansing.' },
        { value: 'normal', label: 'Normal & balanced', icon: 'heart', description: 'Comfortable most days, no major extremes.' },
        { value: 'combination', label: 'Combination', icon: 'yin-yang', description: 'Drier cheeks, occasional shine in the T-zone.' },
        { value: 'sensitive', label: 'Sensitive', icon: 'flower', description: 'Easily irritated, prone to redness or reactions.' },
      ],
    },
  ],
  results: [
    {
      key: 'simple',
      title: 'The Effortless Ritual',
      description: 'Minimal steps, maximum nourishment. Our hero moisturiser does it all — morning and night.',
      productHandles: ['deep-nourishing-cream', 'ghee-oat-cleansing-balm'],
    },
    {
      key: 'morning',
      title: 'The Morning Glow Ritual',
      description: 'Radiance-boosting formulas that brighten and protect for the day ahead.',
      productHandles: ['radiance-serum', 'deep-nourishing-cream'],
    },
    {
      key: 'evening',
      title: 'The Evening Repair Ritual',
      description: 'Cleanse deeply, then let ghee-rich overnight actives work while you sleep.',
      productHandles: ['ghee-oat-cleansing-balm', 'overnight-rejuvenation-cream'],
    },
    {
      key: 'body',
      title: 'The Head-to-Toe Ritual',
      description: 'Deep nourishment from face to feet. Soft, glowing skin all over.',
      productHandles: ['deep-nourishing-cream', 'overnight-rejuvenation-cream', 'radiance-serum'],
    },
  ],
  resultLogic: "The customer's answer to Question 1 (ritual style) picks the result shown at the end. Questions 2–3 personalise the journey.",
}

async function main() {
  const token = await getToken()
  console.log('Got admin token.')

  // Read current settings
  const current = await adminGql(token, '{ shop { metafield(namespace: "site", key: "settings") { id value } } }')
  const raw = current.shop.metafield?.value
  if (!raw) throw new Error('No site.settings metafield found')

  const settings = JSON.parse(raw)
  settings.quiz = NEW_QUIZ
  const newValue = JSON.stringify(settings)

  console.log('New value length:', newValue.length)

  // Write back
  const result = await adminGql(token, `
    mutation UpdateSettings($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields { key namespace }
        userErrors { field message }
      }
    }
  `, {
    metafields: [{
      namespace: 'site',
      key: 'settings',
      ownerId: 'gid://shopify/Shop/61065429220',
      type: 'json',
      value: newValue,
    }],
  })

  const errors = result.metafieldsSet?.userErrors
  if (errors?.length) {
    console.error('userErrors:', JSON.stringify(errors, null, 2))
    process.exit(1)
  }

  console.log('✓ Quiz metafield updated successfully.')
}

main().catch(err => { console.error(err); process.exit(1) })
