'use client';

import React from 'react';
import { useRealtimeSubscription } from '@elverse/shared-hooks';
import { Card, RealtimeStatusBadge, Badge } from '@elverse/shared-ui';

export default function BusinessDashboardPage() {
  const { isConnected, messages } = useRealtimeSubscription({
    channelId: 'business-analytics-feed',
  });

  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0', color: '#6366F1' }}>EL VERSE - Business Command Center</h1>
          <p style={{ color: '#9A9AAE', margin: 0 }}>Executive platform telemetry, Paystack payment volume, and cross-arm revenue</p>
        </div>
        <RealtimeStatusBadge connected={isConnected} label="Real-time Revenue Telemetry" />
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 style={{ fontSize: '0.875rem', color: '#9A9AAE', margin: '0 0 0.5rem 0' }}>Paystack Processed Volume</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10B981', margin: 0 }}>$482,900.00</p>
          <small style={{ color: '#00D4FF' }}>+18.4% this month</small>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 style={{ fontSize: '0.875rem', color: '#9A9AAE', margin: '0 0 0.5rem 0' }}>Active Subscribers (Nexel + Elites)</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>1,842</p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 style={{ fontSize: '0.875rem', color: '#9A9AAE', margin: '0 0 0.5rem 0' }}>Real-time Gateway Status</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#6366F1', margin: 0 }}>99.98%</p>
          <Badge label="Paystack Live" color="#10B981" />
        </div>
      </div>

      <section style={{ margin: '2rem 0' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#6366F1' }}>Real-time Paystack Transaction Stream</h3>
        <Card>
          <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {messages.length === 0 ? (
              <span style={{ color: '#9A9AAE', fontSize: '0.9rem' }}>Real-time payment and transaction ledger streaming...</span>
            ) : (
              messages.map((m, idx) => (
                <div key={idx} style={{ fontSize: '0.85rem', color: '#E2E8F0', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px' }}>
                  <span style={{ color: '#10B981', fontWeight: 600 }}>[{new Date(m.timestamp || Date.now()).toLocaleTimeString()}]</span> {m.content}
                </div>
              ))
            )}
          </div>
        </Card>
      </section>
    </main>
  );
}
