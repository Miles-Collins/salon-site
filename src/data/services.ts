export type Service = {
  name: string;
  price: number;
  time: string; // "120 min"
  desc: string;
  slug?: string; // URL slug for detail page
};

export type ServiceCategory = {
  title: string;
  items: Service[];
};

export const serviceCategories: ServiceCategory[] = [
  {
    title: "Color",
    items: [
      { name: "All Over Color & Blow Dry", price: 117, time: "120 min", desc: "One singular color all over from roots to ends with a blow dry and style", slug: "all-over-color-blowdry" },
      { name: "All Over Color & Haircut/Style", price: 140, time: "120 min", desc: "One singular color from roots to ends with a haircut and style", slug: "all-over-color-haircut" },
      { name: "All Over Color", price: 72, time: "90 min", desc: "One color all over on the root", slug: "all-over-color" },
      { name: "Lowlights/Extra Color", price: 20, time: "15 min", desc: "Add lowlights or extra color to your service", slug: "lowlights-extra-color" },
    ],
  },
  {
    title: "Foils & Balayage",
    items: [
      { name: "Surface Foil & Style", price: 135, time: "120 min", desc: "Foils on top/crown/hairline, gloss/toner, blowdry", slug: "surface-foil" },
      { name: "Surface Foil & Haircut/Style", price: 156, time: "120 min", desc: "Surface foils with haircut and blowdry", slug: "surface-foil-haircut" },
      { name: "Full Foil & Style", price: 150, time: "150 min", desc: "Full placement, gloss/toner, blow dry", slug: "full-foil" },
      { name: "Full Foil & Haircut/Style", price: 175, time: "150 min", desc: "Full placement with haircut and blow dry", slug: "full-foil-haircut" },
      { name: "Balayage & Style", price: 175, time: "150 min", desc: "Sun-kissed balayage with finish", slug: "balayage" },
    ],
  },
  {
    title: "Double Process",
    items: [
      { name: "Virgin Double Process & Style", price: 170, time: "150 min", desc: "Lightener roots to ends, toner, style", slug: "virgin-double-process" },
      { name: "Double Process Retouch & Style", price: 130, time: "120 min", desc: "Root retouch for all-over blonde", slug: "double-process-retouch" },
    ],
  },
  {
    title: "Haircuts & Styling",
    items: [
      { name: "Womens Haircut/Style", price: 47, time: "45 min", desc: "Personalized haircut and style", slug: "womens-haircut-style" },
      { name: "Womens Haircut", price: 37, time: "30 min", desc: "Personalized women's haircut", slug: "womens-haircut" },
      { name: "Mens Cut", price: 29, time: "45 min", desc: "Tailored men's haircut", slug: "mens-cut" },
      { name: "Bang Trim", price: 15, time: "15 min", desc: "Quick bang trim", slug: "bang-trim" },
      { name: "Child Haircut", price: 21, time: "30 min", desc: "Kids haircut", slug: "child-haircut" },
      { name: "Child Haircut/Style", price: 30, time: "45 min", desc: "Kids haircut and style", slug: "child-haircut-style" },
      { name: "Shampoo & Style", price: 32, time: "45 min", desc: "Luxurious shampoo and style", slug: "shampoo-style" },
    ],
  },
  {
    title: "Waxing",
    items: [
      { name: "Brow Tint", price: 15, time: "15 min", desc: "Enhance brows with a tint", slug: "brow-tint" },
      { name: "Brow Wax", price: 17, time: "15 min", desc: "Sculpt and define brows", slug: "brow-wax" },
      { name: "Lip Wax", price: 15, time: "15 min", desc: "Upper lip wax", slug: "lip-wax" },
    ],
  },
];
