import { useLitAuth, DashboardLib, AccountSelectionLib } from '@lit-protocol/auth-lib';
import React from 'react';

export default function Dashboard() {
  const { session, accounts } = useLitAuth();

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      {/* @ts-ignore - ignoring type error as instructed */}
      <DashboardLib session={session} />
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Your PKP Accounts</h2>
        {/* @ts-ignore - ignoring type error as instructed */}
        <AccountSelectionLib accounts={accounts} />
      </div>
    </div>
  );
}
