/**
 * FLAG REGISTER — everything this build could not verify, and everything it found
 * that a human owner needs to look at.
 *
 * A flag is NOT a blocker. Per the project brief, flagged irregularities and
 * unverified items do not block the merge; they are published here and on the
 * "Flagged for Review" page with their source links so the owner can act later.
 *
 * Fields:
 *   severity  critical | high | medium | low | info
 *   status    needs-review (published, awaiting owner) | gated (machinery refuses
 *             to proceed until a human acts) | by-design (a deliberate choice,
 *             recorded so it is not mistaken for an omission)
 *   evidence  what was actually observed, quoted or measured
 *   action    the specific thing a human must do to clear it
 */

export const flags = [
  {
    id: 'F-01',
    severity: 'critical',
    status: 'gated',
    category: 'Data integrity',
    title: 'No tracking ID appears anywhere in the observed redirect chain',
    summary:
      'None of the three resolved destinations carried a tag parameter, so as observed these links cannot attribute a commission to shopnow047c-20.',
    evidence:
      'Fetched 2026-11-20, signed out, with no Associates credentials. The raw destination for L1 was https://www.amazon.com/dp/B08FKW9JRM?lv=shuf&btn_type=ss&crid=2Y94AV6ZXMMJI&sprefix=diy+home+upgrades%2Caps%2C196&gaOptInStatus=true&language=en_US&sr=8-2&btn_ref=srctok-66dc2f239029f4f9&channelId=500&plpRedirect=mhFallback# \u2014 every parameter is listed there and none is "tag". The same is true of the L2/L3 and L4 destinations. The string "shopnow047c-20" does not occur in any observed URL.',
    impact:
      'If these links were published as-is, clicks would send readers to the correct products and earn nothing. The Operating Agreement\u2019s definition of a Special Link requires the tagged formats Amazon provides, and the Commission Income Statement disqualifies purchases that are "not correctly tracked or reported because the links from your site to the relevant Amazon Site are not properly formatted".',
    action:
      'In Associates Central, use SiteStripe or the link builder to generate a tagged Special Link for each of the three observed ASINs (B08FKW9JRM, B0BSKQW2T2, B08DY9HRWD) under tracking ID shopnow047c-20. Test one link per product, confirm the destination and confirm it appears in the tracking report, then scale. This site\u2019s link gate is configured so that flipping a single field in site/data/products.mjs switches every product page from the untagged canonical listing to the validated Special Link.',
    sourceIds: ['S09', 'S01', 'S02'],
    blocks: ['Monetised outbound links'],
  },
  {
    id: 'F-02',
    severity: 'high',
    status: 'needs-review',
    category: 'Data integrity',
    title: 'The three supplied link tokens are not valid ASIN strings',
    summary:
      'B0hmGG4m2, B03QDuGdo and B0hpD2JGQ are each 9 characters and contain lower-case letters. Amazon defines an ASIN as a unique 10-character alphanumeric code.',
    evidence:
      'Character counts measured directly: B0hmGG4m2 = 9, B03QDuGdo = 9, B0hpD2JGQ = 9. All three contain lower-case letters. Amazon\u2019s own definition page states an ASIN "is a unique 10-character alphanumeric code assigned to every product listed in the Amazon store" and that the format "typically starts with \u2018B0,\u2019 or in the case of books begins with a number", giving B07FZ8S74R as the example. By contrast all three OBSERVED redirect ASINs are exactly 10 upper-case alphanumeric characters beginning B0: B08FKW9JRM, B0BSKQW2T2, B08DY9HRWD.',
    impact:
      'The supplied tokens are short-link slugs, not product identifiers. They cannot be used as ASINs in any Associates tooling, in a PA-API call, or in a report join. This is precisely why the product-intent record on this site stores the submitted token and the observed ASIN in separate fields and never merges them.',
    action:
      'Treat the observed ASINs as the working identifiers, but confirm each one is the product you intended before generating Special Links. The observed destinations are point-in-time (see F-03) and were never asserted by the brief.',
    sourceIds: ['S05', 'S09'],
  },
  {
    id: 'F-03',
    severity: 'high',
    status: 'needs-review',
    category: 'Data integrity',
    title: 'Observed redirects carry search-fallback instrumentation, so the destination may not be stable',
    summary:
      'Every observed destination URL contained lv=shuf, plpRedirect=mhFallback, channelId=500, a seeded search prefix and a per-request srctok token, plus a search result position.',
    evidence:
      'L1 landed at sr=8-2 with btn_ref=srctok-66dc2f239029f4f9. L2/L3 landed at sr=8-3 with btn_ref=srctok-1c4034662c855768. L4 landed at sr=8-13 with btn_ref=srctok-46eeea56854d085e. All three carried sprefix="diy home upgrades,aps,196", lv=shuf, plpRedirect=mhFallback and channelId=500. Three different srctok values across three requests indicates a per-request token rather than a fixed mapping. Three different search positions (8-2, 8-3, 8-13) indicates the resolver returned whatever occupied that position in a search for "diy home upgrades".',
    impact:
      'A link whose destination is a search position can resolve to a different product on a different day, or for a different reader in a different marketplace. Publishing against such a link risks sending readers somewhere other than the product the article describes. This is recorded as an observation only: it is NOT a claim that link.amazon is non-compliant or broken. Its exact compliance status is unresolved.',
    action:
      'Re-fetch each supplied link on at least two separate days and from two separate marketplaces, and compare the destinations. If the destination moves, do not publish against the short link at all \u2014 generate Special Links from the ASINs instead.',
    sourceIds: ['S09'],
  },
  {
    id: 'F-04',
    severity: 'high',
    status: 'needs-review',
    category: 'Compliance',
    title: 'The supplied link.amazon format is not referenced in the programme documents retrieved this session',
    summary:
      'Neither the Operating Agreement nor the Program Policies text retrieved in this session names link.amazon or describes it as one of the tagged link formats Amazon provides.',
    evidence:
      'Operating Agreement Section 1 requires that links "properly use the special \u201ctagged\u201d link formats we provide". The Program Policies Commission Income Statement \u00a72(e) disqualifies purchases referred by "a link that sends users indirectly to an Amazon Site via an intermediate site, without requiring the customer to click on a link or take some other affirmative action on that intermediate site (a \u201cRedirecting Link\u201d)". The supplied links do require an affirmative click on this site, which argues against the Redirecting Link characterisation; but they carry no tag parameter, which engages \u00a72(g) on improperly formatted links. Both readings are recorded. Neither is asserted as settled.',
    impact:
      'The compliance status of the supplied short links is genuinely unresolved on the evidence available. This site therefore does not call them invalid and does not publish them as monetised links.',
    action:
      'Ask Associates support directly whether link.amazon short links are a provided tagged format and whether they carry the tag of the account that generated them. Until that answer exists, use canonical or SiteStripe-generated links.',
    sourceIds: ['S01', 'S02', 'S09'],
  },
  {
    id: 'F-05',
    severity: 'medium',
    status: 'needs-review',
    category: 'Data integrity',
    title: 'Commission rate: the official table is now verified, but the per-product category assignment is not',
    summary:
      'CORRECTED 2026-11-20. This flag originally reported the commission rate as unresolvable from official sources. That was wrong: the official standard off-site rate table exists and has now been fetched directly. What remains unresolved is narrower \u2014 which table row Amazon assigns to each specific ASIN.',
    evidence:
      'Originally, the Program Policies page states Standard Commission Income is "described in the Appendix", and paging through that document reached the IP License rather than the Appendix, so no official table was captured. Three third-party pages gave conflicting figures and the rate was left blank. The table has since been fetched DIRECTLY from its own help topic: Table 1, Fixed Standard Commission Income Rates for Specific Product Categories, gives "Physical Books, Kitchen, Automotive | 4.50%" and "Toys, Furniture, Home, Home Improvement, Lawn & Garden, Pets Products, Headphones, Beauty, Musical Instruments, Business & Industrial Supplies, Outdoors, Tools, Sports, Baby Products, Amazon Coins | 3.00%" and "All Other Categories | 4.00%". The page states no revision date.',
    impact:
      'Two consequences. First, the rate cells stay blank, but for a different and much narrower reason than before: Amazon assigns the rate by its own product category, which is not necessarily the browse node rendered on the listing. For B08FKW9JRM the observed department is Tools & Home Improvement, and every candidate row for it (Tools, Home Improvement) is 3.00%, so that rate is effectively determinate. For B0BSKQW2T2 and B08DY9HRWD the observed department is Home & Kitchen, whose candidate rows disagree \u2014 Kitchen 4.50% versus Home 3.00% \u2014 so those two cannot be resolved from the browse node. Second, this flag previously implied the third-party figures were worthless; one of them (amawp.com, Kitchen 4.50% and Tools/Home/Home Improvement 3.00%) matches the official table exactly, while earnifyhub.com (Kitchen 5%, Home Improvement 8%) does not. The rule "leave it blank rather than guess" was still correct, because a third-party match is not a source, but the claim that the rate was unresolvable was not.',
    action:
      'Read the assigned commission category for each ASIN from Associates Central or from an earnings report line, which reflects Amazon\u2019s own categorisation rather than the browse node. Then enter the rate together with the schedule name. Note that the standard off-site schedule (S16) and the onsite schedule (S04) differ materially \u2014 Kitchen is 4.50% off-site but 1.25% onsite \u2014 so a rate quoted without naming its schedule is meaningless even when the number is correct.',
    sourceIds: ['S16', 'S02', 'S04', 'S13', 'S14', 'S15'],
  },
  {
    id: 'F-06',
    severity: 'medium',
    status: 'needs-review',
    category: 'Editorial',
    title: 'The brief\u2019s air-fryer editorial hypotheses do not match the observed product set',
    summary:
      'Four suggested guide titles concern air fryers and multi-function cooking appliances. None of the three resolved products is a cooking appliance.',
    evidence:
      'Observed browse-node paths on 2026-11-20: B08FKW9JRM sits in Tools & Home Improvement \u203a Paint, Wall Treatments & Supplies \u203a Wallpaper & Wallpapering Supplies \u203a Wallpaper Tools (node 164701011). B0BSKQW2T2 sits in Home & Kitchen \u203a Kitchen & Dining \u203a Storage & Organization \u203a Racks & Holders \u203a Paper Towel Holders (node 3744201). B08DY9HRWD sits in the same path under Pot Racks (node 289824). None is an air fryer, oven or cooking appliance.',
    impact:
      'Publishing the air-fryer titles as if they described this product set would mislead both readers and search engines, and would create affiliate content with no product to link to. The brief itself states these are working titles and not claims about popularity, so they are retained \u2014 but quarantined.',
    action:
      'Decide one of three things: (a) drop the air-fryer cluster; (b) keep it as a genuine second vertical and supply air-fryer links to verify; or (c) keep the four titles as unpublished drafts. This build implements (c): the four guides are published in a cluster clearly labelled HYPOTHESIS ONLY, they carry no product mapping and no outbound product link, and their status is stated at the foot of each article.',
    sourceIds: ['S06', 'S07', 'S08'],
  },
  {
    id: 'F-07',
    severity: 'medium',
    status: 'needs-review',
    category: 'Data integrity',
    title: 'One supplied link was submitted twice',
    summary: 'https://link.amazon/B03QDuGdo appears as both the second and the third link in the brief.',
    evidence:
      'The brief lists four links: B0hmGG4m2, B03QDuGdo, B03QDuGdo, B0hpD2JGQ. Submissions L2 and L3 are byte-identical. Both were resolved and both landed on ASIN B0BSKQW2T2.',
    impact:
      'Four submitted links yield three unique products. Any count of "products marketed" that reports four is wrong. The register keeps all four submission rows so the duplication is visible rather than silently deduplicated.',
    action:
      'Confirm whether a fourth distinct product was intended. If so, supply its link and it will be added as a new submission row and a new register entry.',
    sourceIds: ['S09'],
  },
  {
    id: 'F-08',
    severity: 'high',
    status: 'needs-review',
    category: 'Provenance',
    title: 'Self-audit: this research was performed by an automated agent against Amazon pages',
    summary:
      'Amazon\u2019s Program Policies contain Agent Terms requiring an autonomous agent to identify itself in the user-agent string and not to conceal that its access is automated. This session cannot confirm that requirement was met.',
    evidence:
      'IP License \u00a74 states: "No Agent may access, use, or interact with Program Content unless, at all times, it identifies itself and operates in strict accordance with the requirements in section 3 of these Agent Terms", and requires the string "Agent/[agent name]" in the user agent of all HTTP/HTTPS requests, plus a prohibition on concealing or obfuscating that access is from an Agent. The fetches that produced this register were made by an automated agent through a retrieval tool. The user-agent string those requests carried is not visible to this session and is therefore not confirmable here. The agent was also not operating under an enrolled Associates account.',
    impact:
      'The register is a good-faith observation record, but its collection method has an unresolved policy question attached to it. This is disclosed rather than buried, because the brief asks for a gate in front of the parts that cannot be automated.',
    action:
      'Have a human re-verify each of the three listings in a normal signed-out browser and re-record the values with a new capture date before any of them is used in promotional copy. Going forward, any automated collection should be run through the PA-API or Creators API under an enrolled account, or with a compliant Agent user-agent string.',
    sourceIds: ['S02'],
  },
  {
    id: 'F-09',
    severity: 'medium',
    status: 'by-design',
    category: 'Compliance',
    title: 'No Amazon product images are embedded anywhere on this site',
    summary:
      'A deliberate design decision, not an omission. The imagery budget is spent on original brand artwork instead.',
    evidence:
      'IP License \u00a72(h) states that Product Advertising Content consisting of an image may not be stored or cached, that a LINK to such an image may be stored for up to 24 hours, and that other Product Advertising Content may be cached for up to 24 hours provided it is then refreshed by a call to Creators API, PA-API or a new Data Feed. A static GitHub Pages site cannot refresh anything: its files are written once and served indefinitely, so any embedded or linked Amazon image would be stored far beyond 24 hours.',
    impact:
      'Product pages are text-and-table only. This costs some visual appeal and is the single largest reason the site does not look like a conventional affiliate storefront.',
    action:
      'To add product imagery compliantly, serve it from a backend that calls PA-API or Creators API and refreshes within the permitted window, or use Amazon-provided widgets designed for this purpose. Do not solve it by hotlinking m.media-amazon.com URLs into static HTML.',
    sourceIds: ['S02'],
  },
  {
    id: 'F-10',
    severity: 'medium',
    status: 'by-design',
    category: 'Compliance',
    title: 'Two verbatim Amazon disclaimers are reproduced on every page that displays Amazon-derived text or prices',
    summary: 'Required wording is reproduced exactly rather than paraphrased.',
    evidence:
      'IP License \u00a72(k) requires, in plain view: "CERTAIN CONTENT THAT APPEARS [IN THIS APPLICATION or ON THIS SITE, as applicable] COMES FROM AMAZON. THIS CONTENT IS PROVIDED \u2018AS IS\u2019 AND IS SUBJECT TO CHANGE OR REMOVAL AT ANY TIME." IP License \u00a72(i) requires a date/time stamp adjacent to any pricing or availability display, plus: "Product prices and availability are accurate as of the date/time indicated and are subject to change. Any price and availability information displayed on [relevant Amazon Site(s), as applicable] at the time of purchase will apply to the purchase of this product."',
    impact:
      'Every price on this site is shown with its capture timestamp and the \u00a72(i) disclaimer. The \u00a72(k) sentence appears in the footer of every page. Both are machine-checked by tools/verify.mjs.',
    action: 'None. Recorded so a reviewer does not mistake required boilerplate for filler.',
    sourceIds: ['S02'],
  },
  {
    id: 'F-11',
    severity: 'high',
    status: 'gated',
    category: 'Technical',
    title: 'The self-hosted analytics endpoint is built but not deployed \u2014 GitHub Pages cannot run server code',
    summary:
      'The reference collector exists and is tested locally, but the live site has no server to receive events, so all counters are local-only.',
    evidence:
      'GitHub Pages serves static files from a repository and executes nothing server-side. analytics/server/index.mjs is a zero-dependency Node collector implementing POST /collect and GET /stats. It is exercised by the local test suite, but no host is provisioned and the client is shipped with endpoint = null.',
    impact:
      'Click and conversion measurement is not yet live across visitors. The privacy-preserving outbound-click counter DOES work: it counts in the visitor\u2019s own browser with no cookies, no identifiers and no network dependency, and the dashboard shows those local counts. What is missing is aggregation across visitors.',
    action:
      'Deploy analytics/server/index.mjs to any host that runs Node (a small VPS, Fly.io, Render, or a Cloudflare Worker after adapting the storage layer), then set window.DIYHOME3_ANALYTICS_ENDPOINT on every page. Until that is done the site states plainly that no aggregate measurement is happening rather than implying otherwise.',
    sourceIds: [],
  },
  {
    id: 'F-12',
    severity: 'medium',
    status: 'needs-review',
    category: 'Technical',
    title: 'Search Console is not connected \u2014 no property access was available',
    summary:
      'The brief asks for Search Console and for the next topic to be chosen from measured queries. Neither is possible without property ownership verification, which needs an account this session does not have.',
    evidence:
      'Search Console verification requires either a DNS record on the domain, an HTML file or meta tag tied to a specific Google account, or Google Analytics / Tag Manager access. No account credentials were supplied and none should be. This build ships everything Search Console needs from the site side \u2014 a valid sitemap.xml referenced from robots.txt, canonical URLs on every page, and a single indexable domain \u2014 but performs no verification itself.',
    impact:
      'No query data. Every guide title in this build is an editorial hypothesis, not a keyword-driven choice, and the site says so.',
    action:
      'Verify the GitHub Pages domain in Search Console, submit /sitemap.xml, and after impressions accumulate, choose the next guide from the queries that actually bring arrivals. Do not backfill a keyword rationale onto titles that were written without one.',
    sourceIds: [],
  },
  {
    id: 'F-13',
    severity: 'medium',
    status: 'gated',
    category: 'Technical',
    title: 'The reader-capture form collects nothing until an endpoint is configured',
    summary:
      'The form is present and labelled, but with no backend it displays an explicit notice instead of silently accepting an address.',
    evidence:
      'A static page cannot receive a form POST. Rather than point the form at a third-party service that was never authorised, or let it appear to work while discarding input, the capture widget checks for a configured endpoint at runtime and renders one of two honest states: "capture not configured \u2014 no address is collected", or a working form posting to the configured endpoint.',
    impact:
      'SG-30 reader capture is implemented in the UI and instrumented as an analytics event, but it is inert on the live site. No email address submitted by a reader would be received or stored.',
    action:
      'Point the widget at the deployed analytics server\u2019s /subscribe route, or at an authorised email service endpoint, and add that service\u2019s privacy terms to the compliance page before enabling it. Note that marketing email is governed by CAN-SPAM in the US and by GDPR/ePrivacy for readers in the EU and UK \u2014 the owner is in Z\u00fcrich, so a lawful-basis statement and a working unsubscribe are prerequisites, not follow-ups.',
    sourceIds: [],
  },
  {
    id: 'F-14',
    severity: 'high',
    status: 'gated',
    category: 'Editorial',
    title: 'No named human author or reviewer is attached to this content',
    summary:
      'Byline reads "DIYHOME3 Editorial Desk" and is labelled as automated drafting pending named human review.',
    evidence:
      'FTC 16 CFR \u00a7255.1(a) requires that endorsements reflect the honest opinions, findings, beliefs or experience of the endorser, and \u00a7255.3 requires that where an advertisement represents the endorser as an expert, the endorser\u2019s qualifications must actually give them that expertise. Amazon\u2019s Operating Agreement \u00a75 separately forbids misrepresenting or embellishing the relationship with Amazon. No human has tested, owned or used any product in this register for this site.',
    impact:
      'Consequently this build publishes no first-person experience claim, no "we tested", no personal recommendation and no expert endorsement anywhere. That is a real editorial cost \u2014 the copy is less persuasive than it could be \u2014 and it is accepted deliberately rather than papered over with an invented persona.',
    action:
      'Assign a named human editor. That person should read each guide, correct or remove anything they cannot stand behind, and only then have their name and a real biography placed in the byline. Do not add a name to content nobody has read.',
    sourceIds: ['S10', 'S01'],
  },
  {
    id: 'F-15',
    severity: 'high',
    status: 'gated',
    category: 'Compliance',
    title: 'Special Link validation cannot be automated \u2014 it requires sign-in to Associates Central',
    summary:
      'The gate the brief asks for is implemented as a hard stop: every outbound product link is untagged and marked "attribution not active" until a human validates it.',
    evidence:
      'The brief requires testing one link per product in the enrolled Associates workflow and confirming both destination and tracking report before scaling. Confirming a tracking report requires an authenticated session in Associates Central. No credentials were supplied and none should be requested or stored in chat.',
    impact:
      'The site is fully published and fully useful as an editorial property, and it is deliberately NOT monetised. Product pages link to the canonical untagged listing so readers can still reach the product; the link is nonetheless marked rel="sponsored" because the intent is commercial.',
    action:
      'For each of the three ASINs: generate a tagged Special Link in Associates Central, click it in a signed-out browser, confirm the destination matches the ASIN, confirm the click appears in the tracking report, then set outboundHref and attributionActive in site/data/products.mjs and rebuild. tools/verify.mjs will refuse to pass if attributionActive is true while the href has no tag parameter.',
    sourceIds: ['S01', 'S02'],
  },
  {
    id: 'F-16',
    severity: 'medium',
    status: 'needs-review',
    category: 'Provenance',
    title: 'The tracking ID\u2019s enrollment status is unverified',
    summary:
      'shopnow047c-20 is recorded exactly as supplied. Whether it is an active tracking ID on an approved account could not be checked.',
    evidence:
      'Confirming a tracking ID requires sign-in to Associates Central under Account Settings. Amazon\u2019s public guidance does note that where an account was rejected for an Operating Agreement violation, links should be revised with new Tracking IDs when re-applying \u2014 which means an ID that looks well-formed is not thereby an ID that works.',
    impact:
      'Every Special Link built with this ID is only as good as the ID. If it is not active on an approved account, correctly formatted links still earn nothing.',
    action:
      'Confirm in Associates Central that shopnow047c-20 is listed as an active tracking ID on an approved account, and that the site\u2019s live GitHub Pages URL has been added to the account\u2019s site list. Amazon\u2019s guidance requires that the websites used to drive traffic be kept updated in the account.',
    sourceIds: ['S03'],
  },
  {
    id: 'F-17',
    severity: 'medium',
    status: 'needs-review',
    category: 'Data integrity',
    title: 'All observed prices are Black Friday deal prices from a single moment and a single geography',
    summary:
      'Every one of the three listings rendered a "Black Friday Deal" block on 2026-11-20. These are not standing prices.',
    evidence:
      'B08FKW9JRM: $5.08, \u221215%, Typical price $5.99. B0BSKQW2T2: $6.79, \u221215%, Typical price $7.99. B08DY9HRWD: $17.74, \u221226%, List Price $23.99, rendered with "Exclusive Prime price" and the prompt "Join Prime to buy this item at $17.74" \u2014 so that price is gated behind a Prime membership, while its non-member "Regular Price" rendered as $23.99. All three were read from a session whose delivery location rendered as Herndon 20170, on the amazon.com marketplace.',
    impact:
      'Publishing these figures without their context would misrepresent what a reader will actually pay. The Prime-gated price in particular is not available to a non-member, and the two anchor labels used ("Typical price" versus "List Price") are defined differently by Amazon and are not interchangeable.',
    action:
      'Re-check prices before any promotional send. Every price on this site is displayed with its capture timestamp and the \u00a72(i) disclaimer, and the pricing dashboard shows the anchor label and the Prime-gating flag alongside each figure.',
    sourceIds: ['S06', 'S07', 'S08', 'S02'],
  },
  {
    id: 'F-18',
    severity: 'low',
    status: 'needs-review',
    category: 'Data integrity',
    title: 'Brand and seller do not agree on one of the three listings',
    summary:
      'The brand store and the "Sold by" party are the same entity on two listings and different entities on the third.',
    evidence:
      'B08FKW9JRM: brand store "Art3d", Sold by "Art3d\u00ae" (seller A3N74L11X4M7XE) \u2014 same entity. B08DY9HRWD: brand store "ORDORA", Sold by "ORDORA Official" (seller A3D56P829A838V) \u2014 same entity. B0BSKQW2T2: brand store "niffgaff", Sold by "YH Urban" (seller A2R2TYCKX2EBXJ) \u2014 different entities, and the listing title itself carries no brand name. All three render "Ships from: Amazon", i.e. Amazon-fulfilled.',
    impact:
      'For B0BSKQW2T2, the name a reader would search for and the party they would contact about an order are not the same. Any copy that says "by niffgaff" is describing the brand store, not the seller of record. The brand string "niffgaff" was taken from the brand-store element only and is not confirmed as the product\u2019s own brand marking.',
    action:
      'Decide which identity to use in editorial copy for B0BSKQW2T2 and be consistent. This site uses the listing title without a brand attribution for that product and records both identities separately in the register.',
    sourceIds: ['S06', 'S07', 'S08'],
  },
  {
    id: 'F-19',
    severity: 'low',
    status: 'needs-review',
    category: 'Provenance',
    title: 'Some official sources were read through a search index extract rather than a direct fetch',
    summary:
      'Five of the fifteen register entries were not fetched directly. Each is labelled with how it was actually obtained.',
    evidence:
      'Fetched directly and successfully in this session: the Operating Agreement (S01, chunks 0\u20131), the Program Policies (S02, chunks 0, 1 and 8), the three product listings (S06, S07, S08) and the three supplied short links (S09). Read via a search index extract of the same official URL, direct fetch not performed or blocked: the Associates disclosure help topic (S03), the Onsite Commission Income Statement (S04), the ASIN definition page (S05 \u2014 a direct fetch returned an HTTP error), the FTC 16 CFR Part 255 PDF (S10), the FTC guidance hub (S11) and Google\u2019s outbound-link documentation (S12).',
    impact:
      'The extracts quoted are attributed to official domains and are consistent with each other, but a reviewer relying on an exact section number should open the source. No data cell on this site is filled from an extract alone; extracts are used only for policy wording and for the ASIN format definition.',
    action:
      'Open S03, S04, S05, S10, S11 and S12 manually before relying on them for anything beyond what is quoted here. Links are provided on the Flagged for Review page for exactly this purpose.',
    sourceIds: ['S03', 'S04', 'S05', 'S10', 'S11', 'S12'],
  },
  {
    id: 'F-20',
    severity: 'info',
    status: 'by-design',
    category: 'Method',
    title: 'The campaign ledger is empty, and no conversion score or revenue forecast is published anywhere',
    summary: 'Both are deliberate. The empty ledger is schema-first; the absent forecast is required.',
    evidence:
      'The brief asks for an empty but well-defined campaign ledger, with timestamp, source, channel, eligible sessions, clicks and reported orders added only when obtained from authorised first-party reports, and a dated provenance trail. It asks for no conversion score and no revenue forecast. Amazon\u2019s Operating Agreement \u00a74 independently states that Amazon makes "no representation, warranty, or covenant regarding the amount of traffic or commission income you can expect at any time".',
    impact:
      'The ledger ships as a schema, a validated empty dataset and an import path \u2014 not as a table with plausible-looking zeroes in it, which would be indistinguishable from real data once someone started filling rows.',
    action:
      'Populate the ledger only from Associates Central reports you are authorised to export. Each row must carry its report name and export date. The dashboard rejects a row without provenance.',
    sourceIds: ['S01'],
  },
  {
    id: 'F-21',
    severity: 'medium',
    status: 'needs-review',
    category: 'Editorial',
    title: 'The brief refers to "the five defined events" without enumerating them',
    summary:
      'Five events are implemented and documented, but the set is this build\u2019s definition and should be confirmed by the owner.',
    evidence:
      'The brief instructs "record the five defined events" and separately names the capabilities those events must serve: a privacy-preserving outbound-click counter, self-hosted analytics, disclosure placement, product links and reader capture (SG-30). No list of five event names appears anywhere in the brief.',
    impact:
      'The implemented set is page_view, disclosure_view, outbound_click, affiliate_click and reader_capture. It is a reasonable reading and it is fully documented, but it is an assumption, and an assumption about instrumentation is expensive to discover late because historical data cannot be backfilled.',
    action:
      'Confirm or replace the five event names before the analytics endpoint goes live. Changing them afterwards loses comparability with everything already collected.',
    sourceIds: [],
  },
  {
    id: 'F-22',
    severity: 'low',
    status: 'needs-review',
    category: 'Data integrity',
    title: '"Bought in past month" and star ratings are Amazon signals, not audited figures',
    summary: 'Recorded as displayed, with their wording preserved, and never restated as sales data.',
    evidence:
      'Observed on 2026-11-20: B08FKW9JRM "20K+ bought in past month" with 4.6 stars from 26,432 ratings and an "Amazon\u2019s Choice" badge, which the page itself explains "highlights highly rated, well-priced products available to ship immediately". B0BSKQW2T2 "8K+ bought in past month", 4.2 stars from 12,099 ratings, same badge. B08DY9HRWD "1K+ bought in past month", 4.4 stars from 18,835 ratings, and no badge rendered.',
    impact:
      'These are banded figures ("20K+") published by Amazon, not counts, and they are a single observation that will drift. A badge is a merchandising signal with a stated definition, not a test result.',
    action:
      'Do not convert a banded figure into a precise one in any downstream copy. Do not describe a badge as an award or a ranking. Re-observe before reuse.',
    sourceIds: ['S06', 'S07', 'S08'],
  },
  {
    id: 'F-23',
    severity: 'medium',
    status: 'needs-review',
    category: 'Technical',
    title: 'The site ships without any third-party analytics, ad tag or tracker',
    summary:
      'No Google Analytics, no Meta pixel, no third-party script of any kind is present, and that is intentional.',
    evidence:
      'No analytics property ID, measurement ID or container ID was provided in the brief, and installing one would mean choosing a third party and accepting its data terms on the owner\u2019s behalf. The only instrumentation shipped is first-party: assets/js/analytics.js, which counts five events in the visitor\u2019s own browser using no cookies, no persistent identifier, no IP address, no user-agent recording and no cross-site reads.',
    impact:
      'Privacy posture is strong and there is nothing to disclose in a cookie banner, because nothing is set. The trade-off is that there is no aggregate measurement until the self-hosted endpoint in F-11 is deployed.',
    action:
      'If a third-party analytics product is wanted later, that is an owner decision with a data-processing implication, and for readers in the EU, UK and Switzerland it engages GDPR, the UK GDPR and the Swiss FADP. Deploy the first-party collector first and only add a third party if the first-party data proves insufficient.',
    sourceIds: [],
  },
];

export const severityOrder = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
export const flagById = Object.fromEntries(flags.map((f) => [f.id, f]));

export const flagCounts = flags.reduce(
  (acc, f) => {
    acc[f.severity] = (acc[f.severity] || 0) + 1;
    acc.total += 1;
    if (f.status === 'gated') acc.gated += 1;
    if (f.status === 'needs-review') acc.needsReview += 1;
    if (f.status === 'by-design') acc.byDesign += 1;
    return acc;
  },
  { total: 0, gated: 0, needsReview: 0, byDesign: 0 }
);
