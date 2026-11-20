/**
 * PRODUCT REGISTER — the verified source data behind every product table on the site.
 *
 * FIELD SEPARATION RULE (from the project brief, and enforced by tools/verify.mjs):
 *   `intent.token`          = what the SUBMITTED LINK claims.
 *   `observed.asin`         = where that link ACTUALLY landed when fetched.
 *   These two live in different objects and are never merged, never averaged,
 *   and never displayed in one cell. A reviewer must be able to see that the
 *   submitted token and the observed destination disagree.
 *
 * PROVENANCE RULE:
 *   A field is filled ONLY if it was read directly off an official page in this
 *   session. Anything else is null, which renders as an explicit
 *   "UNVERIFIED" chip rather than a guess. tools/verify.mjs fails the build if a
 *   null field is rendered as a value.
 */

export const OBSERVED_AT = '2026-11-20T06:00:00Z';
export const OBSERVED_FROM = {
  marketplace: 'amazon.com (United States)',
  session: 'Automated fetch, signed out, no Associates credentials',
  tagParameterPresent: false,
  deliveryLocationShown: 'Herndon 20170 (as rendered by amazon.com to this session)',
};

/** The tracking ID supplied in the brief. Recorded verbatim; enrollment NOT verified. */
export const TRACKING_ID = {
  value: 'shopnow047c-20',
  suppliedBy: 'Project brief ("Selected Tracking ID")',
  enrollmentStatus: null, // null = unverified. Requires Associates Central sign-in.
  observedInAnyRedirect: false,
};

/**
 * Amazon's own ASIN definition (S05): a unique 10-character alphanumeric code.
 * This is a pure format check — it does NOT assert the token exists in Amazon's catalogue.
 */
export function asinFormatCheck(token) {
  const t = String(token ?? '');
  const length = [...t].length;
  const isTenChars = length === 10;
  const isAlphanumeric = /^[A-Za-z0-9]+$/.test(t);
  const isUpperAlphanumeric = /^[A-Z0-9]+$/.test(t);
  const startsB0 = /^B0/.test(t);
  return {
    token: t,
    length,
    isTenChars,
    isAlphanumeric,
    isUpperAlphanumeric,
    startsB0,
    validFormat: isTenChars && isUpperAlphanumeric,
    verdict: isTenChars && isUpperAlphanumeric
      ? 'PASS — matches the 10-character uppercase-alphanumeric ASIN format'
      : `FAIL — ${length} character${length === 1 ? '' : 's'}${isUpperAlphanumeric ? '' : ', contains lower-case letters'}`,
  };
}

/**
 * The four links exactly as supplied in the brief, in the order supplied.
 * L2 and L3 are the same string — that duplication is a finding, not an error to silently fix.
 */
export const submissions = [
  { id: 'L1', order: 1, url: 'https://link.amazon/B0hmGG4m2' },
  { id: 'L2', order: 2, url: 'https://link.amazon/B03QDuGdo' },
  { id: 'L3', order: 3, url: 'https://link.amazon/B03QDuGdo' },
  { id: 'L4', order: 4, url: 'https://link.amazon/B0hpD2JGQ' },
];

