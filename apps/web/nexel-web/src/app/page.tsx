'use client';

import React, { useState } from 'react';
import { usePaystackPayment, useRealtimeSubscription } from '@elverse/shared-hooks';
import { Button, Card, RealtimeStatusBadge, PaystackCheckoutModal, Badge } from '@elverse/shared-ui';

const tiers = [
  { id: 'tier-supporter', name: 'Community Supporter', price: 15, perks: 'Access to private builder lounges' },
  { id: 'tier-creator', name: 'Creator Pro Tier', price: 49, perks: 'Direct monetization tools & custom feeds' },
  { id: 'tier-founder', name: 'Founder Circle', price: 99, perks: 'Ecosystem governance & VIP events' },
];

export default function NexelHomePage() {
  const [selectedTier, setSelectedTier] = useState<typeof tiers[0] | null>(null);
  const [subStatus, setSubStatus] = useState<string | null>(null);
  const { initialize, loading } = usePaystackPayment();
  const { isConnected, messages, sendMessage } = useRealtimeSubscription({
    channelId: 'nexel-community',
  });

  const handleSubscribe = (tier: typeof tiers[0]) => {
    setSelectedTier(tier);
  };

  const handlePaystackSubscription = async () => {
    if (!selectedTier) return;
    setSubStatus('Connecting to Paystack Subscription Checkout...');
    const url = await initialize({
      email: 'creator@nexel.com',
      amount: selectedTier.price * 100,
      currency: 'USD',
      metadata: { tier_id: selectedTier.id, plan_name: selectedTier.name },
    });

    if (url) {
      sendMessage(`New member subscribed to ${selectedTier.name} via Paystack!`, 'subscription_active');
      setSubStatus('Paystack checkout initialized. Activating membership in real time...');
      setTimeout(() => {
        setSubStatus(`Membership active! Welcome to ${selectedTier.name}.`);
        setSelectedTier(null);
      }, 1500);
    }
  };

  return (
    <main data-arm="nexel" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img src="/assets/nexel-logo.jpeg" alt="NEXEL" style={{ height: '40px' }} />
          <h1 style={{ fontSize: '1.5rem', margin: 0, color: '#EC4899' }}>NEXEL</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <RealtimeStatusBadge connected={isConnected} label="Real-time Social Event Mesh" />
        </div>
      </header>

      <section style={{ textAlign: 'center', margin: '4rem 0' }}>
        <h2 style={{ fontSize: '3.5rem', fontWeight: 800, background: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          The Tech Social Community
        </h2>
        <p style={{ fontSize: '1.25rem', color: '#9A9AAE', maxWidth: '650px', margin: '1rem auto' }}>
          Real-Time WebSocket Feeds, Creator Memberships, and Paystack Micro-Tip Gateway.
        </p>
        {subStatus && (
          <div style={{ margin: '1.5rem auto', maxWidth: '500px', padding: '1rem', background: 'rgba(236, 72, 153, 0.15)', border: '1px solid #EC4899', borderRadius: '12px', color: '#EC4899' }}>
            {subStatus}
          </div>
        )}
      </section>

      <section style={{ margin: '4rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '2rem', margin: 0, color: '#EC4899' }}>Creator Memberships & Tip Tiers</h3>
          <Badge label="Paystack Subscriptions" color="#EC4899" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {tiers.map((tier) => (
            <Card key={tier.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <Badge label="Monthly" color="#8B5CF6" />
                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#10B981' }}>${tier.price}/mo</span>
              </div>
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>{tier.name}</h4>
              <p style={{ color: '#9A9AAE', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{tier.perks}</p>
              <Button
                variant="primary"
                onClick={() => handleSubscribe(tier)}
                style={{ width: '100%', background: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)' }}
              >
                Join with Paystack
              </Button>
            </Card>
          ))}
        </div>
      </section>

      <section style={{ margin: '4rem 0' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#EC4899' }}>Live Real-Time Social & Tipping Stream</h3>
        <Card>
          <div style={{ maxHeight: '150px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {messages.length === 0 ? (
              <span style={{ color: '#9A9AAE', fontSize: '0.9rem' }}>Real-time social chat & creator tip stream online...</span>
            ) : (
              messages.map((m, idx) => (
                <div key={idx} style={{ fontSize: '0.85rem', color: '#E2E8F0', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px' }}>
                  <span style={{ color: '#EC4899', fontWeight: 600 }}>[{new Date(m.timestamp || Date.now()).toLocaleTimeString()}]</span> {m.content}
                </div>
              ))
            )}
          </div>
        </Card>
      </section>

      {selectedTier && (
        <PaystackCheckoutModal
          isOpen={!!selectedTier}
          onClose={() => setSelectedTier(null)}
          title={`Subscribe: ${selectedTier.name}`}
          amount={selectedTier.price}
          currency="USD"
          onConfirm={handlePaystackSubscription}
          loading={loading}
        />
      )}
    </main>
  );
}
