import React from 'react';

export default function AdminDashboardPage() {
  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', color: '#6366F1', margin: '0 0 0.5rem 0' }}>Admin Panel</h1>
        <p style={{ color: '#9A9AAE', margin: 0 }}>Operational control center for user management, content moderation, and audit logging</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 style={{ fontSize: '0.875rem', color: '#9A9AAE', margin: '0 0 0.5rem 0' }}>Active Users (24h)</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>1,248</p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 style={{ fontSize: '0.875rem', color: '#9A9AAE', margin: '0 0 0.5rem 0' }}>Pending Moderation Queue</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#F59E0B', margin: 0 }}>14 items</p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 style={{ fontSize: '0.875rem', color: '#9A9AAE', margin: '0 0 0.5rem 0' }}>System Health Score</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10B981', margin: 0 }}>99.8%</p>
        </div>
      </div>
    </main>
  );
}
