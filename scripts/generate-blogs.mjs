/**
 * Inherited Skincare — 200 SEO Blog Generator
 * Uses Anthropic Batch API (50% cost discount) with claude-haiku-4-5-20251001
 * Then creates all articles directly in Shopify via Admin API
 *
 * Cost estimate: ~$0.40 total for 200 articles
 * Usage: ANTHROPIC_API_KEY=sk-ant-... node scripts/generate-blogs.mjs
 */

import { writeFileSync, readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ─── Config ───────────────────────────────────────────────────────────────────
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
const SHOPIFY_TOKEN     = process.env.SHOPIFY_ADMIN_TOKEN
const SHOPIFY_STORE     = 'leela-skincare.myshopify.com'
const SHOPIFY_BLOG_GID  = 'gid://shopify/Blog/87354835172'
const BATCH_ID_FILE     = join(__dirname, 'batch_id.txt')
const RESULTS_FILE      = join(__dirname, 'blog_results.json')
const MODEL             = 'claude-haiku-4-5-20251001'

if (!ANTHROPIC_API_KEY) {
  console.error('ERROR: Set ANTHROPIC_API_KEY=sk-ant-... environment variable')
  process.exit(1)
}
if (!SHOPIFY_TOKEN) {
  console.error('ERROR: Set SHOPIFY_ADMIN_TOKEN=shpat_... environment variable')
  console.error('Get it: Shopify Admin → Settings → Apps → Develop apps → create app → Articles (write) → Install → copy Admin API access token')
  process.exit(1)
}

// ─── 200 SEO Topics ───────────────────────────────────────────────────────────
const TOPICS = [
  // Ghee Skincare (25)
  { id: '001', title: 'What Is Ghee Skincare? The Ancient Beauty Secret Explained', keyword: 'ghee skincare' },
  { id: '002', title: 'Ghee for Dry Skin: Does It Really Work?', keyword: 'ghee for dry skin' },
  { id: '003', title: 'How Washed Ghee Penetrates All Seven Layers of Skin', keyword: 'ghee skin penetration' },
  { id: '004', title: 'Ghee vs Coconut Oil: Which Is Better for Your Skin?', keyword: 'ghee vs coconut oil skin' },
  { id: '005', title: 'The Science Behind Ghee as a Natural Moisturiser', keyword: 'ghee natural moisturiser' },
  { id: '006', title: 'Ghee for Eczema: What the Research Says', keyword: 'ghee for eczema' },
  { id: '007', title: 'Can Ghee Brighten Your Skin? Here\'s What We Know', keyword: 'ghee skin brightening' },
  { id: '008', title: 'Using Ghee on Your Face: Benefits and How to Do It Right', keyword: 'ghee face cream' },
  { id: '009', title: 'Ghee for Cracked Heels: The Ultimate Natural Remedy', keyword: 'ghee cracked heels' },
  { id: '010', title: 'Butyric Acid in Ghee: The Skin-Healing Fatty Acid', keyword: 'butyric acid skin' },
  { id: '011', title: 'Ghee for Sensitive Skin: A Gentle Alternative to Chemicals', keyword: 'ghee sensitive skin' },
  { id: '012', title: 'Ghee in Winter Skincare: Perfect for UK Cold Weather', keyword: 'ghee winter skincare UK' },
  { id: '013', title: 'The History of Ghee in Ayurvedic Beauty Rituals', keyword: 'ghee Ayurvedic beauty' },
  { id: '014', title: 'Ghee for Lips: The Best Natural Lip Treatment', keyword: 'ghee lip treatment' },
  { id: '015', title: 'Why Ghee Is Better Than Petroleum Jelly for Dry Skin', keyword: 'ghee vs petroleum jelly' },
  { id: '016', title: 'Ghee for Psoriasis: Relief from an Ancient Remedy', keyword: 'ghee psoriasis' },
  { id: '017', title: 'Ghee as a Night Cream: Wake Up with Glowing Skin', keyword: 'ghee night cream' },
  { id: '018', title: 'Organic Ghee vs Regular Ghee for Skin: What\'s the Difference?', keyword: 'organic ghee skincare' },
  { id: '019', title: 'Ghee and Vitamin A: The Anti-Ageing Connection', keyword: 'ghee vitamin A anti-ageing' },
  { id: '020', title: 'Ghee for Stretch Marks: Can It Help?', keyword: 'ghee stretch marks' },
  { id: '021', title: 'Ghee for Baby Skin: Safe and Effective?', keyword: 'ghee baby skin' },
  { id: '022', title: 'Ghee and Turmeric for Skin: The Golden Duo', keyword: 'ghee turmeric skin' },
  { id: '023', title: 'Ghee for Perioral Dermatitis: Gentle Care for Sensitive Faces', keyword: 'ghee perioral dermatitis' },
  { id: '024', title: 'How to Test If Your Skincare Contains Real Ghee', keyword: 'real ghee skincare' },
  { id: '025', title: 'Ghee for Men\'s Skin: The Natural Alternative to Heavy Creams', keyword: 'ghee men skincare' },
  // Ayurvedic Skincare (25)
  { id: '026', title: 'What Is Ayurvedic Skincare? A Beginner\'s Guide', keyword: 'Ayurvedic skincare' },
  { id: '027', title: 'The Three Doshas and Your Skin Type Explained', keyword: 'doshas skin type' },
  { id: '028', title: 'Ayurvedic Morning Skincare Ritual for Glowing Skin', keyword: 'Ayurvedic morning skincare' },
  { id: '029', title: 'Dinacharya: The Ayurvedic Daily Routine for Beautiful Skin', keyword: 'dinacharya skin routine' },
  { id: '030', title: 'Ayurvedic Herbs for Glowing Skin: Top 10 You Should Know', keyword: 'Ayurvedic herbs skin' },
  { id: '031', title: 'How Ayurveda Explains Dry Skin and How to Fix It', keyword: 'Ayurveda dry skin' },
  { id: '032', title: 'Pitta Skin: How to Balance and Calm Reactive Skin Naturally', keyword: 'pitta skin Ayurveda' },
  { id: '033', title: 'Vata Skin: The Ultimate Guide to Nourishing Dry, Thin Skin', keyword: 'vata skin dry' },
  { id: '034', title: 'Kapha Skin: How to Brighten and Energise Your Complexion', keyword: 'kapha skin type' },
  { id: '035', title: 'Ayurvedic Face Packs for Every Skin Type', keyword: 'Ayurvedic face pack' },
  { id: '036', title: 'Triphala for Skin: Benefits and How to Use It', keyword: 'triphala skin benefits' },
  { id: '037', title: 'Ashwagandha for Skin: Anti-Stress Beauty Benefits', keyword: 'ashwagandha skin' },
  { id: '038', title: 'Neem in Ayurvedic Skincare: Purifying Properties', keyword: 'neem skincare Ayurveda' },
  { id: '039', title: 'Turmeric in Ayurvedic Skincare: The Golden Spice for Radiance', keyword: 'turmeric skincare' },
  { id: '040', title: 'Rose Water in Ayurvedic Skincare: The Soothing Toner', keyword: 'rose water Ayurvedic toner' },
  { id: '041', title: 'Licorice Root in Ayurveda: Natural Skin Brightener', keyword: 'licorice root skin' },
  { id: '042', title: 'Sandalwood in Ayurveda: Cooling and Calming Skin Benefits', keyword: 'sandalwood skincare' },
  { id: '043', title: 'Kumkumadi: The Ancient Ayurvedic Face Oil Ritual', keyword: 'kumkumadi face oil' },
  { id: '044', title: 'Ayurvedic Skincare During Pregnancy: What\'s Safe', keyword: 'Ayurvedic skincare pregnancy' },
  { id: '045', title: 'Seasonal Skincare in Ayurveda: Adapting Your Routine', keyword: 'Ayurveda seasonal skincare' },
  { id: '046', title: 'Panchakarma and Skin Health: What You Need to Know', keyword: 'panchakarma skin' },
  { id: '047', title: 'Abhyanga: The Ayurvedic Oil Massage Your Skin Needs', keyword: 'abhyanga oil massage skin' },
  { id: '048', title: 'Ayurvedic Diet for Clear, Radiant Skin', keyword: 'Ayurvedic diet skin' },
  { id: '049', title: 'Combining Modern and Ayurvedic Skincare: A Practical Guide', keyword: 'modern Ayurvedic skincare' },
  { id: '050', title: 'Ayurvedic Medicine and Modern Dermatology: Where They Meet', keyword: 'Ayurveda dermatology' },
  // Skin Concerns (25)
  { id: '051', title: 'Eczema Skincare Routine: A Complete Guide for UK Sufferers', keyword: 'eczema skincare routine UK' },
  { id: '052', title: 'How to Soothe Eczema Naturally Without Steroids', keyword: 'soothe eczema naturally' },
  { id: '053', title: 'Eczema vs Psoriasis: How to Tell the Difference', keyword: 'eczema vs psoriasis' },
  { id: '054', title: 'The Best Natural Moisturisers for Eczema-Prone Skin', keyword: 'natural moisturiser eczema' },
  { id: '055', title: 'Common Eczema Triggers to Avoid: A Practical Guide', keyword: 'eczema triggers' },
  { id: '056', title: 'Dry Skin vs Dehydrated Skin: What\'s the Difference?', keyword: 'dry skin vs dehydrated skin' },
  { id: '057', title: 'How to Fix Dry Skin Overnight: The Best Natural Remedies', keyword: 'fix dry skin overnight' },
  { id: '058', title: 'Pigmentation and Dark Spots: Natural Ways to Fade Them', keyword: 'natural fade dark spots' },
  { id: '059', title: 'Post-Inflammatory Hyperpigmentation: A Guide for Darker Skin', keyword: 'hyperpigmentation dark skin' },
  { id: '060', title: 'How to Reduce Redness on Sensitive Skin Naturally', keyword: 'reduce skin redness naturally' },
  { id: '061', title: 'Sensitive Skin Routine: The Gentle Approach That Works', keyword: 'sensitive skin routine' },
  { id: '062', title: 'Skin Barrier Repair: Signs It\'s Damaged and How to Fix It', keyword: 'skin barrier repair' },
  { id: '063', title: 'Over-Exfoliation: Signs You\'ve Gone Too Far', keyword: 'over-exfoliation skin' },
  { id: '064', title: 'Dark Circles Under Eyes: Natural Remedies That Actually Work', keyword: 'dark circles natural remedy' },
  { id: '065', title: 'Cracked Heels: Causes and the Best Natural Treatments', keyword: 'cracked heels natural treatment' },
  { id: '066', title: 'Rough Elbows and Knees: How to Soften and Smooth Naturally', keyword: 'rough elbows knees' },
  { id: '067', title: 'Hand Eczema: Treatment and Prevention Tips', keyword: 'hand eczema treatment' },
  { id: '068', title: 'Rosacea and Natural Skincare: What Helps and What Hurts', keyword: 'rosacea natural skincare' },
  { id: '069', title: 'Hormonal Skin Changes: Navigating Your 30s and 40s', keyword: 'hormonal skin changes' },
  { id: '070', title: 'Menopause Skin Changes: What to Expect and How to Adapt', keyword: 'menopause skin care' },
  { id: '071', title: 'Pregnancy Skin Issues: A Complete Natural Guide', keyword: 'pregnancy skin care natural' },
  { id: '072', title: 'Winter Itch: Why UK Skin Suffers and How to Fix It', keyword: 'winter itch UK skin' },
  { id: '073', title: 'Contact Dermatitis from Skincare: Identifying and Avoiding Triggers', keyword: 'contact dermatitis skincare' },
  { id: '074', title: 'Dehydration Lines vs Wrinkles: How to Tell and Treat', keyword: 'dehydration lines skin' },
  { id: '075', title: 'Perioral Dermatitis: Natural Approaches That Help', keyword: 'perioral dermatitis natural' },
  // Natural Ingredients (25)
  { id: '076', title: 'Pomegranate Oil for Skin: The Vitamin C Powerhouse', keyword: 'pomegranate oil skin' },
  { id: '077', title: 'Murumuru Butter: The Amazon Beauty Secret for Dry Skin', keyword: 'murumuru butter skin' },
  { id: '078', title: 'Jojoba Oil vs Other Facial Oils: What Makes It Unique', keyword: 'jojoba oil face' },
  { id: '079', title: 'Aloe Vera in Skincare: Beyond the Sunburn Remedy', keyword: 'aloe vera skincare benefits' },
  { id: '080', title: 'Coconut Oil for Skin: Benefits, Myths, and Best Uses', keyword: 'coconut oil skin benefits' },
  { id: '081', title: 'Monoi de Tahiti Oil: The Pacific Island Beauty Ritual', keyword: 'monoi oil skin' },
  { id: '082', title: 'Shea Butter vs Murumuru Butter: Which Is Better for Dry Skin?', keyword: 'shea butter vs murumuru butter' },
  { id: '083', title: 'Vitamin E in Skincare: Why It Matters for Healthy Skin', keyword: 'vitamin E skincare' },
  { id: '084', title: 'Lavender Essential Oil in Skincare: Calming Benefits', keyword: 'lavender oil skincare' },
  { id: '085', title: 'Geranium Essential Oil for Skin: Balancing and Brightening', keyword: 'geranium oil skin' },
  { id: '086', title: 'Bergamot Essential Oil in Skincare: The Uplifting Citrus', keyword: 'bergamot oil skincare' },
  { id: '087', title: 'Fatty Acids in Skincare: Omega 3, 6, and 9 Explained', keyword: 'fatty acids skincare' },
  { id: '088', title: 'Glycerin in Skincare: The Humble Humectant That Works', keyword: 'glycerin skincare benefits' },
  { id: '089', title: 'Natural Preservatives in Skincare: Safe Alternatives to Parabens', keyword: 'natural preservatives skincare' },
  { id: '090', title: 'Plant-Based Emollients vs Silicones: What\'s Better for Your Skin', keyword: 'plant emollients vs silicones' },
  { id: '091', title: 'Hyaluronic Acid vs Ghee: Two Approaches to Skin Hydration', keyword: 'hyaluronic acid vs ghee' },
  { id: '092', title: 'Bakuchiol vs Retinol: The Natural Anti-Ageing Alternative', keyword: 'bakuchiol retinol alternative' },
  { id: '093', title: 'Natural Alternatives to Niacinamide for Skin Brightening', keyword: 'natural niacinamide alternative' },
  { id: '094', title: 'Oat Extract in Skincare: The Soothing Powerhouse', keyword: 'oat extract skincare' },
  { id: '095', title: 'Calendula in Skincare: Healing Flowers for Sensitive Skin', keyword: 'calendula skincare' },
  { id: '096', title: 'Centella Asiatica: The Natural Skin Repair Ingredient', keyword: 'centella asiatica skin' },
  { id: '097', title: 'Sea Buckthorn Oil: The Vitamin-Rich Skin Superfood', keyword: 'sea buckthorn oil skin' },
  { id: '098', title: 'How to Read Skincare Ingredient Lists: A Beginner\'s Guide', keyword: 'skincare ingredient list' },
  { id: '099', title: 'Fragrance in Skincare: Natural vs Synthetic — What\'s Safer?', keyword: 'fragrance skincare natural' },
  { id: '100', title: 'Tocopherol: The Natural Vitamin E Form Your Skin Loves', keyword: 'tocopherol skin' },
  // Skincare Routines (25)
  { id: '101', title: 'The Ultimate Skincare Routine for Dry Skin in the UK', keyword: 'dry skin routine UK' },
  { id: '102', title: 'Minimalist Skincare: How to Do More with Less', keyword: 'minimalist skincare routine' },
  { id: '103', title: 'Morning vs Evening Skincare Routine: What Goes When', keyword: 'morning evening skincare routine' },
  { id: '104', title: 'Natural Skincare Routine for Beginners: Where to Start', keyword: 'natural skincare routine beginner' },
  { id: '105', title: 'The 10-Minute Morning Skincare Routine for Busy People', keyword: '10 minute morning skincare' },
  { id: '106', title: 'Skincare Routine for Over 40s: What Changes and Why', keyword: 'skincare routine over 40' },
  { id: '107', title: 'Skincare Routine for Sensitive Skin: The Gentle Approach', keyword: 'sensitive skin skincare routine' },
  { id: '108', title: 'Body Skincare Routine: Don\'t Neglect Below the Neck', keyword: 'body skincare routine' },
  { id: '109', title: 'Hand Care Routine: Keeping Hands Soft All Year Round', keyword: 'hand care routine' },
  { id: '110', title: 'Foot Care Routine: Steps to Smooth, Healthy Feet', keyword: 'foot care routine' },
  { id: '111', title: 'Winter Skincare Routine: Protecting UK Skin from Cold and Wind', keyword: 'winter skincare routine UK' },
  { id: '112', title: 'Summer Skincare Routine: Adapting to Warm Weather', keyword: 'summer skincare routine' },
  { id: '113', title: 'Skincare Routine While Pregnant: Safe Ingredients Guide', keyword: 'skincare routine pregnancy' },
  { id: '114', title: 'How to Layer Skincare Products in the Correct Order', keyword: 'skincare layering order' },
  { id: '115', title: 'Double Cleansing with a Natural Cleansing Balm: How and Why', keyword: 'double cleansing balm' },
  { id: '116', title: 'The Role of Facial Massage in Your Skincare Routine', keyword: 'facial massage skincare' },
  { id: '117', title: 'Gua Sha and Jade Rolling: Do They Actually Work?', keyword: 'gua sha jade roller' },
  { id: '118', title: 'Facial Steaming: Benefits and How to Do It Safely', keyword: 'facial steaming benefits' },
  { id: '119', title: 'Natural Exfoliation: How Often and Which Method Is Best', keyword: 'natural exfoliation methods' },
  { id: '120', title: 'Lip Care Routine: Steps to Plump, Smooth Lips Naturally', keyword: 'lip care routine natural' },
  { id: '121', title: 'Eye Area Care: How to Treat the Most Delicate Skin', keyword: 'eye area skincare' },
  { id: '122', title: 'Neck and Décolletage: The Skincare Area You\'re Forgetting', keyword: 'neck décolletage skincare' },
  { id: '123', title: 'Night Time Skincare: Making the Most of Your Skin\'s Repair Cycle', keyword: 'night skincare routine' },
  { id: '124', title: 'How to Patch Test New Skincare Products Safely', keyword: 'patch test skincare' },
  { id: '125', title: 'Slugging: The Skincare Trend and Natural Alternatives', keyword: 'slugging skincare natural' },
  // UK-Specific (20)
  { id: '126', title: 'Why UK Weather Is So Hard on Your Skin', keyword: 'UK weather skin damage' },
  { id: '127', title: 'London Air Pollution and Its Effect on Your Skin', keyword: 'London pollution skin' },
  { id: '128', title: 'Hard Water Effects on Skin: UK Cities and Solutions', keyword: 'hard water skin UK' },
  { id: '129', title: 'Best Skincare for the British Climate', keyword: 'best skincare British climate' },
  { id: '130', title: 'Natural Skincare Brands Made in the UK: Why Buy British', keyword: 'UK natural skincare brands' },
  { id: '131', title: 'CPSR Testing in the UK: Why It Matters for Skincare Safety', keyword: 'CPSR skincare UK' },
  { id: '132', title: 'Cruelty-Free Skincare UK: How to Shop Ethically', keyword: 'cruelty-free skincare UK' },
  { id: '133', title: 'Skincare for South Asian Skin in the UK: Specific Concerns', keyword: 'South Asian skin UK skincare' },
  { id: '134', title: 'Hyperpigmentation in Darker Skin Tones: UK Guide', keyword: 'hyperpigmentation dark skin UK' },
  { id: '135', title: 'Sustainable Skincare Packaging: UK Brands Leading the Way', keyword: 'sustainable skincare UK' },
  { id: '136', title: 'Gifting Skincare in the UK: What Makes a Thoughtful Present', keyword: 'skincare gift UK' },
  { id: '137', title: 'Eczema Statistics in the UK: A Growing Concern', keyword: 'eczema UK statistics' },
  { id: '138', title: 'Heating Season Skincare: Surviving UK Central Heating Dryness', keyword: 'central heating dry skin UK' },
  { id: '139', title: 'Vitamin D and Skin in the UK: Are You Deficient?', keyword: 'vitamin D skin UK' },
  { id: '140', title: 'Spring Skincare Refresh: UK Edition', keyword: 'spring skincare UK' },
  { id: '141', title: 'Autumn Skincare Transition: Adapting Your Routine for UK Weather', keyword: 'autumn skincare UK' },
  { id: '142', title: 'NHS and Natural Skincare: When to See a Dermatologist', keyword: 'NHS dermatologist skincare' },
  { id: '143', title: 'UK Skincare Regulations: What Brands Must Meet', keyword: 'UK skincare regulations' },
  { id: '144', title: 'Skincare for Mixed-Race Skin: Navigating Unique Needs in the UK', keyword: 'mixed race skin UK skincare' },
  { id: '145', title: 'The Rise of Ayurvedic Skincare in the UK: Why Now?', keyword: 'Ayurvedic skincare UK trend' },
  // Product Education (20)
  { id: '146', title: 'What Is a Cleansing Balm and Should You Use One?', keyword: 'cleansing balm benefits' },
  { id: '147', title: 'Night Cream vs Moisturiser: What\'s the Difference?', keyword: 'night cream vs moisturiser' },
  { id: '148', title: 'Face Cream vs Body Cream: Can You Use the Same Product?', keyword: 'face cream vs body cream' },
  { id: '149', title: 'Natural Face Serums: What They Do and Who Needs One', keyword: 'natural face serum' },
  { id: '150', title: 'Multi-Use Skincare Products: Why Less Can Be More', keyword: 'multi-use skincare products' },
  { id: '151', title: 'When to Use a Body Oil vs a Body Cream', keyword: 'body oil vs body cream' },
  { id: '152', title: 'Lip Balm vs Lip Treatment: What Your Lips Actually Need', keyword: 'lip balm vs lip treatment' },
  { id: '153', title: 'Skincare Gift Sets: How to Choose the Right One', keyword: 'skincare gift set UK' },
  { id: '154', title: 'How Long Does Skincare Last? Shelf Life and PAO Explained', keyword: 'skincare shelf life PAO' },
  { id: '155', title: 'pH Balance in Skincare: Why It Matters for Your Skin', keyword: 'pH skincare balance' },
  { id: '156', title: 'How to Store Your Skincare Products Properly', keyword: 'store skincare products' },
  { id: '157', title: 'Travelling with Skincare: What to Pack and What to Leave', keyword: 'travel skincare essentials' },
  { id: '158', title: 'Skincare at Different Life Stages: Teens to Seniors', keyword: 'skincare life stages' },
  { id: '159', title: 'Men\'s Skincare with Natural Products: Breaking the Stigma', keyword: 'men natural skincare' },
  { id: '160', title: 'Children\'s Skincare: When to Start and What to Use', keyword: 'children skincare natural' },
  { id: '161', title: 'Building a Natural Skincare Collection on a Budget', keyword: 'affordable natural skincare UK' },
  { id: '162', title: 'What "Handmade" Really Means in Skincare', keyword: 'handmade skincare meaning' },
  { id: '163', title: 'Natural vs Organic Skincare: Understanding the Labels', keyword: 'natural vs organic skincare' },
  { id: '164', title: 'Clean Beauty vs Natural Skincare: What\'s the Difference?', keyword: 'clean beauty vs natural skincare' },
  { id: '165', title: 'Vegan Skincare: What to Look For and What to Avoid', keyword: 'vegan skincare UK' },
  // Wellness & Lifestyle (20)
  { id: '166', title: 'The Mind-Skin Connection: How Stress Affects Your Complexion', keyword: 'stress skin health' },
  { id: '167', title: 'Sleep and Skin: Why Beauty Sleep Is Scientifically Real', keyword: 'sleep skin health' },
  { id: '168', title: 'Diet for Glowing Skin: Foods That Make a Visible Difference', keyword: 'diet glowing skin' },
  { id: '169', title: 'Hydration and Skin: How Much Water Is Enough?', keyword: 'water hydration skin' },
  { id: '170', title: 'Exercise and Skin Health: The Surprising Positive Effects', keyword: 'exercise skin health' },
  { id: '171', title: 'Gut Health and Skin: The Gut-Brain-Skin Axis Explained', keyword: 'gut health skin' },
  { id: '172', title: 'Sugar and Skin Ageing: Understanding Glycation', keyword: 'sugar skin ageing glycation' },
  { id: '173', title: 'Alcohol and Skin: Effects and How to Support Recovery', keyword: 'alcohol skin effects' },
  { id: '174', title: 'Hormones and Skin: Oestrogen, Cortisol, and Your Complexion', keyword: 'hormones skin oestrogen' },
  { id: '175', title: 'Screen Time and Skin: Do Phones Cause Premature Ageing?', keyword: 'screen time skin ageing' },
  { id: '176', title: 'Omega Fatty Acids: Supplements for Glowing Skin', keyword: 'omega fatty acids skin supplements' },
  { id: '177', title: 'The Ritual of Self-Care: Making Skincare Mindful', keyword: 'skincare self-care ritual' },
  { id: '178', title: 'Seasonal Affective Disorder and Skin: What\'s the Link?', keyword: 'SAD skin health' },
  { id: '179', title: 'The Slow Beauty Movement: Fewer, Better Products', keyword: 'slow beauty movement' },
  { id: '180', title: 'Natural Skincare and Environmental Impact: Making Better Choices', keyword: 'natural skincare environment' },
  { id: '181', title: 'Meditation for Skin: Can Reducing Cortisol Improve Your Complexion?', keyword: 'meditation skin health' },
  { id: '182', title: 'How to Create a Mindful Skincare Ritual at Home', keyword: 'mindful skincare ritual' },
  { id: '183', title: 'The Psychology of Skincare: Why Beauty Rituals Matter', keyword: 'psychology skincare rituals' },
  { id: '184', title: 'Quitting Sugar: What Happens to Your Skin After 30 Days', keyword: 'quit sugar skin benefits' },
  { id: '185', title: 'Why Self-Care Isn\'t Selfish: The Case for Skincare Rituals', keyword: 'self care skincare ritual' },
  // Science & Advanced (15)
  { id: '186', title: 'The Skin Microbiome: Understanding Your Skin\'s Living Ecosystem', keyword: 'skin microbiome' },
  { id: '187', title: 'Ceramides in Skincare: The Skin Barrier Building Blocks', keyword: 'ceramides skin barrier' },
  { id: '188', title: 'Collagen and Elastin: Understanding Your Skin\'s Structure', keyword: 'collagen elastin skin' },
  { id: '189', title: 'Transepidermal Water Loss: Why Your Skin Keeps Drying Out', keyword: 'transepidermal water loss TEWL' },
  { id: '190', title: 'Inflammation and Skin Ageing: The Inflammageing Theory', keyword: 'inflammageing skin ageing' },
  { id: '191', title: 'Antioxidants in Skincare: Fighting Free Radical Damage', keyword: 'antioxidants skincare free radicals' },
  { id: '192', title: 'Humectants vs Emollients vs Occlusives: The Three Moisturiser Types', keyword: 'humectants emollients occlusives' },
  { id: '193', title: 'The Role of the Acid Mantle in Skin Health', keyword: 'acid mantle skin health' },
  { id: '194', title: 'Natural Skincare Preservation: Keeping Products Safe Without Parabens', keyword: 'natural skincare preservation' },
  { id: '195', title: 'Bioavailability in Skincare: Can Your Skin Actually Absorb Ingredients?', keyword: 'skincare bioavailability absorption' },
  { id: '196', title: 'Photodamage and UV Ageing: How Sun Affects UK Skin', keyword: 'UV damage UK skin' },
  { id: '197', title: 'Free Radicals and Antioxidant Defence in Skin', keyword: 'free radicals antioxidants skin' },
  { id: '198', title: 'What Is TEWL and Why Should You Care About It?', keyword: 'TEWL skin moisture' },
  { id: '199', title: 'The Epidermis Explained: How Your Skin Renews Itself', keyword: 'epidermis skin renewal' },
  { id: '200', title: 'The Future of Natural Skincare: Trends and Innovations to Watch', keyword: 'future natural skincare trends' },
]

// ─── System Prompt ─────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are a senior SEO content writer for Inherited Skincare, a UK brand making handcrafted Ayurvedic ghee-based skincare products. Products include: Deep Nourishing Cream, Overnight Rejuvenation Cream, Ultimate Soothing Foot Cream, Nourishing Lip Care Set, Radiance Serum, Ghee & Oat Cleansing Balm, and gift sets. The brand stands for: Ghee-powered Ayurvedic skincare · Handmade in the UK · 5.0★ from 1,800+ customers · CPSR tested · Natural ingredients.

Write an SEO-optimised blog article. Return ONLY a JSON object with these exact fields:
{
  "title": "exact article title (50-65 chars)",
  "handle": "url-slug-lowercase-hyphens",
  "excerpt": "compelling meta description (120-155 chars, include primary keyword)",
  "body_html": "full HTML article (600-800 words). Use <h2> subheadings. Bold key terms. Use <p> tags. No <html>/<head>/<body>. Mention Inherited Skincare naturally 1-2 times where relevant. End with a short <p><strong>Ready to try?</strong>...</p> CTA paragraph.",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "seo_title": "SEO page title (50-60 chars, keyword near start)",
  "seo_description": "SEO meta description (145-155 chars, include keyword + CTA)"
}
Output ONLY the JSON. No markdown, no code blocks, no explanation.`

// ─── Helpers ───────────────────────────────────────────────────────────────────
const delay = ms => new Promise(r => setTimeout(r, ms))

async function anthropicFetch(path, method = 'GET', body) {
  const res = await fetch(`https://api.anthropic.com${path}`, {
    method,
    headers: {
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-beta': 'message-batches-2024-09-24',
      'content-type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Anthropic API ${res.status}: ${text}`)
  }
  return res.json()
}

