/**
 * GUIDE REGISTRY — every published guide, in one place.
 *
 * tools/build.mjs reads this file and derives, from it and nothing else:
 *   - the guide HTML pages
 *   - sitemap.xml entries
 *   - feed.xml (RSS 2.0) items
 *   - the guides index, cluster pages and front-page rails
 *
 * That wiring is the answer to "add each new guide to the existing sitemap and
 * feed": there is no second list to forget to update. tools/verify.mjs fails the
 * build if a guide exists here but is missing from either output.
 *
 * EDITORIAL RULES (enforced by tools/verify.mjs where mechanically checkable):
 *  1. Titles are questions a buyer would actually type or ask out loud.
 *  2. No superlatives, no "best", no ranking of products, no popularity claims.
 *  3. No search-volume, keyword-difficulty or traffic numbers. None were available
 *     from an authorised source, so none are published.
 *  4. No first-person experience claims ("I tested", "we found"). The FTC Guides
 *     \u00a7255.1(a) require endorsements to reflect the endorser's honest experience;
 *     an automated build has none, so the copy makes none.
 *  5. Every factual statement about a specific listing carries a source id and is
 *     restated as an observation with its capture date.
 */

export const AUTHOR = {
  byline: 'DIYHOME3 Editorial Desk',
  role: 'Automated research and drafting; pending named human review',
  humanReviewer: null, // null = no named human reviewer has signed off. Rendered as UNVERIFIED.
  page: '../about/index.html',
  note:
    'This byline is a desk, not a person, on purpose. No article in this build carries a first-person experience claim, because FTC 16 CFR \u00a7255.1(a) ties endorsements to the endorser\u2019s actual experience and no human has tested these products for this site. Assigning a named reviewer is the first open action on the Flagged for Review page.',
};

/** Shared editorial calendar. Anchors are verified dates only. */
export const seasons = [
  {
    id: 'bfcm-2026',
    label: 'Black Friday / Cyber Monday 2026',
    window: 'Observed live on 2026-11-20',
    anchor:
      'All three resolved listings rendered a "Black Friday Deal" price block on 2026-11-20. That is an observation of a moment, not a forecast of a future deal.',
    sourceIds: ['S06', 'S07', 'S08'],
    verified: true,
  },
  {
    id: 'holiday-returns-2026',
    label: '2026 holiday returns window',
    window: 'Purchases 1 Nov 2026 \u2013 31 Dec 2026, returnable until 31 Jan 2027',
    anchor:
      'Read verbatim from all three listings: "For the 2026 holiday season, eligible items purchased between November 1 and December 31, 2026 can be returned until January 31, 2027."',
    sourceIds: ['S06', 'S07', 'S08'],
    verified: true,
  },
  {
    id: 'q1-2027',
    label: 'Q1 2027 reset / rental-turnover prep',
    window: 'Jan \u2013 Mar 2027',
    anchor:
      'PLANNING SLOT ONLY. No official seasonal demand data was available in this session, so this window carries no demand claim and no forecast. It exists to give the calendar a shape to fill once real query data arrives.',
    sourceIds: [],
    verified: false,
  },
];

