'use client';

import React, { useState } from 'react';
import { useRealtimeSubscription, usePaystackPayment } from '@elverse/shared-hooks';
import { Card, RealtimeStatusBadge, Button, PaystackCheckoutModal, Badge } from '@elverse/shared-ui';

const workflows = [
  { id: 'wf-1', name: 'Paystack Webhook -> Slack & Supabase Sync', runs: 1420, active: true },
  { id: 'wf-2', name: 'Escrow Auto-Release on Git Merge Approval', runs: 820, active: true },
  { id: 'wf-3', name: 'Internship Match Alert -> Telegram Broadcast', runs: 530, active: true },
];

export default function AutomationDashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const { initialize, loading } = usePaystackPayment();
  const { isConnected, messages, sendMessage } = useRealtimeSubscription({
    channelId: 'automation-triggers',
  });

  const handleBuyWorkflowCredits = () => {
    setIsModalOpen(true);
  };

  const handleConfirmPaystack = async () => {
    setStatusMessage('Connecting to Paystack for automation runner tier...');
    const url = await initialize({
      email: 'ops@elverse.com',
      amount: 4900,
      currency: 'USD',
      metadata: { service: 'automation_runner_pro' },
    });

    if (url) {
      sendMessage('Automation runner credits recharged via Paystack Gateway (10,000 runs)', 'credits_recharged');
      setStatusMessage('Workflow credits topped up in real time!');
      setTimeout(() => {
        setIsModalOpen(false);
      }, 1500);
    }
  };

  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#10B981', margin: '0 0 0.5rem 0' }}>Workflow Automation Engine</h1>
          <p style={{ color: '#9A9AAE', margin: 0 }}>Event triggers, Paystack webhook pipelines, and real-time execution graphs</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <RealtimeStatusBadge connected={isConnected} label="Real-time Engine Active" />
          <Button variant="primary" onClick={handleBuyWorkflowCredits}>
            Recharge via Paystack
          </Button>
        </div>
      </header>

      {statusMessage && (
        <div style={{ margin: '1rem 0', padding: '1rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10B981', borderRadius: '12px', color: '#10B981' }}>
          {statusMessage}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {workflows.map((wf) => (
          <Card key={wf.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <Badge label="Active Trigger" color="#10B981" />
              <span style={{ fontSize: '0.85rem', color: '#9A9AAE' }}>{wf.runs} runs</span>
            </div>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>{wf.name}</h3>
            <p style={{ fontSize: '0.85rem', color: '#9A9AAE' }}>Executes in sub-50ms via Go automation-service.</p>
          </Card>
        ))}
      </div>

      <section style={{ margin: '2rem 0' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#10B981' }}>Real-time Execution & Webhook Log</h3>
        <Card>
          <div style={{ maxHeight: '160px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {messages.length === 0 ? (
              <span style={{ color: '#9A9AAE', fontSize: '0.9rem' }}>Real-time workflow execution stream ready...</span>
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

      <PaystackCheckoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Recharge Automation Credits"
        amount={49}
        currency="USD"
        onConfirm={handleConfirmPaystack}
        loading={loading}
      />
    </main>
  );
}
