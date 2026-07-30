import { getBlogPostsRest } from 'lib/bigcommerce';
import { NextResponse } from 'next/server';

const rawUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL || 'localhost:3000';
const cleanHost = rawUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
const baseUrl = cleanHost.includes('localhost') ? `http://${cleanHost}` : `https://${cleanHost}`;

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET() {
    const entries: string[] = [];

    try {
        const posts = await getBlogPostsRest();
        posts.forEach((post: any) => {
            entries.push(
                `  <url>
    <loc>${baseUrl}/gardening-blog/${post.slug}</loc>
    <lastmod>${post.publishedDate || new Date().toISOString()}</lastmod>
  </url>`
            );
        });
    } catch (e) {
        console.error('sitemap-blog failed', e);
    }

    const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>`;

    return new NextResponse(body, {
        headers: { 'Content-Type': 'application/xml' }
    });
}