async function shopifyMutation(query, variables) {
  const res = await fetch(
    `https://${SHOPIFY_STORE}/admin/api/2024-10/graphql.json`,
    {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    }
  )
  return res.json()
}

// ─── Step 1: Submit Batch ──────────────────────────────────────────────────────
async function submitBatch() {
  console.log(`\n📤 Submitting batch of ${TOPICS.length} articles to Anthropic...`)
  const requests = TOPICS.map(topic => ({
    custom_id: `blog-${topic.id}`,
    params: {
      model: MODEL,
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: `Write an SEO blog article about: "${topic.title}"\nPrimary keyword: "${topic.keyword}"\nBrand: Inherited Skincare (UK, Ayurvedic ghee skincare)`
      }]
    }
  }))

  const batch = await anthropicFetch('/v1/messages/batches', 'POST', { requests })
  console.log(`✅ Batch submitted: ${batch.id}`)
  console.log(`   Processing model: ${MODEL} (50% batch discount)`)
  writeFileSync(BATCH_ID_FILE, batch.id)
  return batch.id
}

// ─── Step 2: Poll Until Complete ───────────────────────────────────────────────
async function pollBatch(batchId) {
  console.log(`\n⏳ Polling batch ${batchId}...`)
  while (true) {
    const batch = await anthropicFetch(`/v1/messages/batches/${batchId}`)
    const { processing_status, request_counts } = batch
    const { succeeded, errored, canceled, expired } = request_counts
    const total = TOPICS.length
    const done = succeeded + errored + canceled + expired
    console.log(`   Status: ${processing_status} | ${done}/${total} done (${succeeded} ok, ${errored} errors)`)

    if (processing_status === 'ended') {
      console.log(`✅ Batch complete: ${succeeded} succeeded, ${errored} errors`)
      return batch
    }
    await delay(30_000) // poll every 30 seconds
  }
}

