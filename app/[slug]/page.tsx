import BlogImage from 'components/blog/blog-image';
import { bigCommerceFetch, getBlogPostsRest, getPageContentRest } from 'lib/bigcommerce';
import {
    bigCommerceToVercelCollection,
    bigCommerceToVercelProducts
} from 'lib/bigcommerce/mappers';
import { getCategoryQuery } from 'lib/bigcommerce/queries/category';
import { getProductsCollectionQuery } from 'lib/bigcommerce/queries/product';
import { getEntityIdByRouteQuery } from 'lib/bigcommerce/queries/route';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const STATIC_PAGE_MAP: Record<string, number> = {
    'shipping-returns': 2,
    'contact-us': 4,
    'blog': 3,
    'gardening-blog': 3
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const { slug } = params;
    const path = slug.startsWith('/') ? slug : `/${slug}`;

    if (slug === 'blog' || slug === 'gardening-blog') {
        return {
            title: 'Gardening Blog',
            description: 'Practical gardening tips, plant guides, and expert advice.'
        };
    }

    const staticPageId = STATIC_PAGE_MAP[slug];
    if (staticPageId) {
        const pageData = await getPageContentRest(staticPageId);
        return {
            title: pageData?.meta_title || pageData?.name,
            description: pageData?.meta_description || ""
        };
    }

    try {
        const routeRes = await bigCommerceFetch<any>({ query: getEntityIdByRouteQuery, variables: { path }, cache: 'no-store' });
        const node = routeRes.body.data?.site?.route?.node;

        if (node?.__typename === 'Category') {
            const entityId = node.entityId;
            const categoryRes = await bigCommerceFetch<any>({ query: getCategoryQuery, variables: { entityId } });
            const seo = categoryRes?.body?.data?.site?.category?.seo;

            return {
                title: seo?.pageTitle || node.name,
                description: seo?.metaDescription || `Shop our selection of ${node.name}.`,
            };
        }
    } catch (e) {
        return { title: 'Tree Nursery Co' };
    }

    return { title: 'Tree Nursery Co' };
}

const PRODUCTS_PER_PAGE = 12;

