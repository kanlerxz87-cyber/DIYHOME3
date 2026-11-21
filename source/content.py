"""Editorial source register. Observations are not product intent confirmations."""
DATE = '2026-11-20'
RECHECK = '2026-11-21'
TRACKING_ID = 'shopnow047c-20'
DISCLOSURE = 'As an Amazon Associate I earn from qualifying purchases.'
SOURCES = {
    'S01': ('Amazon · Associates Operating Agreement', 'https://affiliate-program.amazon.com/help/operating/agreement'),
    'S02': ('Amazon · Associates help and ASIN glossary', 'https://www.amazon.com/b?ie=UTF8&node=51812349011'),
    'S03': ('Amazon · Program Policies and IP License', 'https://affiliate-program.amazon.com/help/operating/policies'),
    'S04': ('GitHub · Pages limits', 'https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits'),
    'S05': ('Google · Qualify outbound links', 'https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links'),
    'S06': ('Google · Build and submit a sitemap', 'https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap'),
    'S07': ('FTC · Endorsement Guides FAQ', 'https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking'),
    'S08': ('Google · Get started with Search Console', 'https://developers.google.com/search/docs/monitor-debug/search-console-start'),
    'S09': ('USDA FSIS · Air Fryers and Food Safety', 'https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/air-fryers-and-food-safety'),
    'S10': ('Instant Pot · Vortex 6QT specifications', 'https://instantpot.com/products/instant-pot-vortex-6qt-air-fryer'),
    'S11': ('Art3d · Wallpaper smoothing tools', 'https://www.art3d.com/designs/a17999---peel-and-stick-wallpaper-backsplash-application-tool-smoothing-kit/'),
    'S12': ('Amazon · Observed wallpaper kit listing', 'https://www.amazon.com/dp/B08FKW9JRM'),
    'S13': ('Amazon · Observed paper towel holder listing', 'https://www.amazon.com/dp/B0BSKQW2T2'),
    'S14': ('Amazon · Observed cookware rack listing', 'https://www.amazon.com/dp/B08DY9HRWD'),
    'S15': ('Amazon · Standard Commission Income Rates', 'https://affiliate-program.amazon.com/help/node/topic/GRXPHT8U84RAYDXZ'),
    'S16': ('Amazon · Creators API documentation', 'https://affiliate-program.amazon.com/creatorsapi/docs/en-us/introduction'),
    'S24': ('Amazon · Associate and link-level disclosures', 'https://affiliate-program.amazon.com/help/node/topic/GHQNZAU6669EZS98'),
    'S17': ('Amazon · Participation Requirements §2(t) and §2(y)', 'https://affiliate-program.amazon.com/help/operating/policies'),
    'S18': ('Amazon · IP License §2(h) and §2(i)', 'https://affiliate-program.amazon.com/help/operating/policies'),
    'S19': ('Amazon · Associates glossary: ASIN', 'https://www.amazon.com/b?ie=UTF8&node=51812349011'),
}
# Preserve all four submissions even though the middle URL appears twice.
PRODUCTS = [
    dict(id='wallpaper-kit', code='B0hmGG4m2', observed_asin='B08FKW9JRM', source='S12', title='Wallpaper smoothing kit', category='Walls & finishes', image='wallpaper', alt='Rolled wallpaper and a smoothing tool on a worktable', guide='wallpaper-tools', blurb='A smoother start for your next peel-and-stick project.'),
    dict(id='towel-holder', code='B03QDuGdo', observed_asin='B0BSKQW2T2', source='S13', title='Under-cabinet towel holder', category='Kitchen organization', image='holder', alt='Paper towel roll mounted below a wood cabinet', guide='paper-towel-holder', blurb='Reclaim a little worktop space without moving the essentials.'),
    dict(id='pan-rack', code='B0hpD2JGQ', observed_asin='B08DY9HRWD', source='S14', title='Adjustable cookware rack', category='Storage & shelving', image='rack', alt='Pans arranged upright in an open oak cabinet', guide='cookware-racks', blurb='Give the pans you reach for most a spot of their own.'),
]
SUBMISSIONS = [
    dict(row=i, product=PRODUCTS[idx]['id'], submitted_url='https://link.amazon/' + PRODUCTS[idx]['code'],
         observed_asin=PRODUCTS[idx]['observed_asin'], observed_redirect_target=SOURCES[PRODUCTS[idx]['source']][1],
         observed_on=DATE, rechecked_on=RECHECK, observation_source=PRODUCTS[idx]['source'], duplicate_of=2 if i == 3 else None,
         intended_asin=None, official_listing_url=None, confirmed_on=None, confirmation_source=None)
    for i, idx in enumerate((0, 1, 1, 2), 1)
]
VERIFIED_ON = '2026-11-21'
# Dated record: claim -> official source -> result. Every row was fetched and read on
# the date shown. Nothing here is inferred from a third party or from the product brief.
RECORD = [
    dict(claim='Required Associates statement, exact wording', source='S01',
         result='Section 5 states the sentence verbatim; the page header reads "Updated: October 15, 2025".',
         publish='Shown under the masthead and repeated in the footer of every page.'),
    dict(claim='Link-level disclosure sits next to the paid link', source='S24',
         result='The help page requires a disclosure that is clear, conspicuous and placed near the affiliate link or product review.',
         publish='No paid link is live, so there is nothing to label yet. Any released link carries adjacent "(paid link)" text.'),
    dict(claim='An ASIN is a 10-character identifier', source='S19',
         result='The Associates glossary states every catalogue item has a unique 10-digit ASIN.',
         publish='All three submitted tokens are 9 characters, so none is recorded as an ASIN.'),
    dict(claim='Special Links must use the assigned tagged format', source='S03',
         result='Links must properly use the tagged formats Amazon provides and must not obscure that the reader is going to Amazon.',
         publish='No tagged link is published until one link per product is tested in the enrolled workflow.'),
    dict(claim='Customer reviews and star ratings need API access', source='S17',
         result='Participation Requirements §2(t) allows them only via Creators API or PA API. §2(y) separately bars price tracking and price alerting.',
         publish='No rating, review count, price history or price alert appears anywhere on this site.'),
    dict(claim='Product images and prices have a 24-hour freshness limit', source='S18',
         result='IP License §2(h) allows storing a link to an image for at most 24 hours; §2(i) requires a timestamp and a fixed disclaimer beside any price.',
         publish='The site publishes no Amazon product image and no price, so neither rule is triggered. Every image here is an illustration.'),
    dict(claim='GitHub Pages is not for primarily commercial sites', source='S04',
         result='Pages may not be used to run an online business, e-commerce site, or a site primarily directed at facilitating commercial transactions.',
         publish='The Pages release stays editorial. Commerce moves to an approved host before any paid link goes live.'),
    dict(claim='Commission relationships must be disclosed clearly', source='S07',
         result='The Endorsement Guides FAQ says a practice is deceptive if it misleads "a significant minority" of consumers, which is why the relationship is disclosed.',
         publish='Disclosure sits above the fold on every page and repeats in the footer.'),
    dict(claim='Fixed standard commission rates by category', source='S15',
         result='Table 1: Kitchen 4.50%; Home, Home Improvement and Tools 3.00%; all other categories 4.00%.',
         publish='Rates are quoted only with their category and schedule. No per-product rate is claimed.'),
    dict(claim='Observed listings and their category paths', source='S12',
         result='All three listings were re-read on 2026-11-21 and matched the 2026-11-20 titles and breadcrumbs.',
         publish='Observed values only. Intent stays blank until the owner names the product they meant to send.'),
    dict(claim='One site to index: canonical host, sitemap, feed', source='S06',
         result='A sitemap plus one canonical URL per page is the documented discovery path.',
         publish='One canonical host, one sitemap, one RSS feed. Desk pages are noindex so only the shop and guides are indexed.'),
]
BLANKS = [
    dict(item='Intended ASIN for each submitted link', why='The brief names no ASIN. An observed redirect records what a link did, not what the sender meant.', source='S19'),
    dict(item='A Special Link URL for the requested tag', why='The tag has not been shown to attribute in an Associates report, and the site cannot open the enrolled session.', source='S03'),
    dict(item='Per-product commission rate', why='Amazon assigns commission by its own product category; the public listing does not state it.', source='S15'),
    dict(item='Price, rating and review count', why='Publishing them without API access would breach §2(t), and a static page cannot meet the 24-hour refresh rule.', source='S17'),
    dict(item='Search Console impressions and clicks', why='No verified property exists, and none can be created with repository access alone.', source='S06'),
    dict(item='Production analytics totals', why='The collector is not deployed on the Pages host, so it has recorded nothing.', source='S04'),
]
# Category pages group the shortlist the way a reader shops: by the job, not by the audit.
# Each `check` item is either quoted from the cited official page or clearly framed as a
# question to ask; no price, rating, demand or superiority claim is made.
CATEGORIES = [
    dict(slug='walls-finishes', name='Walls & finishes', image='wallpaper', product='wallpaper-kit', guide='wallpaper-tools',
         lead='Smoothing and trimming tools for peel-and-stick wallpaper, contact paper and backsplash tile.',
         check=[('Kit contents', 'Art3d lists a red squeegee, a blue medium-hardness squeegee and a craft knife with four replacement blades in its A17999 kit. Kit contents differ between listings, so check the exact variant.', 'S11'),
                ('Two different jobs', 'Art3d describes the squeegees as the bubble-removal tools and the craft knife as the trimming tool. Make sure whatever you choose covers both.', 'S11'),
                ('Wall preparation', 'Follow the wallpaper manufacturer’s own surface and cutting instructions before the first strip goes on.', 'S11')]),
    dict(slug='kitchen-organization', name='Kitchen organization', image='holder', product='towel-holder', guide='paper-towel-holder',
         lead='Space-saving holders for rolls and wrap that otherwise take up the worktop.',
         check=[('Mounting method', 'The observed listing offers self-adhesive or drilling. Check the surface first, and whether the space is rented.', 'S13'),
                ('Roll clearance', 'Measure a full roll and the room at the open end before choosing a spot; a low-profile holder still needs space to swap the tube.', 'S13'),
                ('What it attaches to', 'Cabinet undersides and wall finishes differ. Read the fitting instructions for the surface you actually have.', 'S13')]),
    dict(slug='storage-shelving', name='Storage & shelving', image='rack', product='pan-rack', guide='cookware-racks',
         lead='Adjustable racks that let pans stand upright, so the one you need is the one you can reach.',
         check=[('Tier adjustment', 'The observed listing describes an 8-tier adjustable rack with tool-free assembly in three configurations.', 'S14'),
                ('Pan size and weight', 'The listing describes lightweight cookware up to 11 in. Check your heaviest pan against that before relying on the tiers.', 'S14'),
                ('Cabinet opening', 'Measure the opening with the door open, then check the assembled rack and handles clear it.', 'S14')]),
]

