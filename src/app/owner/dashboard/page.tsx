import React from 'react';
import OwnerGate from './ui/OwnerGate';
import DashboardTabs from './ui/DashboardTabs';

export const dynamic = 'force-dynamic';

export default function OwnerDashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <OwnerGate>
        <DashboardTabs />
      </OwnerGate>
    </div>
  );
}
