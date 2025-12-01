-- Seed service detail pages
-- Run this in your Supabase SQL Editor

-- COLOR SERVICES

INSERT INTO public.service_details (slug, service_name, category, base_price, hero_image, description, duration_min, is_published)
VALUES 
(
  'all-over-color-blowdry',
  'All Over Color & Blow Dry',
  'Color',
  117,
  NULL, -- You can upload image and add filename later
  'A single, all-over hair color is applied from roots to ends to refresh your tone or completely change your look. This service is perfect if you want rich, even color with beautiful shine and coverage for grays or faded ends. Your visit finishes with a professional blowout and style, so you leave the salon looking fully polished and photo-ready.',
  120,
  true
);

INSERT INTO public.service_details (slug, service_name, category, base_price, hero_image, description, duration_min, is_published)
VALUES 
(
  'all-over-color-haircut',
  'All Over Color & Haircut/Style',
  'Color',
  140,
  NULL,
  'This service combines a full single-process color with a customized haircut and finished style. Your stylist will apply one cohesive shade from roots to ends, then design a cut that flatters your face shape, hair texture, and lifestyle. You''ll leave with fresh color, a new cut, and a polished blow-dry so everything feels cohesive and intentional.',
  120,
  true
);

INSERT INTO public.service_details (slug, service_name, category, base_price, hero_image, description, duration_min, is_published)
VALUES 
(
  'all-over-color',
  'All Over Color',
  'Color',
  72,
  NULL,
  'A solid, single shade is applied primarily at the roots and through the hair as needed to refresh regrowth and keep your color looking rich and even. Ideal for maintaining your existing tone, covering gray, or deepening your natural shade without additional lightening or foiling. This is a great maintenance option between bigger color changes.',
  90,
  true
);

INSERT INTO public.service_details (slug, service_name, category, base_price, hero_image, description, duration_min, is_published)
VALUES 
(
  'lowlights-extra-color',
  'Lowlights / Extra Color',
  'Color',
  20,
  NULL,
  'Lowlights or an extra color are added to your existing service to create more depth, dimension, and contrast. Your stylist weaves in deeper or complementary tones to break up a flat blonde, soften a strong highlight, or add richness through the mid-lengths and ends. This upgrade is perfect when your color feels "too one-note" and you want a more lived-in, multi-dimensional look.',
  15,
  true
);

-- FOILS & BALAYAGE

INSERT INTO public.service_details (slug, service_name, category, base_price, hero_image, description, duration_min, is_published)
VALUES 
(
  'surface-foil',
  'Surface Foil & Style',
  'Foils & Balayage',
  135,
  NULL,
  'Foils are placed on the top, crown, and hairline to brighten the areas that show the most, without doing a full head. This surface technique is ideal for refreshing existing highlights, adding a sun-kissed halo around the face, or giving fine hair a little extra pop. Your service includes toner/gloss as needed and a professional blowout to show off the new dimension.',
  120,
  true
);

INSERT INTO public.service_details (slug, service_name, category, base_price, hero_image, description, duration_min, is_published)
VALUES 
(
  'surface-foil-haircut',
  'Surface Foil & Haircut/Style',
  'Foils & Balayage',
  156,
  NULL,
  'This service pairs strategic surface foils on the top, crown, and hairline with a customized haircut and finished style. It''s great for clients who want a brightening effect where it counts most, plus a fresh cut to enhance the movement of their highlights. You''ll leave with a cohesive look where your color placement and haircut are designed to work together.',
  120,
  true
);

INSERT INTO public.service_details (slug, service_name, category, base_price, hero_image, description, duration_min, is_published)
VALUES 
(
  'full-foil',
  'Full Foil & Style',
  'Foils & Balayage',
  150,
  NULL,
  'Foils are placed throughout the entire head to create maximum brightness and dimension from roots to ends. This is ideal if you love a very light look, want to blend old color, or you''re transitioning to a higher-maintenance blonde. Toner/gloss is included as needed to refine the tone, followed by a smooth blowout so you can see the full effect.',
  150,
  true
);

INSERT INTO public.service_details (slug, service_name, category, base_price, hero_image, description, duration_min, is_published)
VALUES 
(
  'full-foil-haircut',
  'Full Foil & Haircut/Style',
  'Foils & Balayage',
  175,
  NULL,
  'A comprehensive foiling service paired with a customized haircut and style. Your stylist places foils throughout the head for all-over lightness and contrast, then shapes the hair with a cut that highlights your new color placement. It''s a great option for big refreshes, seasonal changes, or those "new hair, new me" moments.',
  150,
  true
);

INSERT INTO public.service_details (slug, service_name, category, base_price, hero_image, description, duration_min, is_published)
VALUES 
(
  'balayage',
  'Balayage & Style',
  'Foils & Balayage',
  175,
  NULL,
  'Balayage is a hand-painted highlighting technique that creates soft, blended lightness with a more natural grow-out than traditional foils. Your stylist customizes the placement to mimic how the sun would naturally lighten your hair, focusing brightness on the mid-lengths and ends while keeping the root softer. This service includes a finished style so you can see the effortless, sun-kissed dimension from every angle.',
  150,
  true
);

-- DOUBLE PROCESS

INSERT INTO public.service_details (slug, service_name, category, base_price, hero_image, description, duration_min, is_published)
VALUES 
(
  'virgin-double-process',
  'Virgin Double Process & Style',
  'Double Process',
  170,
  NULL,
  'A double process is used to take you to a bright, all-over blonde or vivid fashion color when starting from hair that hasn''t been previously lightened. First, lightener is applied from roots to ends to lift your natural pigment. After rinsing, a toner or fashion shade is applied to perfect the final color. The service finishes with a blow-dry and style, so your new blonde (or bold color) looks sleek and intentional.',
  150,
  true
);