export const products = [
  {
    slug: 'art3d-smoothing-tool-kit',
    submissions: ['L1'],
    intent: {
      url: 'https://link.amazon/B0hmGG4m2',
      token: 'B0hmGG4m2',
      formatCheck: asinFormatCheck('B0hmGG4m2'),
      claimedAsin: null, // The brief never asserted an ASIN. Only a link token was supplied.
    },
    observed: {
      asin: 'B08FKW9JRM',
      finalUrl: 'https://www.amazon.com/dp/B08FKW9JRM',
      canonicalListingUrl: 'https://www.amazon.com/dp/B08FKW9JRM',
      rawRedirectUrl:
        'https://www.amazon.com/dp/B08FKW9JRM?lv=shuf&btn_type=ss&crid=2Y94AV6ZXMMJI&sprefix=diy+home+upgrades%2Caps%2C196&gaOptInStatus=true&language=en_US&sr=8-2&btn_ref=srctok-66dc2f239029f4f9&channelId=500&plpRedirect=mhFallback#',
      fallbackParams: {
        'lv': 'shuf',
        'btn_type': 'ss',
        'sprefix': 'diy home upgrades,aps,196',
        'sr': '8-2',
        'btn_ref': 'srctok-66dc2f239029f4f9',
        'channelId': '500',
        'plpRedirect': 'mhFallback',
      },
      tagParameter: null, // Explicitly null: no tag= was present. Verified absence.
      pageTitle:
        'Art3d Smoothing Tool Kit for Peel and Stick Wallpaper | Vinyl Backsplash Tile, Complete Basic Tool Set, Bubble & Crease Removal, Ergonomic Grip, Safe for DIY and New Home Buyer - Amazon.com',
      listingH1: 'Art3d Smoothing Tool Kit for Peel and Stick Wallpaper',
      listingSubhead:
        'Vinyl Backsplash Tile, Complete Basic Tool Set, Bubble & Crease Removal, Ergonomic Grip, Safe for DIY and New Home Buyer',
      brandStore: 'Art3d',
      brandStoreUrl:
        'https://www.amazon.com/stores/Art3d/page/4A1CDF78-64DC-486F-A9B8-85098BEA0D44?lp_asin=B08FKW9JRM',
      shipsFrom: 'Amazon',
      soldBy: 'Art3d\u00ae',
      sellerId: 'A3N74L11X4M7XE',
      breadcrumb: [
        'Tools & Home Improvement',
        'Paint, Wall Treatments & Supplies',
        'Wallpaper & Wallpapering Supplies',
        'Wallpaper Tools',
      ],
      browseNodeId: '164701011',
      starRating: 4.6,
      ratingsCount: 26432,
      badge: "Amazon's Choice",
      boughtPastMonth: '20K+ bought in past month',
      dealLabel: 'Black Friday Deal',
      priceObserved: 5.08,
      priceDiscountPct: 15,
      priceAnchorLabel: 'Typical price',
      priceAnchor: 5.99,
      priceEvidence: '"displayPrice":"$5.08","priceAmount":5.08 (embedded desktop_buybox_group_1 JSON)',
      primeExclusive: false,
      inStock: null, // Not read on the captured chunk. Not inferred.
      returnsNote: 'FREE refund/replacement until Jan 31, 2027 (2026 holiday season: purchases Nov 1 \u2013 Dec 31, 2026)',
      variations: null,
      sourceIds: ['S06', 'S09'],
    },
    // Deliberately null: no official source was available in this session.
    commissionRate: null,
    commissionSchedule: null,
    cluster: 'peel-and-stick',
  },
  {
    slug: 'niffgaff-paper-towel-holder',
    submissions: ['L2', 'L3'],
    duplicateSubmission: true,
    intent: {
      url: 'https://link.amazon/B03QDuGdo',
      token: 'B03QDuGdo',
      formatCheck: asinFormatCheck('B03QDuGdo'),
      claimedAsin: null,
    },
    observed: {
      asin: 'B0BSKQW2T2',
      finalUrl: 'https://www.amazon.com/dp/B0BSKQW2T2',
      canonicalListingUrl: 'https://www.amazon.com/dp/B0BSKQW2T2',
      rawRedirectUrl:
        'https://www.amazon.com/dp/B0BSKQW2T2?lv=shuf&channelId=500&plpRedirect=mhFallback&th=1',
      fallbackParams: {
        'lv': 'shuf',
        'btn_type': 'ss',
        'sprefix': 'diy home upgrades,aps,196',
        'sr': '8-3',
        'btn_ref': 'srctok-1c4034662c855768',
        'channelId': '500',
        'plpRedirect': 'mhFallback',
        'th': '1',
      },
      tagParameter: null,
      pageTitle:
        'Amazon.com - Paper Towel Holder Under Cabinet, Self-Adhesive or Drilling, Matte Black | Kitchen Roll Dispenser | Under-Cabinet or Wall-Mounted| Upgraded Aluminum | Lighter Yet Stronger Than Stainless Steel',
      listingH1: 'Paper Towel Holder Under Cabinet, Self-Adhesive or Drilling, Matte Black',
      listingSubhead:
        'Kitchen Roll Dispenser | Under-Cabinet or Wall-Mounted| Upgraded Aluminum | Lighter Yet Stronger Than Stainless Steel',
      brandStore: 'niffgaff',
      brandStoreUrl:
        'https://www.amazon.com/stores/niffgaff/page/531DB5A2-A3D9-4D02-8477-9A9F32ABB8D8?lp_asin=B0BSKQW2T2',
      shipsFrom: 'Amazon',
      soldBy: 'YH Urban',
      sellerId: 'A2R2TYCKX2EBXJ',
      breadcrumb: [
        'Home & Kitchen',
        'Kitchen & Dining',
        'Storage & Organization',
        'Racks & Holders',
        'Paper Towel Holders',
      ],
      browseNodeId: '3744201',
      starRating: 4.2,
      ratingsCount: 12099,
      badge: "Amazon's Choice",
      boughtPastMonth: '8K+ bought in past month',
      dealLabel: 'Black Friday Deal',
      priceObserved: 6.79,
      priceDiscountPct: 15,
      priceAnchorLabel: 'Typical price',
      priceAnchor: 7.99,
      priceEvidence: 'Rendered buybox text: "$6.79 with 15 percent savings -15%" / "Typical price: $7.99"; also "New (2) from $6.79"',
      primeExclusive: false,
      inStock: null,
      returnsNote: 'FREE refund/replacement until Jan 31, 2027 (2026 holiday season: purchases Nov 1 \u2013 Dec 31, 2026)',
      variations: null,
      otherOffers: 'New (2) from $6.79',
      sourceIds: ['S07', 'S09'],
    },
    commissionRate: null,
    commissionSchedule: null,
    cluster: 'under-cabinet',
  },
  {
    slug: 'ordora-pots-and-pans-organizer',
    submissions: ['L4'],
    intent: {
      url: 'https://link.amazon/B0hpD2JGQ',
      token: 'B0hpD2JGQ',
      formatCheck: asinFormatCheck('B0hpD2JGQ'),
      claimedAsin: null,
    },
    observed: {
      asin: 'B08DY9HRWD',
      finalUrl: 'https://www.amazon.com/dp/B08DY9HRWD',
      canonicalListingUrl: 'https://www.amazon.com/dp/B08DY9HRWD',
      rawRedirectUrl:
        'https://www.amazon.com/dp/B08DY9HRWD?lv=shuf&channelId=500&plpRedirect=mhFallback&th=1',
      fallbackParams: {
        'lv': 'shuf',
        'btn_type': 'ss',
        'sprefix': 'diy home upgrades,aps,196',
        'sr': '8-13',
        'btn_ref': 'srctok-46eeea56854d085e',
        'channelId': '500',
        'plpRedirect': 'mhFallback',
        'th': '1',
      },
      tagParameter: null,
      pageTitle:
        'Amazon.com: ORDORA Pots and Pans Organizer Under Cabinet 16.6", 8-Tier Adjustable Rack | 3 DIY Modes, Tool-Free Assembly, Non-Slip, Fits Lightweight Cookware Up to 11", For Kitchen Cabinets, Shelves & Countertops: Home & Kitchen',
      listingH1: 'Pots and Pans Organizer Under Cabinet 16.6", 8-Tier Adjustable Rack',
      listingSubhead:
        '3 DIY Modes, Tool-Free Assembly, Non-Slip, Fits Lightweight Cookware Up to 11", For Kitchen Cabinets, Shelves & Countertops',
      brandStore: 'ORDORA',
      brandStoreUrl:
        'https://www.amazon.com/stores/ORDORA/page/468503BB-376C-4D9F-B8BE-DECBCF25C460?lp_asin=B08DY9HRWD',
      shipsFrom: 'Amazon',
      soldBy: 'ORDORA Official',
      sellerId: 'A3D56P829A838V',
      breadcrumb: [
        'Home & Kitchen',
        'Kitchen & Dining',
        'Storage & Organization',
        'Racks & Holders',
        'Pot Racks',
      ],
      browseNodeId: '289824',
      starRating: 4.4,
      ratingsCount: 18835,
      badge: null, // No "Amazon's Choice" badge was rendered for this listing. Recorded as absent, not unknown.
      boughtPastMonth: '1K+ bought in past month',
      dealLabel: 'Black Friday Deal',
      priceObserved: 17.74,
      priceDiscountPct: 26,
      priceAnchorLabel: 'List Price',
      priceAnchor: 23.99,
      priceEvidence:
        'Rendered buybox text: "$17.74 with 26 percent savings -26%" / "List Price: $23.99"; also "Regular Price $23.99", "Exclusive Prime price", "Join Prime to buy this item at $17.74", "New (3) from $23.99"',
      primeExclusive: true,
      inStock: 'In Stock',
      returnsNote: 'FREE refund/replacement until Jan 31, 2027 (2026 holiday season: purchases Nov 1 \u2013 Dec 31, 2026)',
      variations: {
        colour: ['Black', 'Bronze', 'Silver', 'White'],
        size: ['13.78"H', '14.55"H', '15.83"H', '16.59"H', '16.61"H', '19.02"H', '21"H', '23.62"H'],
        observedSelected: { colour: 'Black', size: '16.59"H' },
      },
      otherOffers: 'New (3) from $23.99',
      sourceIds: ['S08', 'S09'],
    },
    commissionRate: null,
    commissionSchedule: null,
    cluster: 'under-cabinet',
  },
];

