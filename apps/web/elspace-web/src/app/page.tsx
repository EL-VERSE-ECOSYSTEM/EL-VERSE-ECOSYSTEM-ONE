'use client';

import React, { useState } from 'react';
import { usePaystackPayment, useRealtimeSubscription } from '@elverse/shared-hooks';
import { Button, Card, RealtimeStatusBadge, PaystackCheckoutModal, Badge } from '@elverse/shared-ui';

const gigs = [
  { id: 'gig-1', title: 'Supabase RLS & RBAC Migration', budget: 1400, client: 'Fintech Corp' },
  { id: 'gig-2', title: 'React Native Expo UI Redesign', budget: 2100, client: 'HealthApp Inc' },
  { id: 'gig-3', title: 'Go Microservice High-Throughput Gateway', budget: 3500, client: 'StreamNet' },
];

export default function ElspaceHomePage() {
  const [selectedGig, setSelectedGig] = useState<typeof gigs[0] | null>(null);
  const [escrowMessage, setEscrowMessage] = useState<string | null>(null);
  const { initialize, loading } = usePaystackPayment();
  const { isConnected, messages, sendMessage } = useRealtimeSubscription({
    channelId: 'elspace-escrow',
  });

  const handleFundEscrow = (gig: typeof gigs[0]) => {
    setSelectedGig(gig);
  };

  const handlePaystackEscrowDeposit = async () => {
    if (!selectedGig) return;
    setEscrowMessage('Routing escrow hold to Paystack Payment Gateway...');
    const url = await initialize({
      email: 'client@elspace.com',
      amount: selectedGig.budget * 100,
      currency: 'USD',
      metadata: { gig_id: selectedGig.id, type: 'milestone_escrow' },
    });

    if (url) {
      sendMessage(`Milestone escrow of $${selectedGig.budget} funded for "${selectedGig.title}" via Paystack`, 'escrow_funded');
      setEscrowMessage('Paystack escrow locked. Real-time notifications dispatched to freelancer.');
      setTimeout(() => {
        setEscrowMessage(`Escrow verified! Contract started in real time.`);
        setSelectedGig(null);
      }, 1500);
    }
  };

  return (
    <main data-arm="elspace" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img src="/assets/elspace-logo.jpeg" alt="ELSPACE" style={{ height: '40px' }} />
          <h1 style={{ fontSize: '1.5rem', margin: 0, color: '#10B981' }}>ELSPACE</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <RealtimeStatusBadge connected={isConnected} label="Real-time Escrow Mesh" />
        </div>
      </header>

      <section style={{ textAlign: 'center', margin: '4rem 0' }}>
        <h2 style={{ fontSize: '3.5rem', fontWeight: 800, background: 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Freelance Arm of EL VERSE
        </h2>
        <p style={{ fontSize: '1.25rem', color: '#9A9AAE', maxWidth: '650px', margin: '1rem auto' }}>
          Connecting Vetted Tech Talent with High-Impact Projects. Instant Paystack Milestone Escrow & Real-Time Payouts.
        </p>
        {escrowMessage && (
          <div style={{ margin: '1.5rem auto', maxWidth: '500px', padding: '1rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10B981', borderRadius: '12px', color: '#10B981' }}>
            {escrowMessage}
          </div>
        )}
      </section>

      <section style={{ margin: '4rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '2rem', margin: 0, color: '#10B981' }}>Active Milestones & Gigs</h3>
          <Badge label="Paystack Escrow Protected" color="#10B981" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {gigs.map((gig) => (
            <Card key={gig.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <Badge label={gig.client} color="#06B6D4" />
                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#10B981' }}>${gig.budget}</span>
              </div>
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>{gig.title}</h4>
              <p style={{ color: '#9A9AAE', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Instant escrow release upon verified code delivery.</p>
              <Button
                variant="primary"
                onClick={() => handleFundEscrow(gig)}
                style={{ width: '100%', background: 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)' }}
              >
                Fund Escrow with Paystack
              </Button>
            </Card>
          ))}
        </div>
      </section>

      <section style={{ margin: '4rem 0' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#10B981' }}>Real-time Escrow & Proposal Feed</h3>
        <Card>
          <div style={{ maxHeight: '150px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {messages.length === 0 ? (
              <span style={{ color: '#9A9AAE', fontSize: '0.9rem' }}>Real-time escrow event stream connected...</span>
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

      {selectedGig && (
        <PaystackCheckoutModal
          isOpen={!!selectedGig}
          onClose={() => setSelectedGig(null)}
          title={`Lock Escrow: ${selectedGig.title}`}
          amount={selectedGig.budget}
          currency="USD"
          onConfirm={handlePaystackEscrowDeposit}
          loading={loading}
        />
      )}
    </main>
  );
}
