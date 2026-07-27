import Image from 'next/image';
import Link from 'next/link';

export default function Banner() {
    return (
        <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">

            {/* Background Image - fully clear, no overlay */}
            <Image
                src="https://cdn11.bigcommerce.com/s-9nn6ejxj73/images/stencil/original/image-manager/treenursery-home.jpg?t=1785181489"
                alt="Lush garden in bloom"
                fill
                priority
                quality={100}
                className="object-cover"
            />

            <div className="relative z-20 mx-auto px-6 max-w-7xl text-center flex flex-col items-center">

                {/* White backdrop panel behind text only */}
                <div
                    className="rounded-2xl px-6 py-10 md:px-16 md:py-14 flex flex-col items-center"
                    style={{ background: 'rgba(255,255,255,0.88)' }}
                >
                    <h1
                        className="text-5xl md:text-7xl font-medium tracking-tight mb-8 max-w-5xl text-[#1a3a2a] leading-[1.1]"
                        style={{ fontFamily: "'Lora', Georgia, serif" }}
                    >
                        Your Garden <span className="text-[#285e2c] italic">Reimagined,</span><br />
                        with Tree Nursery Co
                    </h1>

                    <p className="text-lg md:text-xl text-[#214935] max-w-2xl leading-relaxed mb-12 font-light">
                        Get personalized plant recommendations and visualize your dream landscape backed by 65+ years of nursery expertise.
                    </p>

                    <Link
                        href="/search"
                        className="inline-block px-12 py-4 rounded-full bg-[#1a3a2a] text-white font-bold text-lg transition-all hover:scale-105 hover:bg-[#285e2c] shadow-[0_15px_35px_rgba(0,0,0,0.3)] capitalize tracking-wide"
                    >
                        Shop Now
                    </Link>
                </div>
            </div>
        </section>
    );
}