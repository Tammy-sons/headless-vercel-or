import { getCollections, getPages } from 'lib/bigcommerce';
import { NextResponse } from 'next/server';

const rawUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL || 'localhost:3000';
const cleanHost = rawUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
const baseUrl = cleanHost.includes('localhost') ? `http://${cleanHost}` : `https://${cleanHost}`;

export const revalidate = 3600;
export const maxDuration = 60;

function urlEntry(loc: string, lastmod: string) {
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`;
}

export async function GET() {
    const entries: string[] = [urlEntry(baseUrl, new Date().toISOString())];

    try {
        const collections = await getCollections();
        collections.forEach((collection) => {
            const cleanPath = collection.path.startsWith('/search')
                ? collection.path.replace(/^\/search/, '')
                : collection.path;
            entries.push(
                urlEntry(
                    `${baseUrl}${cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`}`,
                    collection.updatedAt || new Date().toISOString()
                )
            );
        });
    } catch (e) {
        console.error('sitemap-pages: collections failed', e);
    }

    try {
        const pages = await getPages();
        pages.forEach((page) => {
            entries.push(
                urlEntry(`${baseUrl}/${page.handle.replace(/^\//, '')}`, page.updatedAt || new Date().toISOString())
            );
        });
    } catch (e) {
        console.error('sitemap-pages: pages failed', e);
    }

    const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>`;

    return new NextResponse(body, {
        headers: { 'Content-Type': 'application/xml' }
    });
}