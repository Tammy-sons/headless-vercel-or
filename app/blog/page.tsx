import BlogImage from 'components/blog/blog-image';
import { getBlogPostsRest } from 'lib/bigcommerce';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Gardening Blog',
    description: 'Practical gardening tips, plant guides, and expert advice.'
};

export default async function BlogIndexPage() {
    const posts = await getBlogPostsRest() || [];

    return (
        <div className="w-full bg-[#fcfdfc] py-20">
            <div className="w-full px-6 lg:px-12">
                <header className="mb-16">
                    <h1 className="text-6xl font-black text-[#285e2c] mb-2 tracking-tighter capitalize">Gardening Blog</h1>
                    <div className="h-1.5 w-24 bg-[#3aae93]"></div>
                </header>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 min-[2000px]:grid-cols-5 gap-8">
                    {posts.map((post: any) => (
                        <article key={post.id} className="flex flex-col bg-white border border-neutral-200 rounded-xl overflow-hidden">
                            <Link href={`/blog/${post.slug}`} className="relative aspect-[4/3]">
                                <BlogImage sources={post.imageSources} alt={post.title} />
                            </Link>
                            <div className="p-6 flex flex-col flex-grow">
                                <span className="text-[10px] font-bold text-[#3aae93] uppercase mb-3">
                                    {new Date(post.publishedDate).toLocaleDateString()}
                                </span>
                                <h2 className="text-xl font-extrabold mb-4 capitalize">{post.title}</h2>
                                <p className="text-neutral-500 text-sm line-clamp-3 mb-8">{post.summary}</p>
                                <Link
                                    href={`/blog/${post.slug}`}
                                    className="mt-auto text-xs font-black capitalize border-b-2 border-[#285e2c] w-fit"
                                >
                                    Read full story
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    );
}