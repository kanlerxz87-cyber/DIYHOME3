"""Editorial source register. Observations are not product intent confirmations."""
DATE = '2026-11-20'
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
    'S24': ('Amazon · Associate and link-level disclosures', 'https://affiliate-program.amazon.com/help/node/topic/GHQNZAU6669EZS98'),
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
         observed_on=DATE, observation_source=PRODUCTS[idx]['source'], duplicate_of=2 if i == 3 else None,
         intended_asin=None, official_listing_url=None, confirmed_on=None, confirmation_source=None)
    for i, idx in enumerate((0, 1, 1, 2), 1)
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
    dict(slug='basket-vs-oven', title='Basket or oven-style air fryer: what should you compare?', category='Countertop appliances', intro='Start with the meals you cook on repeat, then compare the cooking surface and the space needed to load it.', sections=[
        ('Compare how you load food', 'Check usable width and depth on a basket model and tray dimensions and rack positions on an oven-style model. Ask which setup fits your most frequent meal without squeezing food in.', 'S10'),
        ('Compare a real batch', 'Think about how often you cook for one versus several people. USDA advises against overcrowding air fryers because it limits circulation. Consider whether you would be happy to cook in batches.', 'S09'),
        ('Compare the daily routine', 'Measure the counter with the door open or drawer pulled out. Look up the manual for operating clearances, cleaning instructions and heat-safe placement.', 'S10')]),
    dict(slug='air-fryer-capacity', title='How much air fryer capacity will you actually use?', category='Countertop appliances', intro='Advertised volume is a starting point. Usable cooking surface is what you’ll go looking for when dinner won’t fit.', sections=[
        ('Find the dimensions behind the volume', 'Compare internal width and depth rather than just quarts. Check whether the maker publishes basket or tray dimensions for the exact model; Instant Pot, for example, lists basket dimensions separately from volume.', 'S10'),
        ('Try your usual meal on paper', 'Draw the listed footprint on paper and compare it with a typical serving. Leave room for air circulation; USDA recommends batches rather than overcrowding.', 'S09'),
        ('Check food safety separately', 'Advertised capacity doesn’t tell you whether food is done. Use a food thermometer and follow USDA’s safe internal temperature guidance.', 'S09')]),
    dict(slug='air-fryer-cleanup', title='How much cleanup and counter space does an air fryer need?', category='Countertop appliances', intro='Compare the space it takes while you’re using it, then count the pieces you will wash when you’re done.', sections=[
        ('Measure the appliance in use', 'Record the outside dimensions, then account for the open door or drawer, cord and clearances specified in the manual. Compare that operating footprint with the counter you can leave free.', 'S10'),
        ('Look up each removable part', 'Check the basket, insert, tray or rack individually for cleaning instructions. For example, Instant Pot says the Vortex 6QT basket is top-rack dishwasher safe. Don’t assume the same applies to another model or every part.', 'S10'),
        ('Make room for safe prep', 'Keep raw foods and their utensils separate from cooked food. USDA recommends cleaning and sanitizing prep surfaces before and after food preparation.', 'S09')]),
    dict(slug='multi-function-appliances', title='What should you ask before buying a multi-function appliance?', category='Countertop appliances', intro='Start with the functions you’ll actually use and check what each one needs before giving up counter space.', sections=[
        ('Name the jobs you want it to replace', 'Write down the meals and tasks that matter to you. Then compare the manual’s mode instructions, available accessories and useful dimensions. A preset on a control panel isn’t a replacement for the space your current appliance offers.', 'S10'),
        ('Check what stays on the counter', 'Ask which accessories you will have to store separately and how you’ll wash them. Compare the whole setup with the tools you already own, not just the footprint on the box.', 'S10'),
        ('Check meal instructions before relying on presets', 'Follow package instructions where available and use a thermometer for safe internal temperatures. USDA specifically says not to air fry raw stuffed breaded chicken breast products.', 'S09')]),
]
