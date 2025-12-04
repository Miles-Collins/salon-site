import Section from "@/components/Section";
import Link from "next/link";
import { serviceCategories } from "@/data/services";
import CategoryNav from "@/components/CategoryNav";
import { Dancing_Script } from "next/font/google";
import Image from "next/image";
import servicesHero from "../../../public/services-hero.jpg";

const dancing = Dancing_Script({ subsets: ["latin"], weight: ["700"] });

// Category icon mapping
const categoryIcons: Record<string, string> = {
  "Color": "🎨",
  "Foils & Balayage": "✨",
  "Double Process": "👑",
  "Haircuts & Styling": "✂️",
  "Waxing": "🌹",
};

// Service icon/badge emojis
const serviceEmojis: Record<string, string> = {
  "All Over": "🎨",
  "Foil": "✨",
  "Balayage": "🌞",
  "Double Process": "👑",
  "Haircut": "✂️",
  "Style": "💫",
  "Wax": "🌹",
  "Tint": "👀",
};

function getServiceEmoji(serviceName: string): string {
  for (const [key, emoji] of Object.entries(serviceEmojis)) {
    if (serviceName.includes(key)) {
      return emoji;
    }
  }
  return "💇";
}

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
            <section key={cat.title} id={cat.title.replace(/\s+/g, '-')} className="scroll-mt-24">
              {/* Category Header */}
              <div className="mb-16">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-5xl">{categoryIcons[cat.title] || "💇"}</span>
                  <h2 className="text-4xl md:text-5xl font-serif font-semibold text-black">{cat.title}</h2>
                </div>
                <div className="h-1 w-24 bg-gradient-to-r from-[#C9A961] to-transparent"></div>
              </div>

              {/* Services Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {cat.items.map((svc) => (
                  <div key={svc.name}>
                    {svc.slug ? (
                      <Link href={`/services/${svc.slug}`} className="group block h-full">
                        <div className="card service-card p-8 h-full flex flex-col hover:shadow-xl hover:border-[#C9A961] transition-all duration-300 hover:-translate-y-1">
                          <div className="flex items-start justify-between mb-4">
                            <span className="text-4xl">{getServiceEmoji(svc.name)}</span>
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#C9A961]/10 text-[#C9A961] rounded-full text-sm font-semibold group-hover:bg-[#C9A961]/20 transition">
                              {svc.time}
                            </span>
                          </div>
                          
                          <h3 className="text-lg md:text-xl font-semibold text-black mb-2 group-hover:text-[#C9A961] transition">{svc.name}</h3>
                          <p className="text-sm text-gray-600 mb-6 flex-grow">{svc.desc}</p>
                          
                          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                            <span className="text-2xl md:text-3xl font-bold text-black">${svc.price}</span>
                            <span className="text-sm text-[#C9A961] font-semibold group-hover:translate-x-1 transition">Learn More →</span>
                          </div>
                        </div>
                      </Link>
                    ) : (
                      <div className="card service-card p-8 h-full flex flex-col hover:shadow-lg transition-all duration-300">
                        <div className="flex items-start justify-between mb-4">
                          <span className="text-4xl">{getServiceEmoji(svc.name)}</span>
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
                            {svc.time}
                          </span>
                        </div>
                        
                        <h3 className="text-lg md:text-xl font-semibold text-black mb-2">{svc.name}</h3>
                        <p className="text-sm text-gray-600 mb-6 flex-grow">{svc.desc}</p>
                        
                        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                          <span className="text-2xl md:text-3xl font-bold text-black">${svc.price}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </Section>
    </>
  );
}
