import { getCollections, getPages, getProducts } from 'lib/bigcommerce';
import { validateEnvironmentVariables } from 'lib/utils';
import { MetadataRoute } from 'next';

type Route = {
  url: string;
  lastModified: string;
};

// Ensure baseUrl cleans up any accidental 'https://' from the Vercel variable
const rawUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_VERCEL_URL || 'localhost:3000';
const cleanHost = rawUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
const baseUrl = cleanHost.includes('localhost') ? `http://${cleanHost}` : `https://${cleanHost}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  validateEnvironmentVariables();

  const routesMap = [''].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString()
  }));

  const collectionsPromise = getCollections().then((collections) =>
    collections.map((collection) => {
      // Strips '/search' if collection.path returns '/search/ferns/' instead of '/ferns/'
      const cleanPath = collection.path.startsWith('/search')
        ? collection.path.replace(/^\/search/, '')
        : collection.path;

      return {
        url: `${baseUrl}${cleanPath}`,
        lastModified: collection.updatedAt
      };
    })
  );

  const productsPromise = getProducts({}).then((products) =>
    products.map((product) => ({
      // Handle product pathing cleanly
      url: `${baseUrl}${product.handle.startsWith('/') ? product.handle : `/${product.handle}`}`,
      lastModified: product.updatedAt
    }))
  );

  const pagesPromise = getPages().then((pages) =>
    pages.map((page) => ({
      url: `${baseUrl}/${page.handle.replace(/^\//, '')}`,
      lastModified: page.updatedAt
    }))
  );

  let fetchedRoutes: Route[] = [];

  try {
    fetchedRoutes = (await Promise.all([collectionsPromise, productsPromise, pagesPromise])).flat();
  } catch (error) {
    throw JSON.stringify(error, null, 2);
  }

  return [...routesMap, ...fetchedRoutes];
}