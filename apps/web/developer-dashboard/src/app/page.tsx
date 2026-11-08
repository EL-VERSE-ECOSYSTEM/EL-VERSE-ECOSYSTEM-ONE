'use client';

import React, { useState } from 'react';
import { useRealtimeSubscription, usePaystackPayment } from '@elverse/shared-hooks';
import { Button, Card, RealtimeStatusBadge, Badge, PaystackCheckoutModal } from '@elverse/shared-ui';

export default function DeveloperDashboardPage() {
  const [payoutRequested, setPayoutRequested] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { initialize, loading } = usePaystackPayment();
  const { isConnected, messages, sendMessage } = useRealtimeSubscription({
    channelId: 'developer-payouts',
  });

  const handleRequestPayout = () => {
    setIsModalOpen(true);
  };

  const handleConfirmPayout = async () => {
    sendMessage(`Developer requested real-time payout disbursement of $2,450.00 via Paystack`, 'payout_request');
    setPayoutRequested(true);
    setIsModalOpen(false);
  };

  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#0066FF', margin: '0 0 0.5rem 0' }}>Developer Dashboard</h1>
          <p style={{ color: '#9A9AAE', margin: 0 }}>Project tracking, deliverable submissions, and real-time Paystack payouts</p>
        </div>
        <RealtimeStatusBadge connected={isConnected} label="Real-time Payout Bus" />
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
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10B981', margin: '0 0 0.5rem 0' }}>
            {payoutRequested ? '$0.00 (Disbursing)' : '$2,450.00'}
          </p>
          <Button
            variant="primary"
            onClick={handleRequestPayout}
            disabled={payoutRequested}
            style={{ fontSize: '0.85rem', padding: '6px 12px' }}
          >
            {payoutRequested ? 'Payout In Flight' : 'Withdraw via Paystack'}
          </Button>
        </div>
      </div>

      <section style={{ margin: '2rem 0' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#0066FF' }}>Real-time Delivery & Payout Stream</h3>
        <Card>
          <div style={{ maxHeight: '150px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {messages.length === 0 ? (
              <span style={{ color: '#9A9AAE', fontSize: '0.9rem' }}>Real-time developer telemetry connected...</span>
            ) : (
              messages.map((m, idx) => (
                <div key={idx} style={{ fontSize: '0.85rem', color: '#E2E8F0', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px' }}>
                  <span style={{ color: '#00D4FF', fontWeight: 600 }}>[{new Date(m.timestamp || Date.now()).toLocaleTimeString()}]</span> {m.content}
                </div>
              ))
            )}
          </div>
        </Card>
      </section>

      <PaystackCheckoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Paystack Automated Payout Withdrawal"
        amount={2450}
        currency="USD"
        onConfirm={handleConfirmPayout}
        loading={loading}
      />
    </main>
  );
}
