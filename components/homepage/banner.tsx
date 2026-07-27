import Image from 'next/image';
import Link from 'next/link';

export default function Banner() {
    return (
        <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">

            {/* Background Image */}
            <Image
                src="https://cdn11.bigcommerce.com/s-9nn6ejxj73/images/stencil/original/image-manager/treenursery-home.jpg?t=1785181489"
                alt="Lush garden in bloom"
                fill
                priority
                quality={100}
                className="object-cover"
            />

            {/* Dark green gradient overlay for text readability */}
            <div
                className="absolute inset-0 z-10"
                style={{
                    background: 'linear-gradient(170deg, rgba(26,58,42,0.9) 0%, rgba(35,77,56,0.75) 45%, rgba(45,97,72,0.6) 100%)'
                }}
            />

            <div className="relative z-20 mx-auto px-6 max-w-7xl text-center flex flex-col items-center">

                <h1
                    className="text-5xl md:text-7xl font-medium tracking-tight mb-8 max-w-5xl text-white leading-[1.1]"
                    style={{ fontFamily: "'Lora', Georgia, serif" }}
                >
                    Your Garden <span className="text-[#a1c4b0] italic">Reimagined,</span><br />
                    with Tree Nursery Co
                </h1>

                <p className="text-lg md:text-xl text-[#a3d4b8] max-w-2xl leading-relaxed mb-12 font-light">
                    Get personalized plant recommendations and visualize your dream landscape backed by 65+ years of nursery expertise.
                </p>

                <Link
                    href="/search"
                    className="inline-block px-12 py-4 rounded-full bg-white text-[#1a3a2a] font-bold text-lg transition-all hover:scale-105 hover:bg-[#eff3ef] shadow-[0_15px_35px_rgba(0,0,0,0.4)] capitalize tracking-wide"
                >
                    Shop Now
                </Link>
            </div>
        </section>
    );
}