// ─── Step 3: Download Results ──────────────────────────────────────────────────
async function downloadResults(batchId) {
  console.log(`\n📥 Downloading results...`)
  const batch = await anthropicFetch(`/v1/messages/batches/${batchId}`)
  const res = await fetch(batch.results_url, {
    headers: {
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-beta': 'message-batches-2024-09-24',
    }
  })
  const text = await res.text()
  // Results are JSONL — one JSON object per line
  const lines = text.trim().split('\n').filter(Boolean)
  const results = lines.map(line => JSON.parse(line))
  writeFileSync(RESULTS_FILE, JSON.stringify(results, null, 2))
  console.log(`✅ Downloaded ${results.length} results`)
  return results
}

// ─── Step 4: Create Shopify Articles ──────────────────────────────────────────
async function createShopifyArticles(results) {
  console.log(`\n🛒 Creating ${results.length} Shopify articles...`)
  let created = 0, errors = 0

  for (const result of results) {
    if (result.result?.type !== 'succeeded') {
      console.log(`  ⚠️  Skipping ${result.custom_id}: ${result.result?.type}`)
      errors++
      continue
    }

    let article
    try {
      const rawText = result.result.message.content[0].text
      // Strip markdown code blocks if model added them
      const jsonText = rawText.replace(/^```json?\n?/,'').replace(/\n?```$/,'').trim()
      article = JSON.parse(jsonText)
    } catch (e) {
      console.log(`  ⚠️  JSON parse error for ${result.custom_id}: ${e.message}`)
      errors++
      continue
    }

    const mutation = `
      mutation ArticleCreate($article: ArticleCreateInput!) {
        articleCreate(article: $article) {
          article { id title handle }
          userErrors { field message }
        }
      }
    `
    const variables = {
      article: {
        blogId: SHOPIFY_BLOG_GID,
        title: article.title,
        body: article.body_html,
        summary: article.excerpt,
        tags: article.tags || [],
        published: true,
        author: { name: 'Inherited Skincare' },
        seo: {
          title: article.seo_title || article.title,
          description: article.seo_description || article.excerpt,
        },
      }
    }

    try {
      const data = await shopifyMutation(mutation, variables)
      if (data.data?.articleCreate?.userErrors?.length) {
        const errs = data.data.articleCreate.userErrors.map(e => e.message).join(', ')
        console.log(`  ❌ Shopify error for "${article.title}": ${errs}`)
        errors++
      } else {
        const a = data.data?.articleCreate?.article
        console.log(`  ✅ [${++created}/${results.length}] ${a?.title}`)
      }
    } catch (e) {
      console.log(`  ❌ Network error for "${article.title}": ${e.message}`)
      errors++
    }

    // Gentle rate limiting — Shopify Admin API = 2 req/s for REST, higher for GraphQL
    await delay(200)
  }

  console.log(`\n🎉 Done! Created ${created} articles, ${errors} errors.`)
}

// ─── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🌿 Inherited Skincare — 200 Blog Generator')
  console.log(`   Model: ${MODEL} (Batch API — ~50% cost discount)`)
  console.log(`   Estimated cost: ~$0.40 for all 200 articles\n`)

  let batchId

  // Resume if batch already submitted
  if (existsSync(BATCH_ID_FILE)) {
    batchId = readFileSync(BATCH_ID_FILE, 'utf8').trim()
    console.log(`♻️  Resuming existing batch: ${batchId}`)
  } else {
    batchId = await submitBatch()
  }

  // Resume from results if already downloaded
  let results
  if (existsSync(RESULTS_FILE)) {
    console.log(`\n♻️  Using cached results from ${RESULTS_FILE}`)
    results = JSON.parse(readFileSync(RESULTS_FILE, 'utf8'))
  } else {
    await pollBatch(batchId)
    results = await downloadResults(batchId)
  }

  await createShopifyArticles(results)
}

main().catch(err => {
  console.error('\n❌ Fatal error:', err.message)
  process.exit(1)
})
