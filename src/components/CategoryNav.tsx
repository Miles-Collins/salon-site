"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  titles: string[];
  offset?: number; // base pixels to offset for sticky header
  appearAfterId?: string; // element id after which nav becomes visible
};

export default function CategoryNav({ titles, offset = 96, appearAfterId }: Props) {
  const [active, setActive] = useState<string>("");
  const [show, setShow] = useState<boolean>(false);
  const ids = useMemo(() => titles.map((t) => t.replace(/\s+/g, "-")), [titles]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const [dynamicOffset, setDynamicOffset] = useState<number>(offset);

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry closest to the top that is intersecting
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible?.target?.id) setActive(visible.target.id);
      },
      {
        root: null,
        threshold: 0.4,
        rootMargin: `${-dynamicOffset}px 0px -60% 0px`,
      }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [ids, dynamicOffset]);

  // Compute dynamic offset (navbar + this nav height)
  useEffect(() => {
    const compute = () => {
      const header = document.querySelector('header') as HTMLElement | null;
      const headerH = header?.offsetHeight ?? 64;
      const navH = navRef.current?.offsetHeight ?? 48;
      setDynamicOffset(headerH + navH + 8);
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);

  // Appear only after the hero element scrolls out OR once user has scrolled a bit
  useEffect(() => {
    const thresh = 20;
    const setByScroll = () => setShow(window.scrollY > thresh);
    window.addEventListener('scroll', setByScroll);
    setByScroll();

    if (appearAfterId) {
      const hero = document.getElementById(appearAfterId);
      if (hero) {
        const io = new IntersectionObserver(
          (entries) => {
            const entry = entries[0];
            if (window.scrollY <= thresh) {
              setShow(!entry.isIntersecting);
            }
          },
          { root: null, threshold: 0.02 }
        );
        io.observe(hero);
        return () => { io.disconnect(); window.removeEventListener('scroll', setByScroll); };
      }
    }
    return () => window.removeEventListener('scroll', setByScroll);
  }, [appearAfterId]);

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - dynamicOffset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <nav
      ref={navRef}
      className={`fixed left-0 right-0 top-16 transition-all duration-300
        ${show
          ? 'z-40 opacity-100 translate-y-0 border-b border-black/10 bg-white/70 backdrop-blur'
          : 'z-0 opacity-0 -translate-y-6 pointer-events-none border-transparent bg-transparent'}`}
    >
      <div ref={containerRef} className="max-w-6xl mx-auto px-4 overflow-x-auto no-scrollbar">
        <ul className="flex justify-center flex-wrap items-center gap-x-8 gap-y-2 py-3">
          {/* All button */}
          <li key="all">
            <a
              href="#top"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`group whitespace-nowrap px-1 py-2 text-sm font-medium uppercase tracking-wide transition-colors text-black/70 hover:text-black link-underline`}
            >
              All
            </a>
          </li>
          {titles.map((t, idx) => {
            const id = ids[idx];
            const isActive = active === id;
            return (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={(e) => onClick(e, id)}
                  className={`group whitespace-nowrap px-1 py-2 text-sm font-medium uppercase tracking-wide transition-colors link-underline ${isActive ? 'text-black after:scale-x-100' : 'text-black/70 hover:text-black'}`}
                >
                  {t}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
