# UI Component Library

A consistent, reusable component library for the Porscha's Salon dashboard.

## Components

### Button

Versatile button component with multiple variants and loading states.

**Props:**
- `variant`: `"primary" | "secondary" | "ghost" | "danger"` (default: `"primary"`)
- `size`: `"sm" | "md" | "lg"` (default: `"md"`)
- `loading`: Show loading spinner (default: `false`)
- `fullWidth`: Expand to full width (default: `false`)
- `leftIcon`, `rightIcon`: Optional icon elements

**Example:**
```tsx
import { Button } from "@/components/ui";

<Button variant="primary" size="md" loading={isSaving}>
  Save Changes
</Button>

<Button 
  variant="secondary" 
  leftIcon={<RefreshIcon />}
  onClick={handleRefresh}
>
  Refresh
</Button>
```

---

### Input

Labeled text input with error and hint text support.

**Props:**
- `label`: Optional label text
- `hint`: Helper text shown below input
- `error`: Error message (overrides hint when present)

**Example:**
```tsx
import { Input } from "@/components/ui";

<Input 
  label="Email Address"
  hint="We'll never share your email"
  error={errors.email}
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

---

### Card

Container component with optional header.

**Props:**
- `title`: Optional header title
- `actions`: Optional action elements for header
- `children`: Card content

**Example:**
```tsx
import { Card } from "@/components/ui";

<Card 
  title="Recent Activity"
  actions={<Button size="sm">View All</Button>}
>
  <p>Content goes here...</p>
</Card>
```

---

### Skeleton

Loading placeholder component.

**Props:**
- `className`: Tailwind classes for size/shape customization

**Example:**
```tsx
import { Skeleton, SkeletonGrid } from "@/components/ui";

// Single skeleton
<Skeleton className="h-48 w-full" />

// Grid of skeletons
<SkeletonGrid count={6} />
```

---

### EmptyState

Centered empty state with illustration, message, and CTA.

**Props:**
- `title`: Main heading (required)
- `description`: Optional description text
- `icon`: Optional icon/illustration element
- `actionLabel`: Primary action button text
- `onAction`: Primary action handler
- `secondaryAction`: Optional secondary content

**Example:**
```tsx
import { EmptyState } from "@/components/ui";

<EmptyState
  title="No images yet"
  description="Upload your first image to get started."
  icon={<ImageIcon />}
  actionLabel="Upload Image"
  onAction={handleUpload}
  secondaryAction={
    <Button variant="ghost">Import from Library</Button>
  }
/>
```

---

## Design Tokens

### Colors
- **Primary Gradient**: `from-purple-600 to-indigo-600`
- **Danger**: `bg-red-600`
- **Secondary**: `bg-white border-gray-300`

### Borders
- **Radius**: `rounded-xl` (12px) for cards/inputs, `rounded-2xl` (16px) for larger containers

### Spacing
- **Button padding**: `px-3 py-1.5` (sm), `px-4 py-2` (md), `px-5 py-2.5` (lg)
- **Card padding**: `p-4` (standard)

### Shadows
- **Default**: `shadow-sm`
- **Hover**: `shadow-md`

---

## Usage Patterns

### Loading States

Always show skeleton loaders during initial data fetch:

```tsx
{loading ? (
  <SkeletonGrid count={8} />
) : (
  <div className="grid grid-cols-4 gap-4">
    {items.map(item => <ItemCard key={item.id} {...item} />)}
  </div>
)}
```

### Empty States

Show empty states when no data exists:

```tsx
{items.length === 0 ? (
  <EmptyState
    title="No items found"
    description="Start by adding your first item."
    actionLabel="Add Item"
    onAction={handleAdd}
  />
) : (
  <ItemList items={items} />
)}
```

### Button Loading States

Use the `loading` prop instead of manual conditionals:

```tsx
// ✅ Good
<Button loading={isSaving} onClick={handleSave}>
  Save
</Button>

// ❌ Avoid
<Button disabled={isSaving}>
  {isSaving ? "Saving..." : "Save"}
</Button>
```

---

## Best Practices

1. **Consistency**: Use these components instead of custom buttons/inputs for visual consistency
2. **Accessibility**: Components include proper ARIA attributes and focus states
3. **Responsive**: All components are mobile-friendly by default
4. **Composition**: Combine components (e.g., `Button` inside `EmptyState`) for complex UIs
5. **Customization**: Use `className` prop to extend styles when needed, but preserve core design tokens