INSERT INTO public.service_details (slug, service_name, category, base_price, hero_image, description, duration_min, is_published)
VALUES 
(
  'double-process-retouch',
  'Double Process Retouch & Style',
  'Double Process',
  130,
  NULL,
  'This maintenance service is designed for guests who are already all-over blonde or have a previous double process. Lightener is applied only to the regrowth area to keep your blonde consistent from roots to ends, followed by toner to refine the shade. It''s ideal for keeping your blonde bright and seamless, and includes a finished style so you leave feeling refreshed.',
  120,
  true
);

-- HAIRCUTS & STYLING

INSERT INTO public.service_details (slug, service_name, category, base_price, hero_image, description, duration_min, is_published)
VALUES 
(
  'womens-haircut-style',
  'Women''s Haircut/Style',
  'Haircuts & Styling',
  47,
  NULL,
  'A fully customized women''s haircut with a complete blow-dry and style. Your stylist will consult with you on length, layers, face-framing, and styling preferences, then shape the cut to suit your hair texture and daily routine. The finished style helps you see how to wear your new cut at home, whether you love sleek and smooth or soft, lived-in waves.',
  45,
  true
);

INSERT INTO public.service_details (slug, service_name, category, base_price, hero_image, description, duration_min, is_published)
VALUES 
(
  'womens-haircut',
  'Women''s Haircut',
  'Haircuts & Styling',
  37,
  NULL,
  'A tailored haircut focused on shape and healthy ends, without a full blowout. Perfect for regular maintenance trims, dusting split ends, or simple shape adjustments when you don''t need a full styling lesson. Hair may be rough-dried or minimally styled so the focus stays on the cut itself.',
  30,
  true
);

INSERT INTO public.service_details (slug, service_name, category, base_price, hero_image, description, duration_min, is_published)
VALUES 
(
  'mens-cut',
  'Men''s Cut',
  'Haircuts & Styling',
  29,
  NULL,
  'A detailed men''s haircut designed around your hair type, growth patterns, and personal style. Your stylist can create anything from clean fades and classic scissor cuts to more textured, modern looks. The service typically includes simple styling and product recommendations so your cut is easy to recreate day-to-day.',
  45,
  true
);

INSERT INTO public.service_details (slug, service_name, category, base_price, hero_image, description, duration_min, is_published)
VALUES 
(
  'bang-trim',
  'Bang Trim',
  'Haircuts & Styling',
  15,
  NULL,
  'A quick clean-up for bangs or fringe between full haircuts. Your stylist reshapes and softens the area around your eyes so your bangs sit at a flattering length and blend smoothly into the rest of your haircut. Great for keeping your look fresh without committing to a full appointment.',
  15,
  true
);

INSERT INTO public.service_details (slug, service_name, category, base_price, hero_image, description, duration_min, is_published)
VALUES 
(
  'child-haircut',
  'Child Haircut',
  'Haircuts & Styling',
  21,
  NULL,
  'A kid-friendly haircut for younger guests, focused on comfort and simplicity. Your stylist works patiently to create an age-appropriate, easy-to-manage cut while making the experience fun and relaxed. Ideal for school cuts, first haircuts, or routine trims.',
  30,
  true
);

INSERT INTO public.service_details (slug, service_name, category, base_price, hero_image, description, duration_min, is_published)
VALUES 
(
  'child-haircut-style',
  'Child Haircut/Style',
  'Haircuts & Styling',
  30,
  NULL,
  'A children''s haircut plus a simple style at the end — think quick blow-dry, a little curl, or styling product to show off the new cut. This is a fun choice for special occasions, pictures, or when your kiddo wants the full "salon experience." The focus is still on keeping things comfortable, efficient, and stress-free.',
  45,
  true
);

INSERT INTO public.service_details (slug, service_name, category, base_price, hero_image, description, duration_min, is_published)
VALUES 
(
  'shampoo-style',
  'Shampoo & Style',
  'Haircuts & Styling',
  32,
  NULL,
  'A relaxing shampoo with a scalp massage followed by a professional blow-dry and style. Perfect before events, nights out, or anytime you want that "fresh from the salon" finish without a cut or color. Your stylist can create smooth and sleek, bouncy volume, or soft waves tailored to your preference.',
  45,
  true
);

-- WAXING

INSERT INTO public.service_details (slug, service_name, category, base_price, hero_image, description, duration_min, is_published)
VALUES 
(
  'brow-tint',
  'Brow Tint',
  'Waxing',
  15,
  NULL,
  'A semi-permanent color is applied to the brows to enhance their shape and definition. Tinting can make sparse brows appear fuller, deepen light hairs, and create a more polished frame for your eyes. Results typically last several weeks and pair beautifully with a brow wax for a clean, lifted look.',
  15,
  true
);

INSERT INTO public.service_details (slug, service_name, category, base_price, hero_image, description, duration_min, is_published)
VALUES 
(
  'brow-wax',
  'Brow Wax',
  'Waxing',
  17,
  NULL,
  'Wax is used to gently remove unwanted hair above, below, and between the brows, creating a clean and flattering shape. Your stylist tailors the arch and thickness to your face shape and personal preferences — from soft and natural to more structured. This quick service instantly opens up the eye area and makes makeup application easier.',
  15,
  true
);

INSERT INTO public.service_details (slug, service_name, category, base_price, hero_image, description, duration_min, is_published)
VALUES 
(
  'lip-wax',
  'Lip Wax',
  'Waxing',
  15,
  NULL,
  'A fast, effective wax for removing fine or stubborn hair on the upper lip. This service leaves the skin smoother than shaving and helps makeup sit more evenly. It''s a great add-on to any hair or brow appointment when you want a completely polished look.',
  15,
  true
);
