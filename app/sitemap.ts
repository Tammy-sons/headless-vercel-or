import { getBlogPostsRest, getCollections, getPages, getProducts } from 'lib/bigcommerce';
import { validateEnvironmentVariables } from 'lib/utils';
import { MetadataRoute } from 'next';

type Route = {
  url: string;
  lastModified: string;
};

// Cleans up protocol prefixes and trailing slashes safely
const rawUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_VERCEL_URL || 'localhost:3000';
const cleanHost = rawUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
const baseUrl = cleanHost.includes('localhost') ? `http://${cleanHost}` : `https://${cleanHost}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  validateEnvironmentVariables();

  // 1. Static Core Routes
  const routesMap = [''].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString()
  }));

  // 2. Collections / Categories
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

  // 3. Products (Requesting 250 products)
  const productsPromise = getProducts({ first: 250 }).then((products) =>
    products.map((product) => ({
      url: `${baseUrl}/${product.handle.replace(/^\//, '')}`,
      lastModified: product.updatedAt
    }))
  );

  // 4. Static Pages (Shipping, Contact, Terms, etc.)
  const pagesPromise = getPages().then((pages) =>
    pages.map((page) => ({
      url: `${baseUrl}/${page.handle.replace(/^\//, '')}`,
      lastModified: page.updatedAt
    }))
  );

  // 5. Blog Posts (Fetching from BigCommerce REST endpoint)
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