import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function migrateImages() {
  const galleryDir = path.join(process.cwd(), "public/gallery");
  
  if (!fs.existsSync(galleryDir)) {
    console.error("Gallery directory not found");
    process.exit(1);
  }

  const files = fs
    .readdirSync(galleryDir)
    .filter((f) => f.endsWith(".webp") || f.endsWith(".jpg") || f.endsWith(".png"));

  console.log(`Found ${files.length} images to migrate`);

  for (const file of files) {
    const filePath = path.join(galleryDir, file);
    const fileContent = fs.readFileSync(filePath);

    try {
      console.log(`Uploading ${file}...`);
      
      const { data, error } = await supabase.storage
        .from("gallery")
        .upload(file, fileContent, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) {
        console.error(`Failed to upload ${file}:`, error.message);
      } else {
        console.log(`✓ Uploaded ${file}`);
      }
    } catch (err: any) {
      console.error(`Error uploading ${file}:`, err.message);
    }
  }

  console.log("Migration complete!");
}

migrateImages().catch(console.error);