export const clusters = {
  'peel-and-stick': {
    id: 'peel-and-stick',
    name: 'Peel-and-stick wall finishing',
    basis:
      'Derived from the OBSERVED Amazon browse-node path of B08FKW9JRM (Tools & Home Improvement \u203a Paint, Wall Treatments & Supplies \u203a Wallpaper & Wallpapering Supplies \u203a Wallpaper Tools).',
    sourceIds: ['S06'],
  },
  'under-cabinet': {
    id: 'under-cabinet',
    name: 'Under-cabinet & small-space kitchen storage',
    basis:
      'Derived from the OBSERVED Amazon browse-node paths of B0BSKQW2T2 and B08DY9HRWD (Home & Kitchen \u203a Kitchen & Dining \u203a Storage & Organization \u203a Racks & Holders).',
    sourceIds: ['S07', 'S08'],
  },
  'air-fryer-hypothesis': {
    id: 'air-fryer-hypothesis',
    name: 'Air fryer & multi-function kitchen appliances (HYPOTHESIS ONLY)',
    basis:
      'Supplied by the project brief as editorial hypotheses. NOT mapped to any product in this register: no submitted link resolved to an air fryer or cooking appliance. Retained, clearly labelled, because the brief asked for these working titles.',
    sourceIds: [],
    hypothesisOnly: true,
  },
};

export const productBySlug = Object.fromEntries(products.map((p) => [p.slug, p]));

/**
 * Count of register fields that are deliberately null — i.e. no official source
 * confirmed them, so they are left blank rather than inferred. Reported on the
 * front page and the dashboards as a real number instead of a vague "many".
 */
export function countBlanks() {
  let n = 0;
  const walk = (v) => {
    if (v === null) n += 1;
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === 'object') Object.values(v).forEach(walk);
  };
  for (const p of products) {
    walk(p.intent.claimedAsin);
    walk(p.observed.inStock);
    walk(p.observed.variations);
    walk(p.observed.otherOffers);
    walk(p.commissionRate);
    walk(p.commissionSchedule);
  }
  walk(TRACKING_ID.enrollmentStatus);
  return n;
}
