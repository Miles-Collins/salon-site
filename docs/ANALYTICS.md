# Performance Monitoring & Analytics Setup

This project includes comprehensive analytics and performance monitoring to track user behavior, conversions, and site performance.

## Features

### 📊 Analytics Tracking
- **Google Analytics 4**: Page views, events, and user flows
- **Facebook Pixel**: Conversion tracking and retargeting
- **Custom Events**: Booking clicks, form submissions, social interactions

### ⚡ Performance Monitoring
- **Core Web Vitals**: LCP, FID, CLS, FCP, TTFB, INP
- Real-time performance metrics sent to Google Analytics
- Development mode logging for debugging

### 🎯 Tracked Events

#### User Interactions
- `booking_click`: When users click booking buttons (source tracked)
- `service_view`: When users view individual service pages
- `gallery_view`: When users view gallery images
- `social_click`: Social media link clicks (platform tracked)
- `outbound_click`: External link clicks

#### Conversions
- `form_submit_success`: Successful form submissions
- `form_submit_error`: Failed form submissions
- Newsletter subscriptions

## Setup Instructions

### 1. Google Analytics 4

1. Create a GA4 property at [analytics.google.com](https://analytics.google.com/)
2. Get your Measurement ID (format: `G-XXXXXXXXXX`)
3. Add to `.env.local`:
   ```
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

### 2. Facebook Pixel

1. Create a Pixel at [business.facebook.com](https://business.facebook.com/)
2. Get your Pixel ID
3. Add to `.env.local`:
   ```
   NEXT_PUBLIC_FB_PIXEL_ID=XXXXXXXXXX
   ```

### 3. Install Dependencies

```bash
npm install
```

The `web-vitals` package is already included in `package.json`.

## Usage Examples

### Track Custom Events

```typescript
import { trackEvent } from '@/lib/analytics';

// Track a custom event
trackEvent({
  action: 'button_click',
  category: 'engagement',
  label: 'hero_cta',
  value: 1
});
```

### Track Booking Actions

```typescript
import { trackBookingClick } from '@/lib/analytics';

trackBookingClick('hero_button');
```

### Track Form Submissions

```typescript
import { trackFormSubmission } from '@/lib/analytics';

trackFormSubmission('contact_form', true); // success
trackFormSubmission('contact_form', false); // error
```

## Components

### GoogleAnalytics
Loads Google Analytics 4 script and initializes tracking.

### FacebookPixel
Loads Facebook Pixel script and initializes tracking.

### Analytics
Client-side component that tracks page views on route changes.

### WebVitals
Monitors Core Web Vitals and reports to Google Analytics.

## Data Privacy

- Analytics scripts load with `strategy="afterInteractive"` for optimal performance
- No personally identifiable information (PII) is tracked
- Compliant with GDPR when used with proper cookie consent
- Development mode includes console logging for debugging

## Viewing Analytics

### Google Analytics Dashboard
1. Visit [analytics.google.com](https://analytics.google.com/)
2. Navigate to your property
3. View real-time data, events, conversions, and Web Vitals

### Facebook Events Manager
1. Visit [business.facebook.com/events_manager](https://business.facebook.com/events_manager)
2. Select your Pixel
3. View events, conversions, and audience data

## Performance Metrics

Core Web Vitals tracked:
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1
- **FCP** (First Contentful Paint): < 1.8s
- **TTFB** (Time to First Byte): < 600ms
- **INP** (Interaction to Next Paint): < 200ms

## Development Mode

Analytics events are logged to the console in development:
```
📊 Analytics Event: { action: 'booking_click', category: 'engagement', ... }
📄 Page View: /services
⚡ Web Vital: { name: 'LCP', value: 1234, ... }
```

## Troubleshooting

### Events Not Showing in GA4
- Verify `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set correctly
- Check browser console for errors
- Use GA4 DebugView for real-time event testing

### Facebook Pixel Not Firing
- Verify `NEXT_PUBLIC_FB_PIXEL_ID` is set correctly
- Install Facebook Pixel Helper Chrome extension
- Check browser console for errors

### Web Vitals Not Reporting
- Ensure `web-vitals` package is installed
- Check that WebVitals component is rendered
- View metrics in GA4 under Events > Web Vitals
