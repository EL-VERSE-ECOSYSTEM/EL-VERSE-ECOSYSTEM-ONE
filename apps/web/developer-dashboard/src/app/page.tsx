import React from 'react';

export default function DeveloperDashboardPage() {
  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', color: '#0066FF', margin: '0 0 0.5rem 0' }}>Developer Dashboard</h1>
        <p style={{ color: '#9A9AAE', margin: 0 }}>Project tracking, deliverable submissions, and time logs</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 style={{ fontSize: '0.875rem', color: '#9A9AAE', margin: '0 0 0.5rem 0' }}>Active Projects</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>4</p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 style={{ fontSize: '0.875rem', color: '#9A9AAE', margin: '0 0 0.5rem 0' }}>Hours Logged (Week)</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>38.5 hrs</p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 style={{ fontSize: '0.875rem', color: '#9A9AAE', margin: '0 0 0.5rem 0' }}>Pending Payouts</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10B981', margin: 0 }}>$2,450.00</p>
        </div>
      </div>
    </main>
  );
}
