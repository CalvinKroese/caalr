# CAALR Website — Launch Checklist

## Pre-Launch (on caalr.netlify.app)

- [ ] All 19 artists have profile pages with name, medium, and bio
- [ ] All gallery images are displayed and deduplicated
- [ ] Events show upcoming/past correctly
- [ ] News items are migrated
- [ ] Board and meeting info is accurate on About page
- [ ] Facebook link works in footer
- [ ] Site looks good on phone, tablet, and desktop
- [ ] CMS login works at /admin
- [ ] Maintainer can add an artist through CMS
- [ ] Maintainer can add a gallery image through CMS
- [ ] Maintainer can add an event through CMS
- [ ] Maintainer guide is complete and reviewed
- [ ] Old Weebly URL redirects work (/shows.html → /events/, etc.)

## Domain Cutover

- [ ] Lower DNS TTL to 300 seconds (24 hours before cutover)
- [ ] Add caalr.com as custom domain in Netlify dashboard
- [ ] Update DNS records in GoDaddy to point to Netlify
- [ ] Wait for DNS propagation (up to 24 hours, usually faster)
- [ ] Verify https://caalr.com loads the new site
- [ ] Update `astro.config.mjs` site URL to `https://caalr.com`
- [ ] Remove noindex meta tag condition from BaseLayout.astro
- [ ] Push changes and verify rebuild

## Post-Launch

- [ ] Verify HTTPS certificate is active on caalr.com
- [ ] Test all pages on the live domain
- [ ] Test CMS at caalr.com/admin
- [ ] Verify sitemap at caalr.com/sitemap-index.xml
- [ ] Submit sitemap to Google Search Console
- [ ] Notify board members that the new site is live
- [ ] Cancel GoDaddy hosting (keep domain registration!)
- [ ] Share new maintainer guide with designated editor
