-- Update hero_image filenames to match actual uploaded files in Supabase Storage

-- Color services
UPDATE service_details SET hero_image = 'all-over-color-blowdry.jpg' WHERE slug = 'all-over-color-blowdry';
UPDATE service_details SET hero_image = 'all-over-color-haircut.jpg' WHERE slug = 'all-over-color-haircut';
UPDATE service_details SET hero_image = 'all-over-color.jpg' WHERE slug = 'all-over-color';
UPDATE service_details SET hero_image = 'lowlights-extra-color.jpg' WHERE slug = 'lowlights-extra-color';

-- Foils & Balayage
UPDATE service_details SET hero_image = 'surface-foil.jpg' WHERE slug = 'surface-foil';
UPDATE service_details SET hero_image = 'surface-foil-haircut.jpg' WHERE slug = 'surface-foil-haircut';
UPDATE service_details SET hero_image = 'full-foil.jpg' WHERE slug = 'full-foil';
UPDATE service_details SET hero_image = 'full-foil-haircut.jpg' WHERE slug = 'full-foil-haircut';
UPDATE service_details SET hero_image = 'balayage.jpg' WHERE slug = 'balayage';

-- Double Process
UPDATE service_details SET hero_image = 'virgin-double-process.jpg' WHERE slug = 'virgin-double-process';
UPDATE service_details SET hero_image = 'double-process-retouch.jpg' WHERE slug = 'double-process-retouch';

-- Haircuts & Styling
UPDATE service_details SET hero_image = 'womens-haircut-style.jpg' WHERE slug = 'womens-haircut-style';
UPDATE service_details SET hero_image = 'womens-haircut.jpg' WHERE slug = 'womens-haircut';
UPDATE service_details SET hero_image = 'mens-cut.jpg' WHERE slug = 'mens-cut';
UPDATE service_details SET hero_image = 'child-haircut.jpg' WHERE slug = 'child-haircut';
UPDATE service_details SET hero_image = 'shampoo-style.jpg' WHERE slug = 'blowout';

-- Waxing
UPDATE service_details SET hero_image = 'brow-tint.jpg' WHERE slug = 'brow-tint';
UPDATE service_details SET hero_image = 'brow-wax.jpg' WHERE slug = 'brow-wax';
UPDATE service_details SET hero_image = 'lip-wax.jpg' WHERE slug = 'lip-wax';
