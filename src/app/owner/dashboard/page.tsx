import React from 'react';
import DashboardClient from './ui/DashboardClient';
import GalleryManager from './ui/GalleryManager';
import OwnerGate from './ui/OwnerGate';

export const dynamic = 'force-dynamic';

export default function OwnerDashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Owner Dashboard</h1>
      <OwnerGate>
        <DashboardClient />
        <section>
          <h2 className="text-xl font-semibold">Gallery Manager</h2>
          <p className="text-sm text-gray-600 mb-3">Upload and remove photos for the gallery page.</p>
          <GalleryManager />
        </section>
      </OwnerGate>
    </div>
  );
}
