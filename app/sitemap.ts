import { getBlogPostsRest, getCollections, getPages } from 'lib/bigcommerce';
import { validateEnvironmentVariables } from 'lib/utils';
import { MetadataRoute } from 'next';

type Route = {
  url: string;
  lastModified: string;
};

// Clean host formatting safely
const rawUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_VERCEL_URL || 'localhost:3000';
const cleanHost = rawUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
const baseUrl = cleanHost.includes('localhost') ? `http://${cleanHost}` : `https://${cleanHost}`;

// Isolated REST helper for sitemap products (fetches up to 250 products safely)
async function getSitemapProductsRest() {
  const storeHash = process.env.BIGCOMMERCE_STORE_HASH;
  const accessToken = process.env.BIGCOMMERCE_ACCESS_TOKEN;

  if (!storeHash || !accessToken) return [];

  try {
    const res = await fetch(
      `https://api.bigcommerce.com/stores/${storeHash}/v3/catalog/products?limit=250&is_visible=true`,
      {
        headers: {
          'X-Auth-Token': accessToken,
          'Accept': 'application/json'
        },
        cache: 'no-store'
      }
    );

    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  validateEnvironmentVariables();

  // 1. Homepage
  const routesMap = [''].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString()
  }));

  // 2. Categories
  const collectionsPromise = getCollections().then((collections) =>
    collections.map((collection) => {
      const cleanPath = collection.path.startsWith('/search')
        ? collection.path.replace(/^\/search/, '')
        : collection.path;

      return {
        url: `${baseUrl}${cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`}`,
        lastModified: collection.updatedAt
      };
    })
  );

  // 3. Products via REST (Safe & isolated)
  const productsPromise = getSitemapProductsRest().then((products) =>
    products.map((product: any) => ({
      url: `${baseUrl}${product.custom_url?.url || `/${product.sku || product.id}`}`,
      lastModified: product.date_modified || new Date().toISOString()
    }))
  );

  // 4. Static Pages
  const pagesPromise = getPages().then((pages) =>
    pages.map((page) => ({
      url: `${baseUrl}/${page.handle.replace(/^\//, '')}`,
      lastModified: page.updatedAt
    }))
  );

  // 5. Blog Posts
  const blogPostsPromise = getBlogPostsRest().then((posts) =>
    posts.map((post: any) => ({
      url: `${baseUrl}/gardening-blog/${post.slug || post.handle || ''}`,
      lastModified: post.publishedAt || new Date().toISOString()
    }))
  );

  let fetchedRoutes: Route[] = [];

  try {
    fetchedRoutes = (
      await Promise.all([
        collectionsPromise,
        productsPromise,
        pagesPromise,
        blogPostsPromise
      ])
    ).flat();
  } catch (error) {
    console.error('Sitemap generation error:', error);
    fetchedRoutes = [];
  }

  return [...routesMap, ...fetchedRoutes];
}