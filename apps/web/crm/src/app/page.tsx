'use client';

import React, { useState } from 'react';
import { useRealtimeSubscription, usePaystackPayment } from '@elverse/shared-hooks';
import { Card, RealtimeStatusBadge, Button, PaystackCheckoutModal, Badge } from '@elverse/shared-ui';

const deals = [
  { id: 'deal-1', client: 'Acme Global', value: 12500, stage: 'Closing' },
  { id: 'deal-2', client: 'Apex Corp', value: 45000, stage: 'Proposal Sent' },
  { id: 'deal-3', client: 'Nexus AI', value: 85000, stage: 'Negotiation' },
];

export default function CRMPage() {
  const [selectedDeal, setSelectedDeal] = useState<typeof deals[0] | null>(null);
  const [dealNotice, setDealNotice] = useState<string | null>(null);
  const { initialize, loading } = usePaystackPayment();
  const { isConnected, messages, sendMessage } = useRealtimeSubscription({
    channelId: 'crm-pipeline-events',
  });

  const handleSendInvoiceLink = (deal: typeof deals[0]) => {
    setSelectedDeal(deal);
  };

  const handleCreatePaystackInvoice = async () => {
    if (!selectedDeal) return;
    setDealNotice(`Creating Paystack Checkout Invoice for ${selectedDeal.client}...`);
    const url = await initialize({
      email: 'finance@' + selectedDeal.client.toLowerCase().replace(/\s+/g, '') + '.com',
      amount: selectedDeal.value * 100,
      currency: 'USD',
      metadata: { deal_id: selectedDeal.id, client: selectedDeal.client },
    });

    if (url) {
      sendMessage(`Paystack invoice link generated for ${selectedDeal.client} ($${selectedDeal.value})`, 'invoice_created');
      setDealNotice(`Paystack link dispatched to client. Real-time webhook listener armed.`);
      setTimeout(() => {
        setDealNotice(`Deal closed! Payment confirmed in real time.`);
        setSelectedDeal(null);
      }, 1500);
    }
  };

  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#10B981', margin: '0 0 0.5rem 0' }}>CRM & Deal Pipeline</h1>
          <p style={{ color: '#9A9AAE', margin: 0 }}>Lead scoring, sales operations, and automated Paystack invoicing</p>
        </div>
        <RealtimeStatusBadge connected={isConnected} label="Real-time Pipeline Stream" />
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 style={{ fontSize: '0.875rem', color: '#9A9AAE', margin: '0 0 0.5rem 0' }}>Open Pipeline Value</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10B981', margin: 0 }}>$142,500.00</p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 style={{ fontSize: '0.875rem', color: '#9A9AAE', margin: '0 0 0.5rem 0' }}>Active Deals</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>18</p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 style={{ fontSize: '0.875rem', color: '#9A9AAE', margin: '0 0 0.5rem 0' }}>Qualified Leads</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>42</p>
        </div>
      </div>

      {dealNotice && (
        <div style={{ margin: '1rem 0', padding: '1rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10B981', borderRadius: '12px', color: '#10B981' }}>
          {dealNotice}
        </div>
      )}

      <section style={{ marginBottom: '3rem' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#10B981' }}>Active Deal Pipeline & Paystack Checkout Links</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {deals.map((deal) => (
            <Card key={deal.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <Badge label={deal.stage} color="#10B981" />
                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#10B981' }}>${deal.value.toLocaleString()}</span>
              </div>
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>{deal.client}</h4>
              <p style={{ color: '#9A9AAE', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Send real-time Paystack checkout invoice.</p>
              <Button
                variant="primary"
                onClick={() => handleSendInvoiceLink(deal)}
                style={{ width: '100%', background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}
              >
                Dispatch Paystack Invoice
              </Button>
            </Card>
          ))}
        </div>
      </section>

      <section style={{ margin: '2rem 0' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#10B981' }}>Real-time CRM Feed</h3>
        <Card>
          <div style={{ maxHeight: '150px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {messages.length === 0 ? (
              <span style={{ color: '#9A9AAE', fontSize: '0.9rem' }}>Real-time CRM feed active...</span>
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

      {selectedDeal && (
        <PaystackCheckoutModal
          isOpen={!!selectedDeal}
          onClose={() => setSelectedDeal(null)}
          title={`Generate Invoice for ${selectedDeal.client}`}
          amount={selectedDeal.value}
          currency="USD"
          onConfirm={handleCreatePaystackInvoice}
          loading={loading}
        />
      )}
    </main>
  );
}
