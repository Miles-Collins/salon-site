import Section from "@/components/Section";
import Link from "next/link";
import { serviceCategories } from "@/data/services";
import CategoryNav from "@/components/CategoryNav";
import { Dancing_Script } from "next/font/google";
import Image from "next/image";
import servicesHero from "../../../public/services-hero.jpg";

const dancing = Dancing_Script({ subsets: ["latin"], weight: ["700"] });

export default function ServicesPage() {
  const categories = serviceCategories;
  return (
    <>
      {/* Mini Hero Section */}
      <div id="services-hero" className="relative w-full h-[360px] md:h-[460px] mb-16 md:mb-24 flex items-center overflow-hidden">
        <Image
          src={servicesHero}
          alt="Hair coloring in salon"
          fill
          priority
          placeholder="blur"
          className="absolute inset-0 object-cover object-center z-0"
          sizes="(min-width: 1280px) 1280px, 100vw"
          quality={70}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent z-10" />
        <div className="relative z-20 w-full">
          <div className="pl-6 sm:pl-10 md:pl-16 py-8 text-left">
            <span className={`${dancing.className} block text-white/95 text-5xl md:text-6xl lg:text-7xl mb-3 tracking-wide`}>Premium</span>
            <h1 className="text-white text-5xl md:text-7xl font-serif font-extrabold tracking-tight">SERVICES</h1>
          </div>
        </div>
      </div>
      {/* Sticky category nav with scrollspy */}
      <CategoryNav titles={categories.map((c) => c.title)} appearAfterId="services-hero" />

      <h1 className="sr-only">Services</h1>
      <Section>
        <div className="space-y-32">
          {categories.map((cat) => (
            <section key={cat.title} id={cat.title.replace(/\s+/g, '-')}
              className="relative bg-gray-50 overflow-hidden px-2 py-16 md:py-24 scroll-mt-24"
              style={{
                borderTop: '0.5px solid black',
                borderBottom: '0.5px solid black',
                boxShadow: 'inset 0 2px 0 0 #d4af37, inset 0 -2px 0 0 #d4af37'
              }}>
              <div className="relative z-10 flex flex-col md:flex-row gap-8 md:gap-16 max-w-5xl mx-auto">
                {/* Left: Category Title */}
                <div className="md:w-1/3 flex-shrink-0 flex items-start">
                  <h2 className="text-3xl font-extrabold uppercase tracking-tight text-black leading-tight md:text-left text-center mb-2">{cat.title}</h2>
                </div>
                {/* Right: Service List */}
                <div className="md:w-2/3 w-full">
                  <ul className="space-y-8">
                    {cat.items.map((svc) => (
                      <li key={svc.name} className="flex flex-col">
                        {svc.slug ? (
                          <Link href={`/services/${svc.slug}`} className="group">
                            <div className="flex items-center gap-3 transition-all group-hover:translate-x-1">
                              <span className="font-bold uppercase text-black text-sm md:text-base tracking-wide whitespace-nowrap premium-hover">{svc.name}</span>
                              <span aria-hidden="true" className="flex-1 border-t border-black/10 group-hover:border-[#C9A961] transition-colors" />
                              <span className="text-sm md:text-base font-medium text-black group-hover:text-[#C9A961] transition-colors whitespace-nowrap">${svc.price} &amp; up</span>
                            </div>
                            <p className="text-sm text-black/60 mt-1 group-hover:text-black/80 transition-colors">{svc.desc}</p>
                          </Link>
                        ) : (
                          <>
                            <div className="flex items-center gap-3">
                              <span className="font-bold uppercase text-black text-sm md:text-base tracking-wide whitespace-nowrap">{svc.name}</span>
                              <span aria-hidden="true" className="flex-1 border-t border-black/10" />
                              <span className="text-sm md:text-base font-medium text-black whitespace-nowrap">${svc.price} &amp; up</span>
                            </div>
                            <p className="text-sm text-black/60 mt-1">{svc.desc}</p>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          ))}
        </div>
      </Section>
    </>
  );
}