# Empty until a qualified operator can verify each product and its report in the enrolled workflow.
SPECIAL_LINKS = {}

GUIDES = [
    dict(slug='wallpaper-tools', title='What tools do you need for peel-and-stick wallpaper?', category='Walls & finishes', image='wallpaper', intro='Set yourself up to smooth, trim and finish without rummaging for tools halfway through the wall.', sections=[
        ('Start with the wallpaper instructions', 'Check whether your wall finish is suitable, whether you need to prep it, and what the manufacturer recommends for cutting. Plan the first strip against a straight reference before committing to the rest of the wall.', 'S11'),
        ('Check what actually comes in the kit', 'A smoothing tool and a trimming tool do different jobs. Art3d describes separate squeegees and a craft knife in its A17999 kit. Confirm the contents of the exact variant you’re considering rather than buying from the thumbnail.', 'S11'),
        ('Make a test pass first', 'Use an offcut in a discreet spot to see how your material responds to pressure and repositioning. If the paper catches or marks, stop and check the manufacturer’s instructions before moving on.', 'S11')]),
    dict(slug='paper-towel-holder', title='Adhesive or screws for an under-cabinet paper towel holder?', category='Kitchen organization', image='holder', intro='Before you pick a mount, check the cabinet underside, the roll you buy and how much room you need to swap it.', sections=[
        ('Choose the spot before the mount', 'Hold a full roll where it would sit. Check that the cabinet door still swings and that you can slide off the empty tube without moving appliances. A low-profile holder still needs room at the open end.', 'S13'),
        ('Read the instructions for both mounting options', 'The observed listing names adhesive and drilling as options. Check the instructions for compatible surfaces and curing time before using adhesive. If using screws, check panel thickness and confirm you can safely fix into the material.', 'S13'),
        ('Think about removing it later', 'If the space is rented, check what alterations are permitted. Don’t assume adhesive will come off cleanly or that screws supplied for one surface will suit another.', 'S13')]),
    dict(slug='cookware-racks', title='Will an adjustable cookware rack fit your cabinet?', category='Storage & shelving', image='rack', intro='Measure the pans, the cabinet opening and the room you need to take a pan out with one hand.', sections=[
        ('Measure the opening, not just the shelf', 'Write down the usable depth and height with the door open. Note hinges and shelf lips. Then check that the assembly, including protruding handles, can clear the opening.', 'S14'),
        ('Use your most awkward pan as the test', 'Check the listing and manual for divider spacing and load limits. The observed ORDORA listing describes adjustable tiers and lightweight cookware. Don’t assume those tiers will support your heaviest pan.', 'S14'),
        ('Plan for lids and handles', 'Decide where the lid and handle of each pan will go. Sketch the layout, then count the pieces you can access without lifting another one. That’s a more useful target than filling every slot.', 'S14')]),
    dict(slug='basket-vs-oven', title='Basket or oven-style air fryer: what should you compare?', category='Countertop appliances', intro='Editorial working hypothesis (not a popularity or ranking claim): start with the meals you cook on repeat, then compare the cooking surface and the space needed to load it.', sections=[
        ('Compare how you load food', 'Check usable width and depth on a basket model and tray dimensions and rack positions on an oven-style model. Ask which setup fits your most frequent meal without squeezing food in.', 'S10'),
        ('Compare a real batch', 'Think about how often you cook for one versus several people. USDA advises against overcrowding air fryers because it limits circulation. Consider whether you would be happy to cook in batches.', 'S09'),
        ('Compare the daily routine', 'Measure the counter with the door open or drawer pulled out. Look up the manual for operating clearances, cleaning instructions and heat-safe placement.', 'S10')]),
    dict(slug='air-fryer-capacity', title='A no-hype checklist for comparing air fryer capacity', category='Countertop appliances', intro='Editorial working hypothesis (not a search-volume or superiority claim): advertised volume is a starting point, while usable cooking surface determines whether dinner fits.', sections=[
        ('Find the dimensions behind the volume', 'Compare internal width and depth rather than just quarts, and be sure which measurements you are comparing. Instant Pot publishes a 6-quart volume alongside overall dimensions of 12.36 in wide × 12.83 in high × 14.92 in long for its Vortex 6QT; those are the dimensions of the appliance, not a substitute for the usable basket area.', 'S10'),
        ('Try your usual meal on paper', 'Draw the listed footprint on paper and compare it with a typical serving. Leave room for air circulation; USDA recommends batches rather than overcrowding.', 'S09'),
        ('Check food safety separately', 'Advertised capacity doesn’t tell you whether food is done. Use a food thermometer and follow USDA’s safe internal temperature guidance.', 'S09')]),
    dict(slug='air-fryer-cleanup', title='How to assess cleanup and counter-space trade-offs', category='Countertop appliances', intro='Editorial working hypothesis (not a ranking claim): compare the space an appliance takes while in use, then count the removable pieces you will wash afterward.', sections=[
        ('Measure the appliance in use', 'Record the outside dimensions, then account for the open door or drawer, cord and clearances specified in the manual. Compare that operating footprint with the counter you can leave free.', 'S10'),
        ('Look up each removable part', 'Check the basket, insert, tray or rack individually for cleaning instructions. For example, Instant Pot says the Vortex 6QT basket is top-rack dishwasher safe. Don’t assume the same applies to another model or every part.', 'S10'),
        ('Make room for safe prep', 'Keep raw foods and their utensils separate from cooked food. USDA recommends cleaning and sanitizing prep surfaces before and after food preparation.', 'S09')]),
    dict(slug='multi-function-appliances', title='Questions to ask before buying a multi-function kitchen appliance', category='Countertop appliances', intro='Editorial working hypothesis (not a popularity claim): start with the functions you will actually use and check what each mode requires before giving up counter space.', sections=[
        ('Name the jobs you want it to replace', 'Write down the meals and tasks that matter to you. Then compare the manual’s mode instructions, available accessories and useful dimensions. A preset on a control panel isn’t a replacement for the space your current appliance offers.', 'S10'),
        ('Check what stays on the counter', 'Ask which accessories you will have to store separately and how you’ll wash them. Compare the whole setup with the tools you already own, not just the footprint on the box.', 'S10'),
        ('Check meal instructions before relying on presets', 'Follow package instructions where available and use a thermometer for safe internal temperatures. USDA specifically says not to air fry raw stuffed breaded chicken breast products.', 'S09')]),
]
