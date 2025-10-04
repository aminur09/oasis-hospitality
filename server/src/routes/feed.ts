import { Router } from 'express';
import { prisma } from '../server';

export const feedRouter = Router();

function escapeXml(s: string) {
  return s.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case '"':
        return '&quot;';
      case "'":
        return '&apos;';
      default:
        return c;
    }
  });
}

feedRouter.get('/sitemap.xml', async (_req, res) => {
  const posts = await prisma.post.findMany({ where: { status: 'PUBLISHED' }, select: { slug: true, updatedAt: true } });
  const projects = await prisma.project.findMany({ where: { status: 'PUBLISHED' }, select: { slug: true, updatedAt: true } });
  const careers = await prisma.career.findMany({ where: { status: 'PUBLISHED' }, select: { slug: true, updatedAt: true } });

  const base = process.env.PUBLIC_BASE_URL || 'http://localhost';
  const urls = [
    '/',
    '/management-services',
    '/development-renovation',
    '/projects',
    '/news',
    '/careers',
    '/about',
    '/contact',
    '/privacy',
    '/terms'
  ]
    .map((u) => `<url><loc>${base}${u}</loc></url>`)
    .join('');

  const postsUrls = posts.map((p) => `<url><loc>${base}/news/${p.slug}</loc><lastmod>${p.updatedAt.toISOString()}</lastmod></url>`).join('');
  const projectsUrls = projects.map((p) => `<url><loc>${base}/projects/${p.slug}</loc><lastmod>${p.updatedAt.toISOString()}</lastmod></url>`).join('');
  const careersUrls = careers.map((c) => `<url><loc>${base}/careers/${c.slug}</loc><lastmod>${c.updatedAt.toISOString()}</lastmod></url>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
${postsUrls}
${projectsUrls}
${careersUrls}
</urlset>`;
  res.set('Content-Type', 'application/xml').send(xml);
});

feedRouter.get('/robots.txt', (_req, res) => {
  const base = process.env.PUBLIC_BASE_URL || 'http://localhost';
  const txt = `User-agent: *
Allow: /

Sitemap: ${base}/sitemap.xml
`;
  res.set('Content-Type', 'text/plain').send(txt);
});

feedRouter.get('/feed.xml', async (_req, res) => {
  const base = process.env.PUBLIC_BASE_URL || 'http://localhost';
  const items = await prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { publishedAt: 'desc' },
    take: 20
  });

  const feedItems = items
    .map(
      (i) => `<item>
<title>${escapeXml(i.title)}</title>
<link>${base}/news/${i.slug}</link>
<guid isPermaLink="false">${base}/news/${i.slug}</guid>
<pubDate>${i.publishedAt ? i.publishedAt.toUTCString() : ''}</pubDate>
<description><![CDATA[${i.excerpt || ''}]]></description>
</item>`
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
<title>Oasis Hospitality — News</title>
<link>${base}/news</link>
<description>Latest news and insights from Oasis Hospitality</description>
${feedItems}
</channel>
</rss>`;
  res.set('Content-Type', 'application/xml').send(xml);
});

export default feedRouter;