export default async function DynamicPage({
    params,
    searchParams
}: {
    params: { slug: string };
    searchParams: { cursor?: string; page?: string };
}) {
    const { slug } = params;
    const path = slug.startsWith('/') ? slug : `/${slug}`;
    const cursor = searchParams.cursor || null;
    const currentPage = Number(searchParams.page) || 1;

    // --- BLOG PAGE LAYOUT ---
    if (slug === 'blog' || slug === 'gardening-blog') {
        const posts = await getBlogPostsRest() || [];
        return (
            <div className="w-full bg-[#fcfdfc] py-20">
                <div className="w-full px-6 lg:px-12">
                    <header className="mb-16">
                        <h1 className="text-6xl font-black text-[#285e2c] mb-2 tracking-tighter capitalize">Gardening Blog</h1>
                        <div className="h-1.5 w-24 bg-[#3aae93]"></div>
                    </header>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 min-[2000px]:grid-cols-5 gap-8">
                        {posts.map((post: any) => {
                            const cleanSlug = post.slug.startsWith('/') ? post.slug.substring(1) : post.slug;

                            return (
                                <article key={post.id} className="flex flex-col bg-white border border-neutral-200 rounded-xl overflow-hidden">
                                    <Link href={`/blog/${cleanSlug}`} className="relative aspect-[4/3]">
                                        <BlogImage sources={post.imageSources} alt={post.title} />
                                    </Link>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <span className="text-[10px] font-bold text-[#3aae93] uppercase mb-3">
                                            {new Date(post.publishedDate).toLocaleDateString()}
                                        </span>
                                        <h2 className="text-xl font-extrabold mb-4 capitalize">{post.title}</h2>
                                        <p className="text-neutral-500 text-sm line-clamp-3 mb-8">{post.summary}</p>
                                        <Link
                                            href={`/blog/${cleanSlug}`}
                                            className="mt-auto text-xs font-black capitalize border-b-2 border-[#285e2c] w-fit"
                                        >
                                            Read full story
                                        </Link>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    // --- STATIC PAGES LAYOUT (Shipping, Contact, etc) ---
    const pageId = STATIC_PAGE_MAP[slug];
    if (pageId) {
        const pageData = await getPageContentRest(pageId);
        if (pageData) {
            return (
                <div className="w-full px-6 lg:px-12 py-24">
                    <h1 className="text-6xl font-black text-[#285e2c] mb-12 tracking-tighter capitalize">{pageData.name}</h1>
                    <div className="prose prose-xl max-w-none" dangerouslySetInnerHTML={{ __html: pageData.body || '' }} />
                </div>
            );
        }
    }

    // --- CATEGORY PAGE LAYOUT ---
    const routeRes = await bigCommerceFetch<any>({ query: getEntityIdByRouteQuery, variables: { path }, cache: 'no-store' });
    const node = routeRes.body.data?.site?.route?.node;

    if (node?.__typename === 'Category') {
        const entityId = node.entityId;
        const [categoryRes, productsRes] = await Promise.all([
            bigCommerceFetch<any>({ query: getCategoryQuery, variables: { entityId } }),
            bigCommerceFetch<any>({ query: getProductsCollectionQuery, variables: { entityId, first: PRODUCTS_PER_PAGE, after: cursor } })
        ]);

        const categoryData = categoryRes?.body?.data?.site?.category;
        const productsObj = productsRes?.body?.data?.site?.category?.products;
        const category = bigCommerceToVercelCollection(categoryData);
        const products = bigCommerceToVercelProducts(productsObj?.edges?.map((e: any) => e.node) || []);
        const hasNextPage = productsObj?.pageInfo?.hasNextPage;
        const endCursor = productsObj?.pageInfo?.endCursor;

        return (
            <div className="w-full bg-[#f9f9f9] py-10">
                <div className="w-full px-6 lg:px-12">
                    <header className="mb-12">
                        <h1 className="text-5xl font-black text-[#285e2c] mb-4 tracking-tighter capitalize">{category.title}</h1>
                        <div className="h-1.5 w-24 bg-[#3aae93]"></div>
                    </header>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        {products.map((product: any) => (
                            <div key={product.handle} className="bg-white border border-neutral-100 shadow-sm p-4 flex flex-col items-center">
                                <Link href={`${product.handle}`} className="relative w-full aspect-square mb-6">
                                    <Image
                                        src={product.featuredImage?.url}
                                        alt={product.title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 25vw"
                                    />
                                </Link>

                                <p className="text-lg font-bold text-neutral-800 text-center mb-1 capitalize">
                                    {product.title}
                                </p>

                                <div className="text-neutral-600 font-semibold text-sm mb-6">
                                    {product.priceRange.minVariantPrice.amount === product.priceRange.maxVariantPrice.amount ? (
                                        `$${Number(product.priceRange.minVariantPrice.amount).toFixed(2)}`
                                    ) : (
                                        `$${Number(product.priceRange.minVariantPrice.amount).toFixed(2)} - $${Number(product.priceRange.maxVariantPrice.amount).toFixed(2)}`
                                    )}
                                </div>

                                <Link
                                    href={`${product.handle}`}
                                    className="w-full text-white py-3 rounded-full text-center font-bold text-sm capitalize tracking-wider transition-opacity hover:opacity-90 shadow-md"
                                    style={{
                                        backgroundImage: 'linear-gradient(to right, #4e6c25 0%, #254518 51%, #254518 100%)'
                                    }}
                                >
                                    Buy now
                                </Link>
                            </div>
                        ))}
                    </div>

                    {(hasNextPage || currentPage > 1) && (
                        <div className="flex justify-center items-center gap-6 mb-24 border-b border-neutral-100 pb-16">
                            {currentPage > 1 && (
                                <Link
                                    href={`/${slug}${currentPage === 2 ? '' : `?page=${currentPage - 1}`}`}
                                    className="h-12 px-8 flex items-center justify-center rounded-full bg-neutral-100 text-[#285e2c] font-black capitalize"
                                >
                                    Previous
                                </Link>
                            )}
                            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-[#285e2c] text-white font-black">
                                {currentPage}
                            </div>
                            {hasNextPage && (
                                <Link
                                    href={`/${slug}?page=${currentPage + 1}&cursor=${endCursor}`}
                                    className="h-12 px-8 flex items-center justify-center rounded-full bg-neutral-100 text-[#285e2c] font-black capitalize"
                                >
                                    Next
                                </Link>
                            )}
                        </div>
                    )}

                    {category.description && (
                        <section className="pt-10">
                            <div className="mb-12 flex items-center justify-center gap-8">
                                <div className="h-px flex-1 bg-neutral-200 hidden md:block"></div>
                                <span className="text-sm font-black capitalize tracking-[0.4em] text-[#285e2c] whitespace-nowrap text-center">
                                    About {category.title}
                                </span>
                                <div className="h-px flex-1 bg-neutral-200 hidden md:block"></div>
                            </div>
                            <div
                                className="prose prose-neutral prose-lg max-w-none prose-headings:text-[#285e2c] prose-headings:font-black prose-headings:capitalize prose-p:text-neutral-600 prose-strong:text-[#285e2c] prose-a:text-[#285e2c] text-center lg:text-left"
                                dangerouslySetInnerHTML={{ __html: category.description }}
                            />
                        </section>
                    )}
                </div>
            </div>
        );
    }

    return notFound();
}