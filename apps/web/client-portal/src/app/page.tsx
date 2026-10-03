import React from 'react';

export default function ClientPortalPage() {
  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', color: '#00D4FF', margin: '0 0 0.5rem 0' }}>Client Portal</h1>
        <p style={{ color: '#9A9AAE', margin: 0 }}>Track project progress, approve deliverables, and review invoices</p>
      </header>

      <section style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Active Project Milestone Timeline</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
            <span>Milestone 1: Backend Architecture & Auth</span>
            <span style={{ color: '#10B981', fontWeight: 600 }}>Approved</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
            <span>Milestone 2: Payment Service & Webhooks</span>
            <span style={{ color: '#F59E0B', fontWeight: 600 }}>Under Review</span>
          </div>
        </div>
      </section>
    </main>
  );
}
