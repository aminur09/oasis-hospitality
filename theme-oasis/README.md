# Oasis Hospitality — Block Theme

A production-ready, accessible WordPress Block Theme for Oasis Hospitality (hotel management & development). Mobile-first, SEO-optimized, and ready for Site Editor. Comes with MU plugin and sample content import.

## Quick Start

1) Upload the theme folder:
- Copy `theme-oasis/` to `/wp-content/themes/`

2) Upload the MU plugin:
- Copy `mu-plugins/oasis-core.php` to `/wp-content/mu-plugins/`

3) Activate the theme:
- In wp-admin → Appearance → Themes → Activate “Oasis Hospitality”

4) Permalinks:
- Go to Settings → Permalinks → choose “Post Name” and save.

5) Import sample content:
- Go to Tools → Import → WordPress (install importer if needed)
- Import `content-import/oasis-import.xml`

6) Set pages:
- Go to Settings → Reading:
  - Set “Home” as Front Page (create a page titled “Home” if not present)
  - Set “News & Insights” as Posts Page (create a page titled “News & Insights”)

7) Navigation:
- Open Site Editor → Manage menus
- Assign the Primary nav to the Header and Footer nav to the Footer (or create new and add items):
  1. Home (/)
  2. Management Services (/management-services/)
  3. Development & Renovation (/development-renovation/)
  4. Portfolio (/projects/) — CPT archive
  5. News & Insights (/news/) — posts archive
  6. Careers (/careers/) — category archive
  7. About Us (/about/)
  8. Contact (/contact/)

8) Manage content (no code needed):
- Projects: wp-admin → Projects
- Careers: Add Posts in “Careers” category
- News & Insights: Add Posts in News/Insights/Press categories

9) Recommended Plugins:
- RankMath or Yoast SEO (schema, sitemaps)
- Fluent Forms or Gravity Forms (replace HTML form)
- WebP Express (image optimization)
- WP Job Manager (optional for structured career listings)
- Redis Object Cache (Cloudways)

10) Cloudways notes:
- PHP 8.2+ recommended
- Redis Object Cache ON
- Varnish enabled
- HTTPS forced
- Daily backups enabled

## Accessibility & SEO

- WCAG 2.2 AA: skip-to-content link in header, keyboard-accessible overlay navigation, high-contrast palette.
- Semantic headings and landmarks; proper focus states via core.
- Schema placeholders: use RankMath/Yoast to add Organization, BlogPosting, BreadcrumbList; consider Hotel schema for property pages.
- Alt text: ensure images have meaningful alt attributes.

## Developer Notes

- CPT “Projects” (slug `project`) with taxonomy `project_type` is registered by MU plugin.
- Image sizes: `card-3x2` (600x400 crop), `hero-xl` (1920x1080).
- Patterns are auto-registered under category “Oasis”.
- Logos are accessible SVGs with `<title>`.
- The contact form in the “Contact” pattern is HTML-only; swap to a forms plugin for submissions.

## Security

- XML-RPC disabled.
- File editing disabled in wp-admin.
- Minimal outputs sanitized (see helper functions).

## Support

For help customizing the theme or extending CPT fields, consider using core Custom Fields or ACF. The single-project template includes placeholders for meta fields (Location, Brand/Flag, Keys, Services Provided, Timeline, Highlights).