import React from 'react';
import DashboardClient from './ui/DashboardClient';
import OwnerGate from './ui/OwnerGate';

export const dynamic = 'force-dynamic';

export default function OwnerDashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Owner Dashboard</h1>
      <OwnerGate>
        <DashboardClient />
      </OwnerGate>
    </div>
  );
}
