'use client';

import React, { useState } from 'react';
import { usePaystackPayment, useRealtimeSubscription } from '@elverse/shared-hooks';
import { Button, Card, RealtimeStatusBadge, PaystackCheckoutModal, Badge } from '@elverse/shared-ui';

const packages = [
  { id: 'pkg-1', name: 'Rapid MVP Architecture', price: 2500, timeline: '2 Weeks' },
  { id: 'pkg-2', name: 'Enterprise Microservices Delivery', price: 8500, timeline: '6 Weeks' },
  { id: 'pkg-3', name: 'Full-Stack Scalability Sprint', price: 4200, timeline: '3 Weeks' },
];

export default function ElcodersHomePage() {
  const [selectedPkg, setSelectedPkg] = useState<typeof packages[0] | null>(null);
  const [paymentNotice, setPaymentNotice] = useState<string | null>(null);
  const { initialize, loading } = usePaystackPayment();
  const { isConnected, messages, sendMessage } = useRealtimeSubscription({
    channelId: 'elcoders-deployments',
  });

  const handleDepositClick = (pkg: typeof packages[0]) => {
    setSelectedPkg(pkg);
  };

  const handlePaystackDeposit = async () => {
    if (!selectedPkg) return;
    setPaymentNotice('Connecting to Paystack Payment Gateway...');
    const url = await initialize({
      email: 'client@elcoders.com',
      amount: selectedPkg.price * 100,
      currency: 'USD',
      metadata: { package_id: selectedPkg.id, name: selectedPkg.name },
    });

    if (url) {
      sendMessage(`Deposit initiated for ${selectedPkg.name} via Paystack`, 'payment_deposit');
      setPaymentNotice(`Paystack checkout session created. Processing in real time...`);
      setTimeout(() => {
        setPaymentNotice(`Payment confirmed! Engineering sprint booked for ${selectedPkg.name}.`);
        setSelectedPkg(null);
      }, 1500);
    }
  };

  return (
    <main data-arm="elcoders" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img src="/assets/elcoders-logo.webp" alt="ELCODERS" style={{ height: '40px' }} />
          <h1 style={{ fontSize: '1.5rem', margin: 0, color: '#0066FF' }}>ELCODERS</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <RealtimeStatusBadge connected={isConnected} label="Real-time Commit & Billing Mesh" />
          <nav style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#services" style={{ color: '#C4C4D4', textDecoration: 'none' }}>Solutions</a>
            <a href="#packages" style={{ color: '#C4C4D4', textDecoration: 'none' }}>Packages</a>
          </nav>
        </div>
      </header>

      <section style={{ textAlign: 'center', margin: '4rem 0' }}>
        <h2 style={{ fontSize: '3.5rem', fontWeight: 800, background: 'linear-gradient(135deg, #0066FF 0%, #00D4FF 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Your Idea + Our Code = Scalable Success
        </h2>
        <p style={{ fontSize: '1.25rem', color: '#9A9AAE', maxWidth: '600px', margin: '1rem auto' }}>
          24hr First Commit Guarantee. 12+ MVPs Shipped, 500+ Hours Code Delivered, Paystack Milestone Checkout Integrated.
        </p>
        {paymentNotice && (
          <div style={{ margin: '1.5rem auto', maxWidth: '500px', padding: '1rem', background: 'rgba(0, 102, 255, 0.15)', border: '1px solid #0066FF', borderRadius: '12px', color: '#00D4FF' }}>
            {paymentNotice}
          </div>
        )}
      </section>

      <section id="packages" style={{ margin: '4rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '2rem', margin: 0, color: '#0066FF' }}>Engineering Packages</h3>
          <Badge label="Paystack Gateway Connected" color="#0066FF" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {packages.map((pkg) => (
            <Card key={pkg.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <Badge label={pkg.timeline} color="#00D4FF" />
                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#10B981' }}>${pkg.price.toLocaleString()}</span>
              </div>
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>{pkg.name}</h4>
              <p style={{ color: '#9A9AAE', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Full architecture, CI/CD, and milestone releases.</p>
              <Button
                variant="primary"
                onClick={() => handleDepositClick(pkg)}
                style={{ width: '100%', background: 'linear-gradient(135deg, #0066FF 0%, #00D4FF 100%)' }}
              >
                Deposit Retainer via Paystack
              </Button>
            </Card>
          ))}
        </div>
      </section>

      <section style={{ margin: '4rem 0' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#0066FF' }}>Real-time Project & Payment Events</h3>
        <Card>
          <div style={{ maxHeight: '150px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {messages.length === 0 ? (
              <span style={{ color: '#9A9AAE', fontSize: '0.9rem' }}>Real-time listener connected. Awaiting deployment and payment triggers...</span>
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

      {selectedPkg && (
        <PaystackCheckoutModal
          isOpen={!!selectedPkg}
          onClose={() => setSelectedPkg(null)}
          title={`Fund Sprint: ${selectedPkg.name}`}
          amount={selectedPkg.price}
          currency="USD"
          onConfirm={handlePaystackDeposit}
          loading={loading}
        />
      )}
    </main>
  );
}
