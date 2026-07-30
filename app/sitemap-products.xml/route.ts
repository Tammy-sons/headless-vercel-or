import { NextResponse } from 'next/server';

const rawUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL || 'localhost:3000';
const cleanHost = rawUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
const baseUrl = cleanHost.includes('localhost') ? `http://${cleanHost}` : `https://${cleanHost}`;

export const revalidate = 3600;
export const maxDuration = 60;

async function getAllProducts() {
    const storeHash = process.env.BIGCOMMERCE_STORE_HASH;
    const accessToken = process.env.BIGCOMMERCE_ACCESS_TOKEN;
    if (!storeHash || !accessToken) return [];

    let allProducts: any[] = [];
    let page = 1;
    let totalPages = 1;

    do {
        const res = await fetch(
            `https://api.bigcommerce.com/stores/${storeHash}/v3/catalog/products?limit=250&page=${page}&is_visible=true`,
            {
                headers: { 'X-Auth-Token': accessToken, Accept: 'application/json' },
                cache: 'no-store'
            }
        );

        if (!res.ok) {
            console.error(`sitemap-products: API error ${res.status} on page ${page}`);
            break;
        }

        const json = await res.json();
        allProducts = allProducts.concat(json.data || []);
        totalPages = json.meta?.pagination?.total_pages || 1;
        page++;
    } while (page <= totalPages);

    return allProducts;
}

export async function GET() {
    const entries: string[] = [];

    try {
        const products = await getAllProducts();
        products.forEach((product: any) => {
            entries.push(
                `  <url>
    <loc>${baseUrl}${product.custom_url?.url || `/${product.sku || product.id}`}</loc>
    <lastmod>${product.date_modified || new Date().toISOString()}</lastmod>
  </url>`
            );
        });
    } catch (e) {
        console.error('sitemap-products failed', e);
    }

    const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>`;

    return new NextResponse(body, {
        headers: { 'Content-Type': 'application/xml' }
    });
}