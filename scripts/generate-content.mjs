/**
 * Phase 1: Generate 200 SEO blog articles via Anthropic Batch API
 * Model: claude-haiku-4-5-20251001 (~$0.40 total with 50% batch discount)
 * Saves results to scripts/blog_results.json for Shopify upload
 */

import { writeFileSync, readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
const BATCH_ID_FILE = join(__dirname, 'batch_id.txt')
const RESULTS_FILE  = join(__dirname, 'blog_results.json')
const MODEL = 'claude-haiku-4-5-20251001'

if (!ANTHROPIC_API_KEY) { console.error('Need ANTHROPIC_API_KEY'); process.exit(1) }

const TOPICS = [
  { id:'001', title:"What Is Ghee Skincare? The Ancient Beauty Secret Explained", kw:"ghee skincare" },
  { id:'002', title:"Ghee for Dry Skin: Does It Really Work?", kw:"ghee for dry skin" },
  { id:'003', title:"How Washed Ghee Penetrates All Seven Layers of Skin", kw:"ghee skin penetration" },
  { id:'004', title:"Ghee vs Coconut Oil: Which Is Better for Your Skin?", kw:"ghee vs coconut oil skin" },
  { id:'005', title:"The Science Behind Ghee as a Natural Moisturiser", kw:"ghee natural moisturiser" },
  { id:'006', title:"Ghee for Eczema: What the Research Says", kw:"ghee for eczema" },
  { id:'007', title:"Can Ghee Brighten Your Skin? Here's What We Know", kw:"ghee skin brightening" },
  { id:'008', title:"Using Ghee on Your Face: Benefits and How to Do It Right", kw:"ghee face cream" },
  { id:'009', title:"Ghee for Cracked Heels: The Ultimate Natural Remedy", kw:"ghee cracked heels" },
  { id:'010', title:"Butyric Acid in Ghee: The Skin-Healing Fatty Acid", kw:"butyric acid skin" },
  { id:'011', title:"Ghee for Sensitive Skin: A Gentle Alternative to Chemicals", kw:"ghee sensitive skin" },
  { id:'012', title:"Ghee in Winter Skincare: Perfect for UK Cold Weather", kw:"ghee winter skincare UK" },
  { id:'013', title:"The History of Ghee in Ayurvedic Beauty Rituals", kw:"ghee Ayurvedic beauty" },
  { id:'014', title:"Ghee for Lips: The Best Natural Lip Treatment", kw:"ghee lip treatment" },
  { id:'015', title:"Why Ghee Is Better Than Petroleum Jelly for Dry Skin", kw:"ghee vs petroleum jelly" },
  { id:'016', title:"Ghee for Psoriasis: Relief from an Ancient Remedy", kw:"ghee psoriasis" },
  { id:'017', title:"Ghee as a Night Cream: Wake Up with Glowing Skin", kw:"ghee night cream" },
  { id:'018', title:"Organic Ghee vs Regular Ghee for Skin: What's the Difference?", kw:"organic ghee skincare" },
  { id:'019', title:"Ghee and Vitamin A: The Anti-Ageing Connection", kw:"ghee vitamin A anti-ageing" },
  { id:'020', title:"Ghee for Stretch Marks: Can It Help?", kw:"ghee stretch marks" },
  { id:'021', title:"Ghee for Baby Skin: Safe and Effective?", kw:"ghee baby skin" },
  { id:'022', title:"Ghee and Turmeric for Skin: The Golden Duo", kw:"ghee turmeric skin" },
  { id:'023', title:"Ghee for Perioral Dermatitis: Gentle Care for Sensitive Faces", kw:"ghee perioral dermatitis" },
  { id:'024', title:"How to Tell If Your Skincare Contains Real Ghee", kw:"real ghee skincare" },
  { id:'025', title:"Ghee for Men's Skin: The Natural Alternative to Heavy Creams", kw:"ghee men skincare" },
  { id:'026', title:"What Is Ayurvedic Skincare? A Beginner's Guide", kw:"Ayurvedic skincare" },
  { id:'027', title:"The Three Doshas and Your Skin Type Explained", kw:"doshas skin type" },
  { id:'028', title:"Ayurvedic Morning Skincare Ritual for Glowing Skin", kw:"Ayurvedic morning skincare" },
  { id:'029', title:"Dinacharya: The Ayurvedic Daily Routine for Beautiful Skin", kw:"dinacharya skin routine" },
  { id:'030', title:"Ayurvedic Herbs for Glowing Skin: Top 10 You Should Know", kw:"Ayurvedic herbs skin" },
  { id:'031', title:"How Ayurveda Explains Dry Skin and How to Fix It", kw:"Ayurveda dry skin" },
  { id:'032', title:"Pitta Skin: How to Balance and Calm Reactive Skin Naturally", kw:"pitta skin Ayurveda" },
  { id:'033', title:"Vata Skin: The Ultimate Guide to Nourishing Dry Thin Skin", kw:"vata skin dry" },
  { id:'034', title:"Kapha Skin: How to Brighten and Energise Your Complexion", kw:"kapha skin type" },
  { id:'035', title:"Ayurvedic Face Packs for Every Skin Type", kw:"Ayurvedic face pack" },
  { id:'036', title:"Triphala for Skin: Benefits and How to Use It", kw:"triphala skin benefits" },
  { id:'037', title:"Ashwagandha for Skin: Anti-Stress Beauty Benefits", kw:"ashwagandha skin" },
  { id:'038', title:"Neem in Ayurvedic Skincare: Purifying Properties", kw:"neem skincare Ayurveda" },
  { id:'039', title:"Turmeric in Ayurvedic Skincare: The Golden Spice for Radiance", kw:"turmeric skincare" },
  { id:'040', title:"Rose Water in Ayurvedic Skincare: The Soothing Toner", kw:"rose water Ayurvedic toner" },
  { id:'041', title:"Licorice Root in Ayurveda: Natural Skin Brightener", kw:"licorice root skin" },
  { id:'042', title:"Sandalwood in Ayurveda: Cooling and Calming Skin Benefits", kw:"sandalwood skincare" },
  { id:'043', title:"Kumkumadi: The Ancient Ayurvedic Face Oil Ritual", kw:"kumkumadi face oil" },
  { id:'044', title:"Ayurvedic Skincare During Pregnancy: What's Safe", kw:"Ayurvedic skincare pregnancy" },
  { id:'045', title:"Seasonal Skincare in Ayurveda: Adapting Your Routine Year-Round", kw:"Ayurveda seasonal skincare" },
  { id:'046', title:"Panchakarma and Skin Health: What You Need to Know", kw:"panchakarma skin" },
  { id:'047', title:"Abhyanga: The Ayurvedic Oil Massage Your Skin Needs", kw:"abhyanga oil massage skin" },
  { id:'048', title:"Ayurvedic Diet for Clear Radiant Skin", kw:"Ayurvedic diet skin" },
  { id:'049', title:"Combining Modern and Ayurvedic Skincare: A Practical Guide", kw:"modern Ayurvedic skincare" },
  { id:'050', title:"Ayurvedic Medicine and Modern Dermatology: Where They Meet", kw:"Ayurveda dermatology" },
  { id:'051', title:"Eczema Skincare Routine: A Complete Guide for UK Sufferers", kw:"eczema skincare routine UK" },
  { id:'052', title:"How to Soothe Eczema Naturally Without Steroids", kw:"soothe eczema naturally" },
  { id:'053', title:"Eczema vs Psoriasis: How to Tell the Difference", kw:"eczema vs psoriasis" },
  { id:'054', title:"The Best Natural Moisturisers for Eczema-Prone Skin", kw:"natural moisturiser eczema" },
  { id:'055', title:"Common Eczema Triggers to Avoid: A Practical Guide", kw:"eczema triggers" },
  { id:'056', title:"Dry Skin vs Dehydrated Skin: What's the Difference?", kw:"dry skin vs dehydrated skin" },
  { id:'057', title:"How to Fix Dry Skin Overnight: The Best Natural Remedies", kw:"fix dry skin overnight" },
  { id:'058', title:"Pigmentation and Dark Spots: Natural Ways to Fade Them", kw:"natural fade dark spots" },
  { id:'059', title:"Post-Inflammatory Hyperpigmentation: A Guide for Darker Skin Tones", kw:"hyperpigmentation dark skin" },
  { id:'060', title:"How to Reduce Redness on Sensitive Skin Naturally", kw:"reduce skin redness naturally" },
  { id:'061', title:"Sensitive Skin Routine: The Gentle Approach That Works", kw:"sensitive skin routine" },
  { id:'062', title:"Skin Barrier Repair: Signs It's Damaged and How to Fix It", kw:"skin barrier repair" },
  { id:'063', title:"Over-Exfoliation: Signs You've Gone Too Far", kw:"over-exfoliation skin" },
  { id:'064', title:"Dark Circles Under Eyes: Natural Remedies That Actually Work", kw:"dark circles natural remedy" },
  { id:'065', title:"Cracked Heels: Causes and the Best Natural Treatments", kw:"cracked heels natural treatment" },
  { id:'066', title:"Rough Elbows and Knees: How to Soften and Smooth Naturally", kw:"rough elbows knees" },
  { id:'067', title:"Hand Eczema: Treatment and Prevention Tips", kw:"hand eczema treatment" },
  { id:'068', title:"Rosacea and Natural Skincare: What Helps and What Hurts", kw:"rosacea natural skincare" },
  { id:'069', title:"Hormonal Skin Changes: Navigating Your 30s and 40s", kw:"hormonal skin changes" },
  { id:'070', title:"Menopause Skin Changes: What to Expect and How to Adapt", kw:"menopause skin care" },
  { id:'071', title:"Pregnancy Skin Issues: A Complete Natural Care Guide", kw:"pregnancy skin care natural" },
  { id:'072', title:"Winter Itch: Why UK Skin Suffers and How to Fix It", kw:"winter itch UK skin" },
  { id:'073', title:"Contact Dermatitis from Skincare: Identifying and Avoiding Triggers", kw:"contact dermatitis skincare" },
  { id:'074', title:"Dehydration Lines vs Wrinkles: How to Tell and Treat Them", kw:"dehydration lines skin" },
  { id:'075', title:"Perioral Dermatitis: Natural Approaches That Help", kw:"perioral dermatitis natural" },
  { id:'076', title:"Pomegranate Oil for Skin: The Vitamin C Powerhouse", kw:"pomegranate oil skin" },
  { id:'077', title:"Murumuru Butter: The Amazon Beauty Secret for Dry Skin", kw:"murumuru butter skin" },
  { id:'078', title:"Jojoba Oil vs Other Facial Oils: What Makes It Unique", kw:"jojoba oil face" },
  { id:'079', title:"Aloe Vera in Skincare: Beyond the Sunburn Remedy", kw:"aloe vera skincare benefits" },
  { id:'080', title:"Coconut Oil for Skin: Benefits Myths and Best Uses", kw:"coconut oil skin benefits" },
  { id:'081', title:"Monoi de Tahiti Oil: The Pacific Island Beauty Ritual", kw:"monoi oil skin" },
  { id:'082', title:"Shea Butter vs Murumuru Butter: Which Is Better for Dry Skin?", kw:"shea butter vs murumuru" },
  { id:'083', title:"Vitamin E in Skincare: Why It Matters for Healthy Skin", kw:"vitamin E skincare" },
  { id:'084', title:"Lavender Essential Oil in Skincare: Calming Benefits", kw:"lavender oil skincare" },
  { id:'085', title:"Geranium Essential Oil for Skin: Balancing and Brightening", kw:"geranium oil skin" },
  { id:'086', title:"Bergamot Essential Oil in Skincare: The Uplifting Citrus", kw:"bergamot oil skincare" },
  { id:'087', title:"Fatty Acids in Skincare: Omega 3 6 and 9 Explained", kw:"fatty acids skincare" },
  { id:'088', title:"Glycerin in Skincare: The Humble Humectant That Works", kw:"glycerin skincare benefits" },
  { id:'089', title:"Natural Preservatives in Skincare: Safe Alternatives to Parabens", kw:"natural preservatives skincare" },
  { id:'090', title:"Plant-Based Emollients vs Silicones: What's Better for Your Skin", kw:"plant emollients vs silicones" },
  { id:'091', title:"Hyaluronic Acid vs Ghee: Two Approaches to Skin Hydration", kw:"hyaluronic acid vs ghee" },
  { id:'092', title:"Bakuchiol vs Retinol: The Natural Anti-Ageing Alternative", kw:"bakuchiol retinol alternative" },
  { id:'093', title:"Natural Alternatives to Niacinamide for Skin Brightening", kw:"natural niacinamide alternative" },
  { id:'094', title:"Oat Extract in Skincare: The Soothing Powerhouse", kw:"oat extract skincare" },
  { id:'095', title:"Calendula in Skincare: Healing Flowers for Sensitive Skin", kw:"calendula skincare" },
  { id:'096', title:"Centella Asiatica: The Natural Skin Repair Ingredient", kw:"centella asiatica skin" },
  { id:'097', title:"Sea Buckthorn Oil: The Vitamin-Rich Skin Superfood", kw:"sea buckthorn oil skin" },
  { id:'098', title:"How to Read Skincare Ingredient Lists: A Beginner's Guide", kw:"skincare ingredient list" },
  { id:'099', title:"Fragrance in Skincare: Natural vs Synthetic What's Safer?", kw:"fragrance skincare natural" },
  { id:'100', title:"Tocopherol: The Natural Vitamin E Form Your Skin Loves", kw:"tocopherol skin" },
  { id:'101', title:"The Ultimate Skincare Routine for Dry Skin in the UK", kw:"dry skin routine UK" },
  { id:'102', title:"Minimalist Skincare: How to Do More with Less", kw:"minimalist skincare routine" },
  { id:'103', title:"Morning vs Evening Skincare Routine: What Goes When", kw:"morning evening skincare routine" },
  { id:'104', title:"Natural Skincare Routine for Beginners: Where to Start", kw:"natural skincare routine beginner" },
  { id:'105', title:"The 10-Minute Morning Skincare Routine for Busy People", kw:"10 minute morning skincare" },
  { id:'106', title:"Skincare Routine for Over 40s: What Changes and Why", kw:"skincare routine over 40" },
  { id:'107', title:"Skincare Routine for Sensitive Skin: The Gentle Approach", kw:"sensitive skin skincare routine" },
  { id:'108', title:"Body Skincare Routine: Don't Neglect Below the Neck", kw:"body skincare routine" },
  { id:'109', title:"Hand Care Routine: Keeping Hands Soft All Year Round", kw:"hand care routine" },
  { id:'110', title:"Foot Care Routine: Steps to Smooth Healthy Feet", kw:"foot care routine" },
  { id:'111', title:"Winter Skincare Routine: Protecting UK Skin from Cold and Wind", kw:"winter skincare routine UK" },
  { id:'112', title:"Summer Skincare Routine: Adapting to Warm Weather", kw:"summer skincare routine" },
  { id:'113', title:"Skincare Routine While Pregnant: Safe Ingredients Guide", kw:"skincare routine pregnancy" },
  { id:'114', title:"How to Layer Skincare Products in the Correct Order", kw:"skincare layering order" },
  { id:'115', title:"Double Cleansing with a Natural Cleansing Balm: How and Why", kw:"double cleansing balm" },
  { id:'116', title:"The Role of Facial Massage in Your Skincare Routine", kw:"facial massage skincare" },
  { id:'117', title:"Gua Sha and Jade Rolling: Do They Actually Work?", kw:"gua sha jade roller" },
  { id:'118', title:"Facial Steaming: Benefits and How to Do It Safely", kw:"facial steaming benefits" },
  { id:'119', title:"Natural Exfoliation: How Often and Which Method Is Best", kw:"natural exfoliation methods" },
  { id:'120', title:"Lip Care Routine: Steps to Plump Smooth Lips Naturally", kw:"lip care routine natural" },
  { id:'121', title:"Eye Area Care: How to Treat the Most Delicate Skin", kw:"eye area skincare" },
  { id:'122', title:"Neck and Decolletage: The Skincare Area You're Forgetting", kw:"neck decolletage skincare" },
  { id:'123', title:"Night Time Skincare: Making the Most of Skin's Repair Cycle", kw:"night skincare routine" },
  { id:'124', title:"How to Patch Test New Skincare Products Safely", kw:"patch test skincare" },
  { id:'125', title:"Slugging: The Skincare Trend and Natural Alternatives", kw:"slugging skincare natural" },
  { id:'126', title:"Why UK Weather Is So Hard on Your Skin", kw:"UK weather skin damage" },
  { id:'127', title:"London Air Pollution and Its Effect on Your Skin", kw:"London pollution skin" },
  { id:'128', title:"Hard Water Effects on Skin: UK Cities and Solutions", kw:"hard water skin UK" },
  { id:'129', title:"Best Skincare for the British Climate", kw:"best skincare British climate" },
  { id:'130', title:"Natural Skincare Brands Made in the UK: Why Buy British", kw:"UK natural skincare brands" },
  { id:'131', title:"CPSR Testing in the UK: Why It Matters for Skincare Safety", kw:"CPSR skincare UK" },
  { id:'132', title:"Cruelty-Free Skincare UK: How to Shop Ethically", kw:"cruelty-free skincare UK" },
  { id:'133', title:"Skincare for South Asian Skin in the UK: Specific Concerns", kw:"South Asian skin UK skincare" },
  { id:'134', title:"Hyperpigmentation in Darker Skin Tones: UK Guide", kw:"hyperpigmentation dark skin UK" },
  { id:'135', title:"Sustainable Skincare Packaging: UK Brands Leading the Way", kw:"sustainable skincare UK" },
  { id:'136', title:"Gifting Skincare in the UK: What Makes a Thoughtful Present", kw:"skincare gift UK" },
  { id:'137', title:"Eczema Statistics in the UK: A Growing Concern", kw:"eczema UK statistics" },
  { id:'138', title:"Heating Season Skincare: Surviving UK Central Heating Dryness", kw:"central heating dry skin UK" },
  { id:'139', title:"Vitamin D and Skin in the UK: Are You Deficient?", kw:"vitamin D skin UK" },
  { id:'140', title:"Spring Skincare Refresh: UK Edition", kw:"spring skincare UK" },
  { id:'141', title:"Autumn Skincare Transition: Adapting Your Routine for UK Weather", kw:"autumn skincare UK" },
  { id:'142', title:"NHS and Natural Skincare: When to See a Dermatologist", kw:"NHS dermatologist skincare" },
  { id:'143', title:"UK Skincare Regulations: What Brands Must Meet", kw:"UK skincare regulations" },
  { id:'144', title:"Skincare for Mixed-Race Skin: Navigating Unique Needs in the UK", kw:"mixed race skin UK skincare" },
  { id:'145', title:"The Rise of Ayurvedic Skincare in the UK: Why Now?", kw:"Ayurvedic skincare UK trend" },
  { id:'146', title:"What Is a Cleansing Balm and Should You Use One?", kw:"cleansing balm benefits" },
  { id:'147', title:"Night Cream vs Moisturiser: What's the Difference?", kw:"night cream vs moisturiser" },
  { id:'148', title:"Face Cream vs Body Cream: Can You Use the Same Product?", kw:"face cream vs body cream" },
  { id:'149', title:"Natural Face Serums: What They Do and Who Needs One", kw:"natural face serum" },
  { id:'150', title:"Multi-Use Skincare Products: Why Less Can Be More", kw:"multi-use skincare products" },
  { id:'151', title:"When to Use a Body Oil vs a Body Cream", kw:"body oil vs body cream" },
  { id:'152', title:"Lip Balm vs Lip Treatment: What Your Lips Actually Need", kw:"lip balm vs lip treatment" },
  { id:'153', title:"Skincare Gift Sets: How to Choose the Right One", kw:"skincare gift set UK" },
  { id:'154', title:"How Long Does Skincare Last? Shelf Life and PAO Explained", kw:"skincare shelf life PAO" },
  { id:'155', title:"pH Balance in Skincare: Why It Matters for Your Skin", kw:"pH skincare balance" },
  { id:'156', title:"How to Store Your Skincare Products Properly", kw:"store skincare products" },
  { id:'157', title:"Travelling with Skincare: What to Pack and What to Leave", kw:"travel skincare essentials" },
  { id:'158', title:"Skincare at Different Life Stages: Teens to Seniors", kw:"skincare life stages" },
  { id:'159', title:"Men's Skincare with Natural Products: Breaking the Stigma", kw:"men natural skincare" },
  { id:'160', title:"Children's Skincare: When to Start and What to Use", kw:"children skincare natural" },
  { id:'161', title:"Building a Natural Skincare Collection on a Budget", kw:"affordable natural skincare UK" },
  { id:'162', title:"What Handmade Really Means in Skincare", kw:"handmade skincare meaning" },
  { id:'163', title:"Natural vs Organic Skincare: Understanding the Labels", kw:"natural vs organic skincare" },
  { id:'164', title:"Clean Beauty vs Natural Skincare: What's the Difference?", kw:"clean beauty vs natural skincare" },
  { id:'165', title:"Vegan Skincare: What to Look For and What to Avoid", kw:"vegan skincare UK" },
  { id:'166', title:"The Mind-Skin Connection: How Stress Affects Your Complexion", kw:"stress skin health" },
  { id:'167', title:"Sleep and Skin: Why Beauty Sleep Is Scientifically Real", kw:"sleep skin health" },
  { id:'168', title:"Diet for Glowing Skin: Foods That Make a Visible Difference", kw:"diet glowing skin" },
  { id:'169', title:"Hydration and Skin: How Much Water Is Enough?", kw:"water hydration skin" },
  { id:'170', title:"Exercise and Skin Health: The Surprising Positive Effects", kw:"exercise skin health" },
  { id:'171', title:"Gut Health and Skin: The Gut-Brain-Skin Axis Explained", kw:"gut health skin" },
  { id:'172', title:"Sugar and Skin Ageing: Understanding Glycation", kw:"sugar skin ageing glycation" },
  { id:'173', title:"Alcohol and Skin: Effects and How to Support Recovery", kw:"alcohol skin effects" },
  { id:'174', title:"Hormones and Skin: Oestrogen Cortisol and Your Complexion", kw:"hormones skin oestrogen" },
  { id:'175', title:"Screen Time and Skin: Do Phones Cause Premature Ageing?", kw:"screen time skin ageing" },
  { id:'176', title:"Omega Fatty Acids: Supplements for Glowing Skin", kw:"omega fatty acids skin supplements" },
  { id:'177', title:"The Ritual of Self-Care: Making Skincare Mindful", kw:"skincare self-care ritual" },
  { id:'178', title:"Seasonal Affective Disorder and Skin: What's the Link?", kw:"SAD skin health" },
  { id:'179', title:"The Slow Beauty Movement: Fewer Better Products", kw:"slow beauty movement" },
  { id:'180', title:"Natural Skincare and Environmental Impact: Making Better Choices", kw:"natural skincare environment" },
  { id:'181', title:"Meditation for Skin: Can Reducing Cortisol Improve Your Complexion?", kw:"meditation skin health" },
  { id:'182', title:"How to Create a Mindful Skincare Ritual at Home", kw:"mindful skincare ritual" },
  { id:'183', title:"The Psychology of Skincare: Why Beauty Rituals Matter", kw:"psychology skincare rituals" },
  { id:'184', title:"Quitting Sugar: What Happens to Your Skin After 30 Days", kw:"quit sugar skin benefits" },
  { id:'185', title:"Why Self-Care Is Not Selfish: The Case for Skincare Rituals", kw:"self care skincare ritual" },
  { id:'186', title:"The Skin Microbiome: Understanding Your Skin's Living Ecosystem", kw:"skin microbiome" },
  { id:'187', title:"Ceramides in Skincare: The Skin Barrier Building Blocks", kw:"ceramides skin barrier" },
  { id:'188', title:"Collagen and Elastin: Understanding Your Skin's Structure", kw:"collagen elastin skin" },
  { id:'189', title:"Transepidermal Water Loss: Why Your Skin Keeps Drying Out", kw:"transepidermal water loss TEWL" },
  { id:'190', title:"Inflammation and Skin Ageing: The Inflammageing Theory", kw:"inflammageing skin ageing" },
  { id:'191', title:"Antioxidants in Skincare: Fighting Free Radical Damage", kw:"antioxidants skincare free radicals" },
  { id:'192', title:"Humectants vs Emollients vs Occlusives: The Three Moisturiser Types", kw:"humectants emollients occlusives" },
  { id:'193', title:"The Role of the Acid Mantle in Skin Health", kw:"acid mantle skin health" },
  { id:'194', title:"Natural Skincare Preservation: Keeping Products Safe Without Parabens", kw:"natural skincare preservation" },
  { id:'195', title:"Bioavailability in Skincare: Can Your Skin Absorb What You Apply?", kw:"skincare bioavailability absorption" },
  { id:'196', title:"Photodamage and UV Ageing: How Sun Affects UK Skin", kw:"UV damage UK skin" },
  { id:'197', title:"Free Radicals and Antioxidant Defence in Skin", kw:"free radicals antioxidants skin" },
  { id:'198', title:"What Is TEWL and Why Should You Care About It?", kw:"TEWL skin moisture" },
  { id:'199', title:"The Epidermis Explained: How Your Skin Renews Itself", kw:"epidermis skin renewal" },
  { id:'200', title:"The Future of Natural Skincare: Trends and Innovations to Watch", kw:"future natural skincare trends" },
]

const SYSTEM = `You are a senior SEO content writer for Inherited Skincare — a UK brand making handcrafted Ayurvedic ghee-based skincare. Products: Deep Nourishing Cream, Overnight Rejuvenation Cream, Ultimate Soothing Foot Cream, Nourishing Lip Care Set, Radiance Serum, Ghee & Oat Cleansing Balm, gift sets. Brand values: Ghee-powered Ayurvedic skincare · Handmade in the UK · 5.0★ 1,800+ customers · CPSR tested · Natural ingredients.

Return ONLY a valid JSON object — no markdown, no code blocks:
{
  "title": "article title (50-65 chars)",
  "handle": "url-slug-hyphens-lowercase",
  "excerpt": "compelling excerpt (120-155 chars, include primary keyword)",
  "body_html": "full article HTML 650-800 words. Use <h2> subheadings. Use <p> tags. Bold key terms with <strong>. Naturally mention Inherited Skincare 1-2 times. End with <p><strong>Ready to experience the difference?</strong> Try Inherited Skincare's ghee-powered formulas...</p>",
  "tags": ["tag1","tag2","tag3","tag4","tag5"],
  "seo_title": "SEO title tag (50-60 chars, keyword first)",
  "seo_description": "SEO meta description (145-155 chars, keyword + CTA)"
}`

const delay = ms => new Promise(r => setTimeout(r, ms))

async function call(path, method='GET', body) {
  const r = await fetch(`https://api.anthropic.com${path}`, {
    method,
    headers: {
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-beta': 'message-batches-2024-09-24',
      'content-type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!r.ok) throw new Error(`${r.status}: ${await r.text()}`)
  return r.json()
}

async function submit() {
  console.log(`\n📤 Submitting ${TOPICS.length} articles to Anthropic Batch API...`)
  const requests = TOPICS.map(t => ({
    custom_id: `blog-${t.id}`,
    params: {
      model: MODEL,
      max_tokens: 2048,
      system: SYSTEM,
      messages: [{ role: 'user', content: `Write SEO blog: "${t.title}"\nKeyword: "${t.kw}"\nBrand: Inherited Skincare (UK Ayurvedic ghee skincare)` }]
    }
  }))
  const batch = await call('/v1/messages/batches', 'POST', { requests })
  writeFileSync(BATCH_ID_FILE, batch.id)
  console.log(`✅ Batch ID: ${batch.id}`)
  console.log(`   Model: ${MODEL} | ~$0.40 total with 50% batch discount`)
  return batch.id
}

async function poll(id) {
  console.log(`\n⏳ Polling (every 30s)...`)
  while (true) {
    const b = await call(`/v1/messages/batches/${id}`)
    const { succeeded, errored } = b.request_counts
    const done = succeeded + errored + (b.request_counts.canceled||0) + (b.request_counts.expired||0)
    process.stdout.write(`\r   ${b.processing_status} | ${done}/${TOPICS.length} done (${succeeded} ok, ${errored} err)    `)
    if (b.processing_status === 'ended') { console.log('\n✅ Batch complete'); return b }
    await delay(30_000)
  }
}

async function download(id) {
  console.log(`\n📥 Downloading results...`)
  const b = await call(`/v1/messages/batches/${id}`)
  const r = await fetch(b.results_url, {
    headers: { 'x-api-key': ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01', 'anthropic-beta': 'message-batches-2024-09-24' }
  })
  const lines = (await r.text()).trim().split('\n').filter(Boolean)
  const results = lines.map(l => JSON.parse(l))

  // Parse + validate each article
  const articles = []
  for (const res of results) {
    if (res.result?.type !== 'succeeded') { console.log(`  ⚠️  ${res.custom_id}: ${res.result?.type}`); continue }
    try {
      const raw = res.result.message.content[0].text
      const json = raw.replace(/^```json?\n?/,'').replace(/\n?```$/,'').trim()
      const art = JSON.parse(json)
      art._id = res.custom_id
      articles.push(art)
    } catch(e) {
      console.log(`  ⚠️  Parse error ${res.custom_id}: ${e.message}`)
    }
  }

  writeFileSync(RESULTS_FILE, JSON.stringify(articles, null, 2))
  console.log(`✅ Saved ${articles.length} articles to scripts/blog_results.json`)
  return articles
}

async function main() {
  console.log('🌿 Inherited Skincare — Blog Content Generator (Phase 1)')
  let batchId = existsSync(BATCH_ID_FILE) ? readFileSync(BATCH_ID_FILE,'utf8').trim() : null
  if (batchId) console.log(`♻️  Resuming batch: ${batchId}`)
  else batchId = await submit()

  if (!existsSync(RESULTS_FILE)) {
    await poll(batchId)
    await download(batchId)
  } else {
    console.log(`\n♻️  Results already at scripts/blog_results.json`)
  }
  console.log('\n✅ Phase 1 complete — ready for Shopify upload')
}

main().catch(e => { console.error('\n❌', e.message); process.exit(1) })
