/**
 * Analytics utilities for tracking user interactions and performance metrics
 */

export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

/**
 * Track custom events (Google Analytics, Facebook Pixel, etc.)
 */
export function trackEvent({ action, category, label, value }: AnalyticsEvent) {
  // Google Analytics 4
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }

  // Facebook Pixel
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('trackCustom', action, {
      category,
      label,
      value,
    });
  }

  // Console logging in development
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Analytics Event:', { action, category, label, value });
  }
}

/**
 * Track page views
 */
export function trackPageView(url: string) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }

  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', 'PageView');
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('📄 Page View:', url);
  }
}

/**
 * Track booking interactions
 */
export function trackBookingClick(source: string) {
  trackEvent({
    action: 'booking_click',
    category: 'engagement',
    label: source,
  });
}

/**
 * Track service views
 */
export function trackServiceView(serviceName: string) {
  trackEvent({
    action: 'service_view',
    category: 'engagement',
    label: serviceName,
  });
}

/**
 * Track gallery image views
 */
export function trackGalleryView(imageId: string) {
  trackEvent({
    action: 'gallery_view',
    category: 'engagement',
    label: imageId,
  });
}

/**
 * Track form submissions
 */
export function trackFormSubmission(formName: string, success: boolean) {
  trackEvent({
    action: success ? 'form_submit_success' : 'form_submit_error',
    category: 'conversion',
    label: formName,
  });
}

/**
 * Track outbound links
 */
export function trackOutboundLink(url: string, label?: string) {
  trackEvent({
    action: 'outbound_click',
    category: 'engagement',
    label: label || url,
  });
}

/**
 * Track social media clicks
 */
export function trackSocialClick(platform: string) {
  trackEvent({
    action: 'social_click',
    category: 'engagement',
    label: platform,
  });
}

/**
 * Performance monitoring - Core Web Vitals
 */
export function reportWebVitals(metric: any) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', metric.name, {
      event_category: 'Web Vitals',
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_label: metric.id,
      non_interaction: true,
    });
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('⚡ Web Vital:', metric);
  }
}
