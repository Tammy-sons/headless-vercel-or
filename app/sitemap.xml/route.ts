import { NextResponse } from 'next/server';

const rawUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL || 'localhost:3000';
const cleanHost = rawUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
const baseUrl = cleanHost.includes('localhost') ? `http://${cleanHost}` : `https://${cleanHost}`;

export const dynamic = 'force-dynamic';

export async function GET() {
    const sitemaps = ['sitemap-pages.xml', 'sitemap-categories.xml', 'sitemap-products.xml', 'sitemap-blog.xml'];

    const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps
            .map(
                (s) => `  <sitemap>
    <loc>${baseUrl}/${s}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`
            )
            .join('\n')}
</sitemapindex>`;

    return new NextResponse(body, {
        headers: { 'Content-Type': 'application/xml' }
    });
}