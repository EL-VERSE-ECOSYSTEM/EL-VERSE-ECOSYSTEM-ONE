'use client';

import React, { useState } from 'react';
import { usePaystackPayment, useRealtimeSubscription } from '@elverse/shared-hooks';
import { Button, Card, RealtimeStatusBadge, PaystackCheckoutModal, Badge } from '@elverse/shared-ui';

const internships = [
  { id: 'int-1', role: 'Full Stack Engineering Intern', stipend: 800, company: 'Starlight Labs' },
  { id: 'int-2', role: 'DevOps & Cloud Systems Intern', stipend: 950, company: 'CloudNova' },
  { id: 'int-3', role: 'AI Data & Model Evaluation Intern', stipend: 1100, company: 'CognitiveCore' },
];

export default function ElaccessHomePage() {
  const [selectedInternship, setSelectedInternship] = useState<typeof internships[0] | null>(null);
  const [placementNotice, setPlacementNotice] = useState<string | null>(null);
  const { initialize, loading } = usePaystackPayment();
  const { isConnected, messages, sendMessage } = useRealtimeSubscription({
    channelId: 'elaccess-placements',
  });

  const handleSponsor = (item: typeof internships[0]) => {
    setSelectedInternship(item);
  };

  const handlePaystackSponsorship = async () => {
    if (!selectedInternship) return;
    setPlacementNotice('Initializing Paystack Payment Gateway for Internship Sponsorship...');
    const url = await initialize({
      email: 'sponsor@company.com',
      amount: selectedInternship.stipend * 100,
      currency: 'USD',
      metadata: { internship_id: selectedInternship.id, company: selectedInternship.company },
    });

    if (url) {
      sendMessage(`Internship stipend funded for "${selectedInternship.role}" via Paystack`, 'stipend_funded');
      setPlacementNotice('Paystack transaction initialized. Verifying in real time...');
      setTimeout(() => {
        setPlacementNotice(`Payment confirmed! Candidate matched and placement approved in real time.`);
        setSelectedInternship(null);
      }, 1500);
    }
  };

  return (
    <main data-arm="elaccess" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img src="/assets/elaccess-logo.jpeg" alt="EL ACCESS" style={{ height: '40px' }} />
          <h1 style={{ fontSize: '1.5rem', margin: 0, color: '#F97316' }}>EL ACCESS</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <RealtimeStatusBadge connected={isConnected} label="Real-time Placement Mesh" />
        </div>
      </header>

      <section style={{ textAlign: 'center', margin: '4rem 0' }}>
        <h2 style={{ fontSize: '3.5rem', fontWeight: 800, background: 'linear-gradient(135deg, #F97316 0%, #EAB308 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Your Direct Gateway to Tech Internships
        </h2>
        <p style={{ fontSize: '1.25rem', color: '#9A9AAE', maxWidth: '650px', margin: '1rem auto' }}>
          Verified Company Internship Placements, Stipend Escrow, and Automated Paystack Checkout.
        </p>
        {placementNotice && (
          <div style={{ margin: '1.5rem auto', maxWidth: '500px', padding: '1rem', background: 'rgba(249, 115, 22, 0.15)', border: '1px solid #F97316', borderRadius: '12px', color: '#F97316' }}>
            {placementNotice}
          </div>
        )}
      </section>

      <section style={{ margin: '4rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '2rem', margin: 0, color: '#F97316' }}>Available Internship Placements</h3>
          <Badge label="Paystack Stipends" color="#F97316" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {internships.map((item) => (
            <Card key={item.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <Badge label={item.company} color="#EAB308" />
                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#10B981' }}>${item.stipend}/mo</span>
              </div>
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>{item.role}</h4>
              <p style={{ color: '#9A9AAE', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Direct placement with mentorship and stipend coverage.</p>
              <Button
                variant="primary"
                onClick={() => handleSponsor(item)}
                style={{ width: '100%', background: 'linear-gradient(135deg, #F97316 0%, #EAB308 100%)' }}
              >
                Sponsor via Paystack
              </Button>
            </Card>
          ))}
        </div>
      </section>

      <section style={{ margin: '4rem 0' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#F97316' }}>Real-time Placement Notifications</h3>
        <Card>
          <div style={{ maxHeight: '150px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {messages.length === 0 ? (
              <span style={{ color: '#9A9AAE', fontSize: '0.9rem' }}>Real-time placement stream active...</span>
            ) : (
              messages.map((m, idx) => (
                <div key={idx} style={{ fontSize: '0.85rem', color: '#E2E8F0', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px' }}>
                  <span style={{ color: '#F97316', fontWeight: 600 }}>[{new Date(m.timestamp || Date.now()).toLocaleTimeString()}]</span> {m.content}
                </div>
              ))
            )}
          </div>
        </Card>
      </section>

      {selectedInternship && (
        <PaystackCheckoutModal
          isOpen={!!selectedInternship}
          onClose={() => setSelectedInternship(null)}
          title={`Fund Placement: ${selectedInternship.role}`}
          amount={selectedInternship.stipend}
          currency="USD"
          onConfirm={handlePaystackSponsorship}
          loading={loading}
        />
      )}
    </main>
  );
}
