import React from 'react';
import DashboardClient from './ui/DashboardClient';
import GalleryManager from './ui/GalleryManager';
import ContentManager from './ui/ContentManager';
import TestimonialsManager from './ui/TestimonialsManager';
import FAQManager from './ui/FAQManager';
import ServiceDetailsManager from './ui/ServiceDetailsManager';
import OwnerGate from './ui/OwnerGate';

export const dynamic = 'force-dynamic';

export default function OwnerDashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Owner Dashboard</h1>
      <OwnerGate>
        <DashboardClient />
        <section>
          <h2 className="text-xl font-semibold">Site Content</h2>
          <p className="text-sm text-gray-600 mb-3">Edit homepage hero, announcement banner, and policies.</p>
          <ContentManager />
        </section>
        <section>
          <h2 className="text-xl font-semibold">Testimonials</h2>
          <p className="text-sm text-gray-600 mb-3">Manage client testimonials displayed on the homepage.</p>
          <TestimonialsManager />
        </section>
        <section>
          <h2 className="text-xl font-semibold">FAQs</h2>
          <p className="text-sm text-gray-600 mb-3">Manage frequently asked questions displayed on the homepage.</p>
          <FAQManager />
        </section>
        <section>
          <h2 className="text-xl font-semibold">Service Detail Pages</h2>
          <p className="text-sm text-gray-600 mb-3">Create detailed pages for individual services with pricing tiers, process steps, and FAQs.</p>
          <ServiceDetailsManager />
        </section>
        <section>
          <h2 className="text-xl font-semibold">Gallery Manager</h2>
          <p className="text-sm text-gray-600 mb-3">Upload and remove photos for the gallery page.</p>
          <GalleryManager />
        </section>
      </OwnerGate>
    </div>
  );
}
