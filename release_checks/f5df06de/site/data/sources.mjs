/**
 * SOURCES REGISTER — single source of truth for every citation on the site.
 *
 * RULE (project verification policy):
 *   Every table row on this site that asserts a fact must point at an entry in
 *   this register. An entry is only "official: true" when the domain is owned by
 *   the body that defines the fact. Third-party blogs are recorded as
 *   official: false and are NEVER used to fill a data cell.
 *
 * `checked` is the UTC date the source was actually retrieved in this session.
 * `quote` is a verbatim extract relied upon, so a human reviewer can confirm the
 * claim without re-reading the whole document.
 */

export const RETRIEVED = '2026-11-20';

export const sources = [
  {
    id: 'S01',
    official: true,
    owner: 'Amazon.com Associates Central',
    title: 'Associates Program Operating Agreement',
    url: 'https://affiliate-program.amazon.com/help/operating/agreement',
    docDate: 'Updated October 15, 2025',
    checked: RETRIEVED,
    access: 'Public — retrieved successfully in this session (chunks 0 and 1).',
    quote:
      'You must clearly and prominently state the following ... on your Site ...: \u201cAs an Amazon Associate I earn from qualifying purchases.\u201d',
    relied_on: [
      'Section 5 — the exact mandatory Associate disclosure sentence.',
      'Section 1 — Special Links must "properly use the special \u201ctagged\u201d link formats we provide".',
      'Section 6 — a violation of Section 5 "will be deemed a material breach of this Agreement".',
      'Section 4 — Amazon makes "no representation, warranty, or covenant regarding the amount of traffic or commission income you can expect". This is the authority for publishing no revenue forecast.',
    ],
  },
  {
    id: 'S02',
    official: true,
    owner: 'Amazon.com Associates Central',
    title: 'Associates Program Policies (Commission Income Statement, Participation Requirements, IP License)',
    url: 'https://affiliate-program.amazon.com/help/operating/policies',
    docDate: 'Updated April 14, 2026',
    checked: RETRIEVED,
    access: 'Public — retrieved successfully in this session (chunks 0, 1 and 8).',
    quote:
      'a link that sends users indirectly to an Amazon Site via an intermediate site, without requiring the customer to click on a link or take some other affirmative action on that intermediate site (a \u201cRedirecting Link\u201d)',
    relied_on: [
      'Commission Income Statement \u00a71(b) — a Session ends at the first of: 24 hours from the click, the customer placing a non-digital order, or clicking through someone else\u2019s Special Link.',
      'Commission Income Statement \u00a71(c)(i) — cart-add purchases qualify if completed no later than 89 days after the initial click-through.',
      'Commission Income Statement \u00a71(c)(iii) — the product must be shipped/streamed and paid for within 180 days of purchase.',
      'Commission Income Statement \u00a72(e) — purchases from a "Redirecting Link" are disqualified.',
      'Commission Income Statement \u00a72(g) — purchases "not correctly tracked or reported because the links from your site to the relevant Amazon Site are not properly formatted" are disqualified.',
      'Commission Income Statement \u00a72(c) — Prohibited Paid Search Placement (no bidding on "amazon", "kindle" or Amazon Marks).',
      'Commission Income Statement \u00a72(d) — purchases referred by a link generated or displayed on a search engine are disqualified.',
      'Commission Income Statement \u00a73 — Standard Commission Income rates live in the Appendix of this page.',
      'IP License \u00a72(h) — ASINs may be stored indefinitely; Product Advertising Content images may not be stored or cached, and a LINK to such an image may be stored for only up to 24 hours.',
      'IP License \u00a72(i) — pricing/availability displays need a date/time stamp plus a specific disclaimer sentence.',
      'IP License \u00a72(k) — a specific "comes from Amazon ... subject to change or removal" disclaimer is required when displaying Program Content consisting of text.',
      'IP License \u00a74 — Agent Terms: an autonomous agent must identify itself with "Agent/[agent name]" in the user-agent string and must not conceal that its access is automated.',
    ],
  },
  {
    id: 'S03',
    official: true,
    owner: 'Amazon.com Associates Central',
    title: 'Why do I have to identify myself as an Associate? How should I do this on social media?',
    url: 'https://affiliate-program.amazon.com/help/node/topic/GHQNZAU6669EZS98',
    docDate: 'Help topic (page states no revision date)',
    checked: RETRIEVED,
    access: 'Public — content retrieved via search index extract in this session; URL not fetched directly.',
    quote:
      'A clear disclosure could be as simple as "(paid link)", "#ad", or "#CommissionsEarned". Conspicuous. It should be placed near any affiliate link or product review in a location that customers will notice easily. They shouldn\u2019t have to hunt for it.',
    relied_on: [
      'Placement standard: disclosure must be clear, conspicuous, and near the link — the authority for putting the strip above the fold on every page rather than only in the footer.',
      'Link-level disclosure is required IN ADDITION to the Operating Agreement site-level statement.',
    ],
  },
  {
    id: 'S04',
    official: true,
    owner: 'Amazon.com Associates Central',
    title: 'Onsite Associates Program Commission Income Statement (Table A / Table B)',
    url: 'https://affiliate-program.amazon.com/help/node/topic/G4ARBJC7Z2NK48CA',
    docDate: 'Help topic (page states no revision date)',
    checked: RETRIEVED,
    access: 'Public — content retrieved via search index extract in this session; URL not fetched directly.',
    quote:
      'Table A \u2013 Fixed Onsite Associates Program Commission Income for Direct Qualifying Purchases in specific Product Categories (excluding Creator Ads)',
    relied_on: [
      'Establishes that ONSITE (Amazon-hosted creator content) rates are a SEPARATE schedule from the standard off-site rates. This distinction is why the off-site rate for these listings is left blank rather than borrowed from the onsite table.',
    ],
  },
  {
    id: 'S05',
    official: true,
    owner: 'Sell on Amazon (Amazon)',
    title: 'Understanding ASIN numbers: Your guide to Amazon\u2019s product identification system',
    url: 'https://sell.amazon.com/blog/what-is-an-asin',
    docDate: 'Blog article (page states no revision date)',
    checked: RETRIEVED,
    access:
      'Public — direct fetch was blocked in this session (HTTP error). Definition text retrieved via search index extract of the same URL.',
    quote:
      'It\u2019s a unique 10-character alphanumeric code assigned to every product listed in the Amazon store. ... The format of an ASIN code typically starts with \u201cB0,\u201d or in the case of books begins with a number.',
    relied_on: [
      'The checkable ASIN definition used to test the supplied link tokens: exactly 10 characters, alphanumeric.',
      'Basis for flagging B0hmGG4m2, B03QDuGdo and B0hpD2JGQ (9 characters, mixed case) as NOT valid ASIN strings.',
    ],
  },
  {
    id: 'S06',
    official: true,
    owner: 'Amazon.com',
    title: 'Product detail page — Art3d Smoothing Tool Kit for Peel and Stick Wallpaper (ASIN B08FKW9JRM)',
    url: 'https://www.amazon.com/dp/B08FKW9JRM',
    docDate: 'Live listing, observed 2026-11-20',
    checked: RETRIEVED,
    access: 'Public — fetched successfully in this session (redirect target of the supplied link L1).',
    quote:
      '{"desktop_buybox_group_1":[{"displayPrice":"$5.08","priceAmount":5.08,"currencySymbol":"$"}]}',
    relied_on: [
      'Observed listing title, brand store, seller, star rating, ratings count, deal price and typical price for the L1 redirect target.',
      'The embedded buybox JSON gives a machine-readable price value ($5.08) independent of the rendered text.',
    ],
  },
  {
    id: 'S07',
    official: true,
    owner: 'Amazon.com',
    title: 'Product detail page — Paper Towel Holder Under Cabinet, Self-Adhesive or Drilling, Matte Black (ASIN B0BSKQW2T2)',
    url: 'https://www.amazon.com/dp/B0BSKQW2T2',
    docDate: 'Live listing, observed 2026-11-20',
    checked: RETRIEVED,
    access: 'Public — fetched successfully in this session (redirect target of the supplied links L2 and L3).',
    quote: '4.2 4.2 out of 5 stars (12,099) ... $6.79 with 15 percent savings -15% ... Typical price: $7.99',
    relied_on: [
      'Observed listing title, brand store (niffgaff), seller (YH Urban), star rating, ratings count, deal price and typical price for the L2/L3 redirect target.',
    ],
  },
  {
    id: 'S08',
    official: true,
    owner: 'Amazon.com',
    title: 'Product detail page — Pots and Pans Organizer Under Cabinet 16.6", 8-Tier Adjustable Rack (ASIN B08DY9HRWD)',
    url: 'https://www.amazon.com/dp/B08DY9HRWD',
    docDate: 'Live listing, observed 2026-11-20',
    checked: RETRIEVED,
    access: 'Public — fetched successfully in this session (redirect target of the supplied link L4).',
    quote: '4.4 4.4 out of 5 stars (18,835) ... $17.74 with 26 percent savings -26% ... List Price: $23.99',
    relied_on: [
      'Observed listing title, brand store (ORDORA), seller (ORDORA Official), star rating, ratings count, Prime-exclusive deal price, list price, colour and size variation sets for the L4 redirect target.',
    ],
  },
  {
    id: 'S09',
    official: true,
    owner: 'Amazon (link.amazon short-link service)',
    title: 'Supplied short links as received (link.amazon/B0hmGG4m2, link.amazon/B03QDuGdo, link.amazon/B0hpD2JGQ)',
    url: 'https://link.amazon/B0hmGG4m2',
    docDate: 'Observed 2026-11-20',
    checked: RETRIEVED,
    access:
      'Public — all three unique URLs fetched successfully in this session WITHOUT any tag parameter and WITHOUT Associates credentials.',
    quote:
      'https://www.amazon.com/dp/B08FKW9JRM?lv=shuf&btn_type=ss&crid=...&sprefix=diy+home+upgrades%2Caps%2C196&sr=8-2&btn_ref=srctok-66dc2f239029f4f9&channelId=500&plpRedirect=mhFallback',
    relied_on: [
      'The observed redirect targets, including the search-fallback instrumentation parameters (lv=shuf, plpRedirect=mhFallback, channelId=500, sprefix="diy home upgrades", sr=8-N, per-request srctok-*).',
      'Evidence that NO tag= parameter appears anywhere in the observed redirect chain.',
    ],
  },
  {
    id: 'S10',
    official: true,
    owner: 'U.S. Federal Trade Commission',
    title: 'Guides Concerning the Use of Endorsements and Testimonials in Advertising, 16 CFR Part 255 (2023 revision)',
    url: 'https://www.ftc.gov/system/files/ftc_gov/pdf/p204500_endorsement_guides_in_2023.pdf',
    docDate: 'Final rule; adoption of revised Guides (2023)',
    checked: RETRIEVED,
    access: 'Public — text retrieved via search index extract in this session; PDF not downloaded.',
    quote:
      'Endorsements must reflect the honest opinions, findings, beliefs, or experience of the endorser. Furthermore, an endorsement may not convey any express or implied representation that would be deceptive if made directly by the advertiser.',
    relied_on: [
      '\u00a7255.1(a) — no endorsement may assert experience the endorser does not have. This is the authority for refusing to publish first-person "I tested this" copy on an automated build.',
      '\u00a7255.3 — expert endorsements require that the endorser actually possess the claimed expertise. This is the authority for leaving authorship as a named-desk placeholder pending a real human reviewer.',
      '\u00a7255.5 — material connections must be clearly and conspicuously disclosed.',
    ],
  },
  {
    id: 'S11',
    official: true,
    owner: 'U.S. Federal Trade Commission',
    title: 'Endorsements, Influencers, and Reviews — FTC business guidance hub',
    url: 'https://www.ftc.gov/business-guidance/advertising-marketing/endorsements-influencers-reviews',
    docDate: 'Guidance hub (page states no revision date)',
    checked: RETRIEVED,
    access: 'Public — confirmed live via search index in this session; page not fetched directly.',
    quote: '16 CFR Part 255: Guides Concerning the Use of Endorsements and Testimonials in Advertising',
    relied_on: [
      'The FTC\u2019s own index of endorsement, influencer and review obligations, used as the entry point for the compliance gate checklist.',
    ],
  },
  {
    id: 'S12',
    official: true,
    owner: 'Google Search Central',
    title: 'Qualify your outbound links to Google',
    url: 'https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links',
    docDate: 'Documentation (page states no revision date)',
    checked: RETRIEVED,
    access: 'Public — text retrieved via search index extract in this session; page not fetched directly.',
    quote:
      'rel="sponsored" \u00b7 Mark links that are advertisements or paid placements (commonly called paid links) with the sponsored value. ... Note: The nofollow attribute was previously recommended for these types of links and is still an acceptable way to flag them, though sponsored is preferred.',
    relied_on: [
      'The specification behind the site-wide rule that every outbound product-intent link carries rel="sponsored".',
      'Values may be combined, so rel="sponsored nofollow noopener noreferrer" is valid.',
    ],
  },
  {
    id: 'S16',
    official: true,
    owner: 'Amazon.com Associates Central',
    title: 'Associates Program Standard Commission Income Statement \u2014 Table 1, Fixed Standard Commission Income Rates for Specific Product Categories',
    url: 'https://affiliate-program.amazon.com/help/node/topic/GRXPHT8U84RAYDXZ',
    docDate: 'no revision date stated on the page; footer reads \u00a9 1996-2025 Amazon.com, Inc.',
    checked: RETRIEVED,
    access:
      'Fetched DIRECTLY and successfully on 2026-11-20 (all 3 chunks), signed out, with no Associates credentials. This is the standard OFF-SITE schedule that Program Policies \u00a73 refers to as "described in the Appendix"; it is published as its own help topic rather than inside the Program Policies page, which is why paging through that document did not reach it.',
    quote:
      'Table 1 \u2013 Fixed Standard Commission Income Rates for Specific Product Categories: "Physical Books, Kitchen, Automotive | 4.50%" \u00b7 "Toys, Furniture, Home, Home Improvement, Lawn & Garden, Pets Products, Headphones, Beauty, Musical Instruments, Business & Industrial Supplies, Outdoors, Tools, Sports, Baby Products, Amazon Coins | 3.00%" \u00b7 "All Other Categories | 4.00%" \u00b7 "Luxury Beauty, Luxury Stores Beauty, Amazon Explore | 10.00%" \u00b7 "Digital Music, Physical Music, Handmade, Digital Videos | 5.00%" \u00b7 "Amazon Fresh, Physical Video Games & Video Game Consoles, Grocery, Health & Personal Care | 1.00%" \u00b7 "Gift Cards; Wireless Service Plans; Alcoholic Beverages; \u2026 | 0.00%". Preamble: "For Qualifying Purchases of Products within product categories specified in Table 1 below, the Standard Commission Income accrued will be the corresponding fixed rate of Qualifying Revenue specified in this table". Also states a Commission Income Limitation: "Standard Commission Income for all Qualifying Purchases of Products that are categorized as fine art are limited to a maximum of $200 per Product".',
    relied_on: [
      'RESOLVES flag F-05. The standard off-site commission rate table exists and is official: Kitchen 4.50%; Home, Home Improvement and Tools each 3.00%; All Other Categories 4.00%.',
      'Establishes that this is a DIFFERENT schedule from the Onsite Commission Income Statement in S04, which lists Kitchen at 1.25% and Tools at 1.75%. Quoting a rate without naming its schedule is therefore meaningless even when the number is correct.',
      'Vindicates one third-party figure and refutes two others: amawp.com (S13) claimed Kitchen 4.50% and Tools / Home / Home Improvement 3.00%, which matches this table exactly; earnifyhub.com (S15) claimed Kitchen 5% and Home Improvement 8%, which does not.',
      'Does NOT by itself fix a rate per product. Amazon assigns the rate by its own product category, which is not necessarily the browse node observed on the listing. For B08FKW9JRM (Tools & Home Improvement) every candidate row is 3.00%, so the rate is determinate; for the two Home & Kitchen products the candidates are Kitchen 4.50% and Home 3.00%, which remain unresolved without Amazon\u2019s category assignment.',
    ],
  },
  {
    id: 'S13',
    official: false,
    owner: 'amawp.com (third party)',
    title: 'Amazon Associates Commission Rates 2026',
    url: 'https://amawp.com/amazon-associates-commission-rates/',
    docDate: 'Posted 2026-10-01',
    checked: RETRIEVED,
    access: 'Retrieved via search index extract. NOT an Amazon property.',
    quote: '4.50% | Physical Books, Kitchen, Automotive ... 3.00% | Toys, Furniture, Home, Home Improvement ...',
    relied_on: [
      'RECORDED ONLY AS EVIDENCE OF CONFLICT. This page claims Kitchen = 4.50%. Other third-party pages retrieved in the same session claim Kitchen = 1.25%, 5%, and 8%. Because no two agree and none is Amazon, the commission rate cell for every product on this site is left BLANK and flagged.',
    ],
  },
  {
    id: 'S14',
    official: false,
    owner: 'sozee.ai (third party)',
    title: 'Amazon Influencer Commission Rates 2026',
    url: 'https://www.sozee.ai/resources/amazon-influencer-program-commission-rates/',
    docDate: 'Posted 2026-10-13',
    checked: RETRIEVED,
    access: 'Retrieved via search index extract. NOT an Amazon property.',
    quote: 'Home | 3% ... Kitchen | 4.5% ... Tools | 3% ... Home & Kitchen | 1.25% ... Tools 1.75%, Home Improvement 3%',
    relied_on: [
      'RECORDED ONLY AS EVIDENCE OF CONFLICT. Note this single page states Kitchen = 4.5% off-site AND Kitchen = 1.25% onsite, i.e. two different schedules. Confirms that a rate quoted without naming the schedule is meaningless.',
    ],
  },
  {
    id: 'S15',
    official: false,
    owner: 'earnifyhub.com (third party)',
    title: 'Amazon Associates 2026: 20%+ Earning Categories',
    url: 'https://earnifyhub.com/blog/affiliate/amazon-associates-commission-rates-all-categories',
    docDate: 'Posted 2026-05-10',
    checked: RETRIEVED,
    access: 'Retrieved via search index extract. NOT an Amazon property.',
    quote: 'Home Improvement | 8% | Tools, hardware, fixtures ... Kitchen | 5% | Appliances, utensils, cookware',
    relied_on: [
      'RECORDED ONLY AS EVIDENCE OF CONFLICT. Claims Home Improvement = 8% and Kitchen = 5%, contradicting S13 and S14. Third instance of disagreement; strengthens the decision to leave rates blank.',
    ],
  },
];

export const byId = Object.fromEntries(sources.map((s) => [s.id, s]));

/** Render an inline citation link. */
export function cite(id) {
  const s = byId[id];
  if (!s) throw new Error(`Unknown source id: ${id}`);
  return `<a class="src" href="${s.url}" rel="noopener noreferrer" target="_blank" title="${esc(s.owner)} \u2014 ${esc(s.title)}">${id}</a>`;
}

export function esc(v) {
  return String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