export const guides = [
  {
    id: 'G01',
    slug: 'under-cabinet-storage-buyer-questions',
    kind: 'pillar',
    cluster: 'under-cabinet',
    title: 'Under-cabinet storage: which questions should you answer before you buy?',
    dek:
      'A measurement-first framework for anything that hangs beneath a cabinet. Start with the space, not with the product.',
    seasons: ['bfcm-2026', 'holiday-returns-2026'],
    productRefs: ['niffgaff-paper-towel-holder', 'ordora-pots-and-pans-organizer'],
    sections: [
      {
        h: 'Why the space decides, not the listing',
        p: [
          'Under-cabinet products fail for one reason far more often than any other: the buyer measured the shelf but not the gap beneath it. A rack can fit a cabinet\u2019s footprint and still not fit the cabinet, because the doors, the rail, the light switch or the sink lip eat the clearance.',
          'So the first question is never "is this good?" It is "what are my four numbers?" Write them down before you open a single listing.',
        ],
      },
      {
        h: 'The four numbers to write down first',
        table: {
          head: ['Measurement', 'How to take it', 'What it rules out'],
          rows: [
            ['Clear height under the cabinet', 'Counter surface to the underside of the cabinet, at the front edge and again at the back', 'Anything taller than the smaller of the two readings'],
            ['Usable depth', 'From the cabinet front edge back to the wall, minus any backsplash or pipework', 'Units whose mount plate needs more depth than you have'],
            ['Mounting substrate', 'Is the underside solid wood, particle board, tile, or a hollow panel?', 'Adhesive-only mounts on hollow or textured surfaces'],
            ['Obstruction envelope', 'Door swing, drawer pull, switch plate, tap reach', 'Anything that collides when the door or drawer is open'],
          ],
        },
      },
      {
        h: 'Adhesive or drilling: the real trade-off',
        p: [
          'Adhesive mounting is reversible and needs no tools, which matters in a rental. Its limit is shear load over time: a mount that holds on day one can creep under a repeated pull, especially above a sink where heat and steam cycle daily.',
          'Screw mounting is more work and it is permanent, but it is the only option that reliably carries a load you apply force to \u2014 a paper towel roll you tear one-handed, a rack you load and unload with wet pans.',
          'Several listings now offer both in one box. When they do, ask which mode the stated load rating was measured in. If the listing does not say, treat the adhesive figure as unverified and plan for the screw mode.',
        ],
      },
      {
        h: 'What the variation selector is telling you',
        p: [
          'Where a listing offers multiple heights or colours, the variation set is itself useful data: it tells you the manufacturer has sized the product line around a range of cabinet clearances rather than one fixed dimension.',
        ],
        observation: {
          text:
            'Observed on 2026-11-20: the listing for ASIN B08DY9HRWD presents eight height options \u2014 13.78", 14.55", 15.83", 16.59", 16.61", 19.02", 21" and 23.62" \u2014 and four colours (Black, Bronze, Silver, White). The observed selected variation was Black / 16.59"H.',
          sourceIds: ['S08'],
        },
      },
      {
        h: 'The question set, in order',
        list: [
          'What is my clear height at the front edge and at the back?',
          'What load will I actually apply, and how often?',
          'Is my mounting substrate solid enough for adhesive, or do I need screws?',
          'Does the listing state a load rating, and in which mounting mode was it measured?',
          'What happens to the door swing and the drawer pull once this is fitted?',
          'Is the price shown a standing price or a limited-time deal?',
          'What is the returns window if it does not fit?',
        ],
      },
      {
        h: 'Reading a deal price honestly',
        p: [
          'A discount percentage only means something next to the anchor it was taken from. Amazon labels its anchors differently \u2014 "Typical price" and "List Price" are not the same thing, and the page explains each. Check which one you are looking at before you treat a percentage as a saving.',
        ],
        observation: {
          text:
            'Amazon defines "Typical Price" on the listing as the 90-day median price paid by customers, excluding limited-time promotions and excluding Amazon Haul and Amazon Now prices. It defines "List Price" as the suggested retail price provided by a manufacturer, supplier or seller, shown only where the product was purchased at or above that price in at least the past 90 days, and it states that list prices may not reflect the prevailing market price. Both definitions were read on the listings on 2026-11-20.',
          sourceIds: ['S06', 'S07', 'S08'],
        },
      },
      {
        h: 'The returns window is part of the price',
        p: [
          'For a product that might not fit, the returns window is a genuine part of the value calculation, not fine print.',
        ],
        observation: {
          text:
            'Observed on all three listings on 2026-11-20: "For the 2026 holiday season, eligible items purchased between November 1 and December 31, 2026 can be returned until January 31, 2027."',
          sourceIds: ['S06', 'S07', 'S08'],
        },
      },
    ],
  },
  {
    id: 'G02',
    slug: 'peel-and-stick-tool-kit-what-to-compare',
    kind: 'pillar',
    cluster: 'peel-and-stick',
    title: 'Peel-and-stick wall finishing: what belongs in a tool kit, and what is padding?',
    dek:
      'Four tools do almost all of the work. Everything else in the box is either a convenience or filler \u2014 and you should be able to tell which.',
    seasons: ['bfcm-2026'],
    productRefs: ['art3d-smoothing-tool-kit'],
    sections: [
      {
        h: 'The job, described plainly',
        p: [
          'Peel-and-stick film and tile fail in three visible ways: trapped air, a creased seam, and a panel that drifts out of plumb halfway up the wall. Every tool in a kit exists to fight one of those three failures. If you can name which one a tool fights, it earns its place. If you cannot, it is padding.',
        ],
      },
      {
        h: 'The four that actually do the work',
        table: {
          head: ['Tool', 'Failure it prevents', 'What to check before you buy'],
          rows: [
            ['Smoothing tool / squeegee', 'Trapped air and bubbles', 'Edge hardness and whether the working edge is radiused or square \u2014 a square edge can crease soft film'],
            ['Grip or handle', 'Hand fatigue and uneven pressure', 'Whether pressure is applied through a broad palm surface or a narrow point'],
            ['Cutting blade', 'Ragged panel edges at ceilings, sockets and skirting', 'Blade replaceability, and whether the blade is exposed when not cutting'],
            ['Alignment reference', 'Panels drifting out of plumb', 'A level or a marked edge; without one you are sighting by eye'],
          ],
        },
      },
      {
        h: 'Soft film versus rigid tile changes the tool',
        p: [
          'A smoothing tool that is perfect for rigid vinyl backsplash tile can dent soft peel-and-stick wallpaper, because the same pressure that flattens a rigid panel deforms a compliant one. If your kit has to serve both, look for a tool with a broad, low-pressure working face rather than a hard narrow edge.',
          'This is the trade-off worth naming out loud: one kit that is adequate for both materials, or two specialised tools that are each better at one.',
        ],
      },
      {
        h: 'What the listing for this kit actually claims',
        observation: {
          text:
            'Observed on 2026-11-20: the listing title for ASIN B08FKW9JRM reads "Art3d Smoothing Tool Kit for Peel and Stick Wallpaper", with the subhead "Vinyl Backsplash Tile, Complete Basic Tool Set, Bubble & Crease Removal, Ergonomic Grip, Safe for DIY and New Home Buyer". Amazon places it in Tools & Home Improvement \u203a Paint, Wall Treatments & Supplies \u203a Wallpaper & Wallpapering Supplies \u203a Wallpaper Tools. The exact component list and count were not captured in this session and are therefore left unverified.',
          sourceIds: ['S06'],
        },
        p: [
          'Note what that subhead does and does not tell you. It names two materials (wallpaper, vinyl backsplash tile) and two failure modes (bubbles, creases). It does not state a component count, and no component count should be repeated here until someone reads it off the listing or the packaging.',
        ],
      },
      {
        h: 'The question set, in order',
        list: [
          'Am I hanging soft film, rigid tile, or both?',
          'How many panels, and how many cuts around sockets and corners?',
          'Does the smoothing edge radiuse, or will it crease soft material?',
          'Is the blade replaceable, and is it safe to store?',
          'Do I already own a level, or does the kit need to supply one?',
          'What is the counter-space and storage cost of the kit after the job is done?',
        ],
      },
    ],
  },
  {
    id: 'G03',
    slug: 'paper-towel-holder-mounting-comparison',
    kind: 'supporting',
    cluster: 'under-cabinet',
    title: 'Under-cabinet or wall-mounted paper towel holder: what should you compare?',
    dek: 'Same job, two mounting geometries, and the difference is mostly about reach and about what you are willing to drill into.',
    seasons: ['bfcm-2026', 'holiday-returns-2026'],
    productRefs: ['niffgaff-paper-towel-holder'],
    sections: [
      {
        h: 'The two geometries',
        p: [
          'Under-cabinet mounting puts the roll out of the way and off the counter, and it puts the tear point at roughly chest height, which is comfortable for most people. It also means the roll hangs in the cabinet\u2019s shadow, which can make it harder to see how much is left.',
          'Wall mounting keeps the roll visible and reachable but consumes wall area and usually sits above the counter, where splash reach is a real consideration.',
        ],
      },
      {
        h: 'The comparison that matters',
        table: {
          head: ['Factor', 'Under-cabinet', 'Wall-mounted'],
          rows: [
            ['Counter space reclaimed', 'Full \u2014 nothing sits on the counter', 'Full, but the wall area is used'],
            ['Tear ergonomics', 'Roll hangs at the cabinet line; one-handed tearing depends on mount rigidity', 'Roll at a height you choose'],
            ['Substrate required', 'The cabinet underside must carry the load', 'Wall must carry the load; tile and plaster behave differently from stud'],
            ['Visibility of remaining roll', 'Lower \u2014 the cabinet shades it', 'Higher'],
            ['Reversibility', 'Depends on adhesive versus screw mode', 'Usually screw; anchors leave holes'],
            ['Splash exposure above a sink', 'Protected by the cabinet', 'Directly exposed'],
          ],
        },
      },
      {
        h: 'One-handed tearing is a rigidity question',
        p: [
          'The single most common complaint pattern with any paper towel holder is that it rotates when you pull. That is a mount-rigidity problem before it is a product problem. A holder that is screwed into solid substrate will resist a pull; the same holder on adhesive may not.',
          'If one-handed tearing matters to you, the honest comparison is not "which holder" but "which mounting mode, into which substrate".',
        ],
      },
      {
        h: 'Observed listing attributes',
        observation: {
          text:
            'Observed on 2026-11-20: the listing for ASIN B0BSKQW2T2 is titled "Paper Towel Holder Under Cabinet, Self-Adhesive or Drilling, Matte Black" with the subhead "Kitchen Roll Dispenser | Under-Cabinet or Wall-Mounted | Upgraded Aluminum | Lighter Yet Stronger Than Stainless Steel". Amazon places it in Home & Kitchen \u203a Kitchen & Dining \u203a Storage & Organization \u203a Racks & Holders \u203a Paper Towel Holders. The subhead asserts a material comparison ("lighter yet stronger than stainless steel"); this site does not repeat that assertion as fact, because no test data supporting it was available from an official source.',
          sourceIds: ['S07'],
        },
      },
      {
        h: 'The question set',
        list: [
          'What is under my cabinet at the mounting point \u2014 solid wood, particle board, or a hollow panel?',
          'Do I need one-handed tearing, and therefore a screw mount?',
          'How far above the counter will the roll sit, and is that in splash range?',
          'Will the roll diameter I actually buy fit the arm?',
          'Am I willing to leave anchor holes if I remove it?',
        ],
      },
    ],
  },
  {
    id: 'G04',
    slug: 'pot-rack-vertical-clearance-checklist',
    kind: 'supporting',
    cluster: 'under-cabinet',
    title: 'How much vertical clearance does an under-cabinet pot rack actually need?',
    dek: 'The rack height is only half the number. The other half is what you intend to hang on it.',
    seasons: ['bfcm-2026'],
    productRefs: ['ordora-pots-and-pans-organizer'],
    sections: [
      {
        h: 'Add the cookware to the rack height',
        p: [
          'A tiered rack\u2019s stated height describes the empty frame. The usable question is whether your tallest item, on its tier, still clears the tier above and still lets you pull it out without lifting over a lip.',
          'Work top-down: measure the tallest pan you intend to store, add the clearance you need to lift it out, and only then compare that sum against a tier spacing.',
        ],
      },
      {
        h: 'The clearance arithmetic',
        table: {
          head: ['Step', 'Measure', 'Note'],
          rows: [
            ['1', 'Clear height under the cabinet', 'Take it at the front edge and at the back; use the smaller number'],
            ['2', 'Tallest item to be stored', 'Include the lid handle, not just the pan body'],
            ['3', 'Lift-out clearance', 'The vertical room you need to clear the tier above or the frame lip'],
            ['4', 'Sum of 2 + 3', 'This must be less than the tier spacing, and the whole frame less than step 1'],
          ],
        },
      },
      {
        h: 'Weight is where "lightweight" earns its keep',
        p: [
          'Tiered under-cabinet racks are generally engineered around lighter cookware. A cast-iron skillet changes the calculation completely, and a rack rated for lightweight pans is not a rack you should load with one.',
          'Where a listing states a cookware size limit, read whether it is a size limit, a weight limit, or both. A diameter figure says nothing about mass.',
        ],
        observation: {
          text:
            'Observed on 2026-11-20: the listing title for ASIN B08DY9HRWD states "8-Tier Adjustable Rack | 3 DIY Modes, Tool-Free Assembly, Non-Slip, Fits Lightweight Cookware Up to 11"". The word "lightweight" is the listing\u2019s own; no numerical load rating was captured in this session, so the weight limit is left unverified.',
          sourceIds: ['S08'],
        },
      },
      {
        h: '"Adjustable" and "3 DIY modes" are claims to interrogate',
        p: [
          'Adjustability can mean tier spacing changes, overall height changes, the frame can be split into shorter units, or all three. Those are very different products. Before buying, establish which axes adjust and whether adjusting one costs you another \u2014 a common pattern is that splitting the frame reduces the load each half can carry.',
        ],
      },
      {
        h: 'The question set',
        list: [
          'What is my clear height at the front edge and at the back?',
          'What is my tallest item including its lid handle?',
          'How much lift-out clearance do I need?',
          'Is the stated limit a diameter, a weight, or both?',
          'Which axes actually adjust, and what does adjusting cost me?',
          'Does the footprint still let the cabinet doors close?',
        ],
      },
    ],
  },
  {
    id: 'G05',
    slug: 'adhesive-or-drilling-kitchen-mounting',
    kind: 'supporting',
    cluster: 'under-cabinet',
    title: 'Adhesive or drilling: what should you check before mounting anything in a kitchen?',
    dek: 'Kitchens are the worst environment in the house for an adhesive mount. Here is the checklist that decides.',
    seasons: ['holiday-returns-2026'],
    productRefs: ['niffgaff-paper-towel-holder', 'ordora-pots-and-pans-organizer'],
    sections: [
      {
        h: 'Why kitchens are hard on adhesive',
        p: [
          'Three things cycle in a kitchen that do not cycle elsewhere: temperature from cooking, steam and humidity from boiling and dishwashing, and grease film from frying. All three work against an adhesive bond. Grease film is the quietest of them \u2014 a surface that looks clean can still carry enough of it to prevent a proper bond.',
        ],
      },
      {
        h: 'The pre-mount checklist',
        list: [
          'Degrease the mounting surface with a solvent cleaner and let it fully dry. Wiping with a damp cloth is not degreasing.',
          'Identify the substrate: solid timber, plywood, particle board, painted plaster, tile, glass, or a hollow panel.',
          'Confirm the surface is not textured. Adhesive pads bond to area, and texture removes area.',
          'Check the temperature. Most adhesive mounts want a warm, dry surface at application time, not a cold one.',
          'Observe the cure time before loading. Adhesive mounts generally need to sit unloaded before they carry anything.',
          'Decide the load case: static weight, or repeated pulling force.',
        ],
      },
      {
        h: 'The decision, stated simply',
        table: {
          head: ['Your situation', 'Choose', 'Because'],
          rows: [
            ['Rental, light static load, smooth non-porous surface', 'Adhesive', 'Reversible, no holes, and the load case is forgiving'],
            ['Repeated pulling force (tearing a roll, loading wet pans)', 'Screws', 'Adhesive creeps under cyclic shear load'],
            ['Textured, porous or greasy-prone surface', 'Screws', 'Adhesive cannot bond to enough area'],
            ['Above a hob or a boiling zone', 'Screws', 'Heat and steam cycle daily against the bond'],
            ['You may remove it within a year', 'Adhesive, if the load case allows', 'Screw mounts leave anchor holes to patch and repaint'],
          ],
        },
      },
      {
        h: 'What to look for in a listing',
        p: [
          'Listings that offer both modes are common. The question is whether the stated capacity applies to both, or only to the screw mode. If the listing does not separate them, treat the adhesive capacity as unverified \u2014 and plan for screws if the load is anything other than static and light.',
        ],
      },
    ],
  },
  {
    id: 'G06',
    slug: 'basket-or-oven-air-fryer-comparison',
    kind: 'supporting',
    cluster: 'air-fryer-hypothesis',
    hypothesisOnly: true,
    title: 'Basket or oven-style air fryer: what should you compare?',
    dek:
      'A working title supplied in the project brief. It is published as an editorial hypothesis and is mapped to no product in this register, because no submitted link resolved to an air fryer.',
    seasons: [],
    productRefs: [],
    sections: [
      {
        h: 'The distinction, without the marketing',
        p: [
          'Basket units are a single cooking chamber with a drawer. Oven-style units are a small countertop cavity with shelves and usually a door. The comparison is not which is better; it is which fits how you cook and how much counter and cupboard you have.',
        ],
      },
      {
        h: 'The comparison axes',
        table: {
          head: ['Axis', 'Basket', 'Oven-style'],
          rows: [
            ['Counter footprint', 'Usually smaller', 'Usually larger, and needs door-swing clearance'],
            ['Batch shape', 'One deep batch', 'Several shallow trays at once'],
            ['Stirring/shaking', 'Needed for even results in most basket units', 'Less needed with multiple shelves, more needed for rotation'],
            ['Cleaning', 'One drawer, often dishwasher-safe parts', 'Shelves, walls and a door seal'],
            ['Storage', 'Drawer must be removable to store compactly', 'Bulkier single volume'],
            ['Visibility', 'Opaque \u2014 you open it to look', 'Usually a window, which costs heat each time you look'],
          ],
        },
      },
      {
        h: 'What to write down before you compare models',
        list: [
          'The largest batch you actually cook, in weight or in pieces \u2014 not the batch you imagine cooking.',
          'The counter depth and height available, including clearance for a door to open.',
          'Where it will live between uses, and whether you will lift it.',
          'How many parts go into a dishwasher, and whether you own a dishwasher.',
          'Whether you would use it for anything other than air frying.',
        ],
      },
      {
        h: 'Status of this article',
        note:
          'This guide is published as an editorial hypothesis. No product in this site\u2019s register is an air fryer, no air-fryer listing was verified in this session, and no outbound product link appears here. The mismatch between the brief\u2019s suggested air-fryer titles and the observed product set is recorded as flag F-06 on the Flagged for Review page.',
      },
    ],
  },
  {
    id: 'G07',
    slug: 'air-fryer-capacity-no-hype-checklist',
    kind: 'supporting',
    cluster: 'air-fryer-hypothesis',
    hypothesisOnly: true,
    title: 'A no-hype checklist for comparing air fryer capacity',
    dek:
      'Litres, quarts and "serves X" are three different claims. Here is how to compare them without being led by the biggest number.',
    seasons: [],
    productRefs: [],
    sections: [
      {
        h: 'Why the headline number misleads',
        p: [
          'A stated volume describes the cavity, not the food. Two units with the same litre figure can have very different usable capacity, because what matters is the basket\u2019s footprint and depth, and whether the food can be spread in one layer.',
          'Air frying is a convection process. Food stacked above the airflow does not cook like food in a single layer, so a deep narrow basket is not equivalent to a shallow wide one of the same volume.',
        ],
      },
      {
        h: 'The checklist',
        list: [
          'What is the basket floor area, not just the volume?',
          'Can my typical batch lie in a single layer on that floor?',
          'Is the stated volume for one basket, or the sum of two drawers?',
          'Is the "serves X" figure based on a side portion or a main?',
          'How much does capacity drop when the unit is loaded to a realistic level rather than a demonstration level?',
          'Does the shape fit the food I actually cook \u2014 whole chicken, a tray of vegetables, or fries?',
        ],
      },
      {
        h: 'A single-layer test you can do in a shop or from a spec sheet',
        table: {
          head: ['Food', 'Rough single-layer footprint to look for', 'Why it is the binding case'],
          rows: [
            ['Frozen fries for two', 'A basket floor wide enough to spread them shallowly', 'Deep piles steam instead of crisping'],
            ['A tray of vegetables', 'Flat floor area with room to turn', 'Uneven contact gives uneven browning'],
            ['Whole chicken', 'Internal height, not floor area', 'Height is the binding constraint'],
            ['Two portions of fish', 'Floor area plus clearance from the element', 'Too close to the element burns the top'],
          ],
        },
        note:
          'The table describes which dimension becomes the binding constraint for each food. It deliberately contains no product-specific figures, because none were verified for this article.',
      },
      {
        h: 'Status of this article',
        note:
          'Editorial hypothesis. No product mapped, no outbound product link, no capacity figure attributed to any specific model. See flag F-06.',
      },
    ],
  },
  {
    id: 'G08',
    slug: 'cleanup-and-counter-space-trade-offs',
    kind: 'supporting',
    cluster: 'air-fryer-hypothesis',
    hypothesisOnly: true,
    title: 'How should you assess cleanup and counter-space trade-offs?',
    dek: 'The two costs that decide whether a countertop appliance stays out or goes into a cupboard.',
    seasons: [],
    productRefs: [],
    sections: [
      {
        h: 'The trade is between two budgets',
        p: [
          'Every countertop appliance spends from two budgets: your cleaning time and your counter area. They trade against each other. A larger cavity is easier to cook in and harder to clean; a removable drawer is easier to clean and costs cupboard space when it is not in the unit.',
        ],
      },
      {
        h: 'Cleanup: the questions that predict the outcome',
        list: [
          'How many separate parts come out for washing?',
          'Which of those parts are dishwasher-safe, and on which rack?',
          'Is the interior cavity accessible enough to wipe, or does it have a fixed element guard you cannot reach behind?',
          'Does the door or drawer seal trap residue, and can the seal be removed?',
          'Is there a crumb tray, and does it catch what actually falls?',
          'After a fatty cook, how much of the cleanup is the unit and how much is the surrounding counter and wall?',
        ],
      },
      {
        h: 'Counter space: measure the envelope, not the footprint',
        table: {
          head: ['Dimension', 'What to measure', 'Commonly missed'],
          rows: [
            ['Footprint', 'Width \u00d7 depth of the base', 'Handles and hinges that stick out beyond the base'],
            ['Operating height', 'Unit height plus any lid or door travel', 'A drawer that extends forward, or a door that lifts'],
            ['Clearance behind', 'Gap to the wall recommended for airflow', 'An appliance pushed flush into a corner blocks its own intake'],
            ['Clearance above', 'Space to a cabinet or extractor', 'Steam and heat damage cabinetry over time'],
            ['Storage volume', 'The box it has to fit back into', 'A removable drawer that does not fit inside the unit for storage'],
          ],
        },
      },
      {
        h: 'The decision rule',
        p: [
          'If you will use an appliance several times a week, spend counter space and save cleaning time. If you will use it a few times a month, spend cleaning time and save counter space \u2014 but only if it can actually be stored, which means checking the storage volume before you buy, not after.',
        ],
      },
      {
        h: 'Status of this article',
        note: 'Editorial hypothesis. No product mapped and no outbound product link. See flag F-06.',
      },
    ],
  },
  {
    id: 'G09',
    slug: 'questions-before-buying-multi-function-appliance',
    kind: 'supporting',
    cluster: 'air-fryer-hypothesis',
    hypothesisOnly: true,
    title: 'What questions should you ask before buying a multi-function kitchen appliance?',
    dek: 'Multi-function is a claim about the number of modes, not about how well any of them work.',
    seasons: [],
    productRefs: [],
    sections: [
      {
        h: 'The core question',
        p: [
          'Ask which single function you would buy the appliance for if it only did that one thing. If you cannot answer, the extra modes are the reason you are buying it, and that is the case where multi-function appliances most often end up in a cupboard.',
        ],
      },
      {
        h: 'The question set',
        list: [
          'Which one mode would I buy this for on its own?',
          'Do the modes share one cavity, or does switching modes mean swapping parts?',
          'How many parts have to be stored, and where?',
          'Does adding modes add cleanup surfaces?',
          'Are the controls per-mode presets, or do I set time and temperature myself each time?',
          'Is the stated capacity the same in every mode, or does one mode reduce it?',
          'What is the footprint and the operating envelope, including door or lid travel?',
          'What does it replace, and will I actually remove the thing it replaces?',
        ],
      },
      {
        h: 'The replacement test',
        table: {
          head: ['If it replaces\u2026', 'Check first'],
          rows: [
            ['A single-purpose appliance you already own', 'Whether the shared cavity is worse at the job you do most'],
            ['Nothing \u2014 it is additional', 'Whether you have the counter or cupboard space, because it will not stay out by itself'],
            ['Two or more appliances', 'Whether the combined footprint is genuinely smaller than what it replaces'],
            ['An oven', 'Whether the batch size you cook actually fits, since a countertop cavity is almost always smaller'],
          ],
        },
      },
      {
        h: 'What a mode list does not tell you',
        p: [
          'A list of eight modes tells you there are eight presets. It does not tell you how evenly any of them cook, how loud the fan is, how long preheat takes, or whether the modes you care about share a heating element that has to be reconfigured between them. Those are the things to read in owner questions and in the parts list, not in the mode list.',
        ],
      },
      {
        h: 'Status of this article',
        note: 'Editorial hypothesis. No product mapped and no outbound product link. See flag F-06.',
      },
    ],
  },
  {
    id: 'G10',
    slug: 'how-to-read-an-amazon-listing-without-being-led',
    kind: 'supporting',
    cluster: 'under-cabinet',
    title: 'How do you read an Amazon listing without being led by it?',
    dek: 'Which parts of a product page are seller-authored, which are Amazon-computed, and which are neither.',
    seasons: ['bfcm-2026'],
    productRefs: ['art3d-smoothing-tool-kit', 'niffgaff-paper-towel-holder', 'ordora-pots-and-pans-organizer'],
    sections: [
      {
        h: 'Three different authors share one page',
        p: [
          'A product detail page mixes text written by the seller, numbers computed by Amazon, and content contributed by shoppers. They carry very different evidential weight, and the page does not label them for you.',
        ],
      },
      {
        h: 'Who wrote what',
        table: {
          head: ['Element', 'Authored by', 'How to treat it'],
          rows: [
            ['Title and subhead', 'The seller', 'A marketing claim. Useful for what the product is called and what it says it does; not evidence that it does it'],
            ['Bullet points and description', 'The seller', 'Claims. Compare against the specification table where one exists'],
            ['Star rating and ratings count', 'Amazon, computed from shopper submissions', 'A real aggregate, but of shopper opinion, not of measured performance'],
            ['"Amazon\u2019s Choice" badge', 'Amazon', 'Amazon states it highlights highly rated, well-priced products available to ship immediately. It is a merchandising signal, not a test result'],
            ['"X bought in past month"', 'Amazon', 'A sales-volume signal for that listing, not a quality signal'],
            ['Price and any discount', 'Amazon, from the seller\u2019s offer', 'Always read the anchor label next to it'],
            ['"Typical price"', 'Amazon, defined as the 90-day median paid, excluding limited-time promotions', 'A backward-looking median, not a promise'],
            ['"List Price"', 'Amazon, from a manufacturer, supplier or seller suggestion', 'Amazon states list prices may not reflect the prevailing market price'],
            ['Ships from / Sold by', 'Amazon', 'Tells you whether the seller is Amazon or a third party, which matters for returns and support'],
          ],
        },
        note: 'Definitions of "Typical Price" and "List Price" were read verbatim from the listings themselves on 2026-11-20.',
      },
      {
        h: 'The two anchor labels are not interchangeable',
        p: [
          'A percentage discount is only as meaningful as its anchor. Amazon renders two different anchors and defines both on the page. A "Typical price" anchor is a 90-day median of what customers actually paid. A "List Price" anchor is a suggested retail figure that Amazon itself says may not reflect the prevailing market price. The same 26% off means materially different things against those two baselines.',
        ],
        observation: {
          text:
            'Observed on 2026-11-20: B08FKW9JRM and B0BSKQW2T2 both rendered a "Typical price" anchor, while B08DY9HRWD rendered a "List Price" anchor alongside the note "Exclusive Prime price" and the prompt "Join Prime to buy this item at $17.74". The observed prices are therefore not directly comparable to each other without also comparing their anchors and their eligibility conditions.',
          sourceIds: ['S06', 'S07', 'S08'],
        },
      },
      {
        h: 'A reading order that works',
        list: [
          'Read the specification table before the bullets, if the listing has one.',
          'Read "Ships from / Sold by" before the price, so you know whose offer you are looking at.',
          'Read the price anchor label before the discount percentage.',
          'Check whether the price is gated behind a membership.',
          'Read the returns line, especially near a seasonal window.',
          'Only then read the star rating, and read it as an opinion aggregate.',
        ],
      },
    ],
  },
  {
    id: 'G11',
    slug: 'what-makes-an-affiliate-link-compliant',
    kind: 'supporting',
    cluster: 'peel-and-stick',
    title: 'What actually makes an affiliate link compliant, and how would you check yours?',
    dek: 'The mechanics behind this site\u2019s link gate: tagged format, disclosure placement, and why an untagged redirect earns nothing.',
    seasons: [],
    productRefs: [],
    meta: true,
    sections: [
      {
        h: 'Three separate obligations, often confused',
        p: [
          'People talk about "affiliate compliance" as one thing. It is three, and they have three different owners: the programme agreement governs the link format and the site-level statement; consumer-protection law governs whether the reader is told about the commercial relationship; and search-engine guidance governs how you mark the link in HTML so it is not treated as an editorial endorsement.',
        ],
      },
      {
        h: '1. The link must use the tagged format the programme provides',
        quote: {
          text:
            'The links must properly use the special \u201ctagged\u201d link formats we provide and comply with this Agreement (\u201cSpecial Links\u201d).',
          attribution: 'Associates Program Operating Agreement, Section 1',
          sourceIds: ['S01'],
        },
        p: [
          'The consequence of getting this wrong is spelled out in the Commission Income Statement, which disqualifies "any Product purchase that is not correctly tracked or reported because the links from your site to the relevant Amazon Site are not properly formatted". A malformed link does not merely underperform; the purchase it produces can be excluded entirely.',
        ],
        quote2: {
          text:
            'any Product purchased by a customer who is referred to an Amazon Site by a link that sends users indirectly to an Amazon Site via an intermediate site, without requiring the customer to click on a link or take some other affirmative action on that intermediate site (a \u201cRedirecting Link\u201d)',
          attribution: 'Associates Program Policies, Commission Income Statement \u00a72(e)',
          sourceIds: ['S02'],
        },
      },
      {
        h: '2. The disclosure must be clear, conspicuous, and near the link',
        quote: {
          text: 'As an Amazon Associate I earn from qualifying purchases.',
          attribution: 'The exact sentence required by Operating Agreement Section 5',
          sourceIds: ['S01'],
        },
        p: [
          'That site-level statement is not the whole obligation. Associates guidance adds a link-level disclosure and a placement standard: it should be near the affiliate link or product review, somewhere a customer will notice easily, and they should not have to hunt for it. A footer-only disclosure fails that standard, which is why this site repeats the strip under the masthead on every page.',
          'Section 6 of the Operating Agreement raises the stakes: a violation of Section 5 "will be deemed a material breach of this Agreement".',
        ],
      },
      {
        h: '3. The HTML must mark the link as commercial',
        quote: {
          text:
            'rel="sponsored" \u2014 Mark links that are advertisements or paid placements (commonly called paid links) with the sponsored value.',
          attribution: 'Google Search Central, Qualify your outbound links',
          sourceIds: ['S12'],
        },
        p: [
          'This one is checkable mechanically, which is why it is the only one of the three this site enforces with an automated build gate rather than with a checklist. Every outbound product-intent link here carries rel="sponsored nofollow noopener noreferrer", and the build fails if any does not.',
        ],
      },
      {
        h: 'How you would actually test a link',
        list: [
          'Open the link in a signed-out browser with no existing Amazon session.',
          'Record the final URL, character for character, including every query parameter.',
          'Confirm a tag parameter is present and that it is your own tracking ID.',
          'Confirm the destination is the listing you intended, not a search results page or a fallback.',
          'Repeat the fetch on a different day. A link whose destination moves is not a link you can publish against.',
          'Confirm the click appears in your own tracking report before you treat the link as working.',
        ],
        note:
          'Step 6 requires sign-in to Associates Central and is therefore the step this site cannot automate. It is the reason every outbound link here is currently in a "pending validation" state rather than a monetised one.',
      },
    ],
  },
];

export const guideById = Object.fromEntries(guides.map((g) => [g.id, g]));

/** Cadence: published, dated, and measurable. Not a promise of volume. */
export const cadence = {
  statement:
    'One new or materially revised guide per week, published on Thursdays, with every publication adding an entry to sitemap.xml and feed.xml in the same commit.',
  rationale:
    'The brief asks for a cadence and for each new guide to reach the sitemap and feed. Because the site generator derives both files from site/data/guides.mjs, "in the same commit" is a property of the build rather than a discipline someone has to remember.',
  measuredBy:
    'Outbound clicks and reader-capture events from the site\u2019s own analytics endpoint, and \u2014 once Search Console access is granted \u2014 by the queries that actually bring arrivals. No topic in this build was chosen from search-volume data, because no authorised search-volume source was available.',
  nextTopicRule:
    'The next guide is chosen from measured queries, not from instinct. Until measurement is live, the queue is held at the four hypothesis titles already supplied in the brief and no new topics are invented.',
};
