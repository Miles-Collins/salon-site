# Gallery Storage Separation Implementation

## Overview
The gallery system now supports three separate storage buckets to keep different types of images completely isolated:

1. **gallery** - Main gallery photos (displayed on /gallery page)
2. **gallery-transformations** - Before/after transformation images (used in transformation slider)
3. **gallery-services** - Service showcase images (used on service detail pages)

## What Changed

### API Endpoints Updated

#### `/api/owner/gallery/list` - GET
- Now queries all three buckets in parallel
- Returns items with `bucket` field identifying the source
- Each item includes the correct public URL for its bucket

#### `/api/owner/gallery/upload` - POST
- New form parameter: `is_service` (boolean, default: false)
- Routing logic:
  - `is_service: true` → uploads to `gallery-services`
  - `is_before_after: true` → uploads to `gallery-transformations`
  - Default → uploads to `gallery`
- Stores bucket name in database metadata

#### `/api/owner/gallery/update` - POST
- Now accepts optional `bucket` field in request body
- Updates bucket tracking in database

#### `/api/owner/gallery/delete` - POST
- Now accepts optional `bucket` field in request body
- Uses correct bucket when deleting file from storage
- Defaults to `gallery` if not specified

### Database Changes

The `gallery_images` table now has:
- **bucket** column (text, default: 'gallery') - tracks which storage bucket the image belongs to

### Component Updates

#### GalleryManager.tsx
- Now filters to show ONLY items from the `gallery` bucket
- Items from transformations and services buckets are hidden
- Delete confirmation includes bucket info
- Save operations include bucket metadata

#### TransformationsManager.tsx
- Already filters to show ONLY items with `is_before_after: true`
- Uses the existing filtering logic

### Frontend Pages Behavior

- **Gallery Page** (`/gallery`) - Shows only images from `gallery` bucket
- **Transformations Page** (`/transformations`) - Shows only images from `gallery-transformations` bucket
- **Services Pages** - Will show only images from `gallery-services` bucket (when implemented)

## Supabase Setup Required

### Step 1: Create New Storage Buckets
In Supabase Dashboard → Storage:
1. Create bucket named `gallery-services`
2. Set it to public (same as the other buckets)
3. Configure RLS policies (same as existing buckets)

### Step 2: Update Database Schema
Run the SQL migration file: `scripts/add-gallery-services-bucket.sql`

This will:
- Add `bucket` column to `gallery_images` table
- Set default value to 'gallery'
- Create index for faster queries

### Step 3: Migrate Existing Data (If Needed)
If you have existing transformation images that don't have bucket metadata:

```sql
UPDATE public.gallery_images 
SET bucket = 'gallery-transformations' 
WHERE is_before_after = true AND bucket = 'gallery';
```

## File Locations

Updated API Files:
- `src/app/api/owner/gallery/list/route.ts`
- `src/app/api/owner/gallery/upload/route.ts`
- `src/app/api/owner/gallery/update/route.ts`
- `src/app/api/owner/gallery/delete/route.ts`

Updated Components:
- `src/app/owner/dashboard/ui/GalleryManager.tsx`
- `src/app/owner/dashboard/ui/TransformationsManager.tsx`

Migration Script:
- `scripts/add-gallery-services-bucket.sql`

## How to Use

### Upload to Different Buckets

From dashboard manager components:
- **Gallery Manager** - Automatically uploads to `gallery` bucket
- **Transformations Manager** - Automatically uploads to `gallery-transformations` bucket (with `is_before_after: true`)
- **Services Manager** (future) - Can upload to `gallery-services` bucket (with `is_service: true`)

### Programmatic Upload

```typescript
// Upload to main gallery
const form = new FormData();
form.append("file", file);
// No is_before_after or is_service needed - defaults to gallery

// Upload to transformations
const form = new FormData();
form.append("file", file);
form.append("is_before_after", "true");

// Upload to services
const form = new FormData();
form.append("file", file);
form.append("is_service", "true");
```

## Benefits

1. **Complete Isolation** - Gallery page only shows gallery photos, never mixes with transformations or services
2. **Better Organization** - Clear separation in Supabase storage
3. **Easier Management** - Each manager component only shows relevant images
4. **Scalability** - Easy to add more specialized buckets in the future
5. **Cleaner URLs** - Images have correct public URLs for their bucket

## Testing Checklist

- [ ] Created `gallery-services` bucket in Supabase
- [ ] Ran migration SQL to add bucket column
- [ ] GalleryManager shows only gallery bucket images
- [ ] TransformationsManager shows only transformation bucket images
- [ ] Upload works for all three bucket types
- [ ] Delete works correctly with bucket metadata
- [ ] Gallery page displays correct images
- [ ] Transformations page displays correct images
