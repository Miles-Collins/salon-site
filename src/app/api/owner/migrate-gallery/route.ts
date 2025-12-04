import { NextResponse } from "next/server";
import { isOwner } from "@/lib/authz";
import { createClient } from "@supabase/supabase-js";
import { promises as fs } from "fs";
import * as path from "path";

export async function POST() {
  // Server-side owner check
  if (!(await isOwner())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get the public gallery directory
    const galleryDir = path.join(process.cwd(), "public/gallery");
    
    // Read files from directory
    const files = await fs.readdir(galleryDir);
    const imageFiles = files.filter((f) => /\.(webp|jpg|png)$/i.test(f));

    console.log(`Migrating ${imageFiles.length} images...`);

    const results = [];

    for (const file of imageFiles) {
      try {
        const filePath = path.join(galleryDir, file);
        const fileContent = await fs.readFile(filePath);

        const { error } = await supabase.storage
          .from("gallery")
          .upload(file, fileContent, {
            cacheControl: "3600",
            upsert: true,
          });

        if (error) {
          results.push({ file, status: "error", message: error.message });
          console.error(`Failed to upload ${file}:`, error.message);
        } else {
          results.push({ file, status: "success" });
          console.log(`✓ Uploaded ${file}`);
        }
      } catch (err: any) {
        results.push({ file, status: "error", message: err.message });
        console.error(`Error uploading ${file}:`, err.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Migration complete. ${imageFiles.length} images processed.`,
      results,
    });
  } catch (error: any) {
    console.error("Migration error:", error);
    return NextResponse.json(
      { error: error.message || "Migration failed" },
      { status: 500 }
    );
  }
}
