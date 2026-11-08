'use client';

import React, { useState } from 'react';
import { useRealtimeSubscription, usePaystackPayment } from '@elverse/shared-hooks';
import { Card, RealtimeStatusBadge, Button, PaystackCheckoutModal, Badge } from '@elverse/shared-ui';

const plans = [
  { id: 'onboard-starter', name: 'Ecosystem Starter', fee: 29, description: 'Access to EL ACCESS & NEXEL' },
  { id: 'onboard-pro', name: 'Professional Suite', fee: 99, description: 'All 5 arms + ELITES Mentorship' },
  { id: 'onboard-enterprise', name: 'Enterprise Cloud', fee: 299, description: 'Full access + ELCODERS dedicated dev pod' },
];

export default function OnboardingPage() {
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const { initialize, loading } = usePaystackPayment();
  const { isConnected, messages, sendMessage } = useRealtimeSubscription({
    channelId: 'onboarding-activation',
  });

  const handleSelectPlan = (plan: typeof plans[0]) => {
    setSelectedPlan(plan);
  };

  const handleConfirmPaystack = async () => {
    if (!selectedPlan) return;
    setNotice(`Initializing Paystack membership activation for ${selectedPlan.name}...`);
    const url = await initialize({
      email: 'newuser@elverse.com',
      amount: selectedPlan.fee * 100,
      currency: 'USD',
      metadata: { plan_id: selectedPlan.id, plan_name: selectedPlan.name },
    });

    if (url) {
      sendMessage(`New member activated tier: ${selectedPlan.name} via Paystack`, 'onboarding_complete');
      setNotice('Paystack session initialized. Activating profile in real time...');
      setTimeout(() => {
        setNotice(`Account provisioned successfully! Welcome to EL VERSE.`);
        setSelectedPlan(null);
      }, 1500);
    }
  };

  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#6366F1', margin: '0 0 0.5rem 0' }}>EL VERSE - Ecosystem Onboarding</h1>
          <p style={{ color: '#9A9AAE', margin: 0 }}>Select your operational tier with Paystack Instant Checkout & real-time role routing</p>
        </div>
        <RealtimeStatusBadge connected={isConnected} label="Real-time Activation Mesh" />
      </header>

      {notice && (
        <div style={{ margin: '1rem 0', padding: '1rem', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid #6366F1', borderRadius: '12px', color: '#A5B4FC' }}>
          {notice}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {plans.map((plan) => (
          <Card key={plan.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <Badge label="One-Time / Monthly" color="#6366F1" />
              <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10B981' }}>${plan.fee}</span>
            </div>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>{plan.name}</h3>
            <p style={{ fontSize: '0.9rem', color: '#9A9AAE', marginBottom: '1.5rem' }}>{plan.description}</p>
            <Button variant="primary" onClick={() => handleSelectPlan(plan)} style={{ width: '100%' }}>
              Activate with Paystack
            </Button>
          </Card>
        ))}
      </div>

      <section style={{ margin: '2rem 0' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#6366F1' }}>Real-time Activation Telemetry</h3>
        <Card>
          <div style={{ maxHeight: '150px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {messages.length === 0 ? (
              <span style={{ color: '#9A9AAE', fontSize: '0.9rem' }}>Real-time onboarding activation monitor connected...</span>
            ) : (
              messages.map((m, idx) => (
                <div key={idx} style={{ fontSize: '0.85rem', color: '#E2E8F0', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px' }}>
                  <span style={{ color: '#6366F1', fontWeight: 600 }}>[{new Date(m.timestamp || Date.now()).toLocaleTimeString()}]</span> {m.content}
                </div>
              ))
            )}
          </div>
        </Card>
      </section>

      {selectedPlan && (
        <PaystackCheckoutModal
          isOpen={!!selectedPlan}
          onClose={() => setSelectedPlan(null)}
          title={`Activate Plan: ${selectedPlan.name}`}
          amount={selectedPlan.fee}
          currency="USD"
          onConfirm={handleConfirmPaystack}
          loading={loading}
        />
      )}
    </main>
  );
}
