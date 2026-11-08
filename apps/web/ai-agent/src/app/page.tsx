'use client';

import React, { useState } from 'react';
import { useRealtimeSubscription, usePaystackPayment } from '@elverse/shared-hooks';
import { Card, RealtimeStatusBadge, Button, PaystackCheckoutModal, Badge } from '@elverse/shared-ui';

const agents = [
  { name: 'Menato', arm: 'ELITES', role: 'Learning Path & Course Enrollment Specialist', cost: 50 },
  { name: 'Elly', arm: 'ELCODERS', role: 'Automated Code Review & Scoping Agent', cost: 120 },
  { name: 'Spectre', arm: 'EL SPACE', role: 'Gig Proposal & Escrow Negotiation', cost: 75 },
  { name: 'Nelly', arm: 'NEXEL', role: 'Content Moderation & Feed Optimization', cost: 40 },
];

export default function AIAgentDashboardPage() {
  const [selectedAgent, setSelectedAgent] = useState<typeof agents[0] | null>(null);
  const [agentNotice, setAgentNotice] = useState<string | null>(null);
  const { initialize, loading } = usePaystackPayment();
  const { isConnected, messages, sendMessage } = useRealtimeSubscription({
    channelId: 'ai-agent-tasks',
  });

  const handleHireAgent = (agent: typeof agents[0]) => {
    setSelectedAgent(agent);
  };

  const handleConfirmPaystack = async () => {
    if (!selectedAgent) return;
    setAgentNotice(`Initializing Paystack execution budget for ${selectedAgent.name}...`);
    const url = await initialize({
      email: 'agent-operator@elverse.com',
      amount: selectedAgent.cost * 100,
      currency: 'USD',
      metadata: { agent: selectedAgent.name, arm: selectedAgent.arm },
    });

    if (url) {
      sendMessage(`AI Agent ${selectedAgent.name} provisioned with real-time Paystack execution budget ($${selectedAgent.cost})`, 'agent_task_funded');
      setAgentNotice(`Agent ${selectedAgent.name} funded and executing live!`);
      setTimeout(() => {
        setSelectedAgent(null);
      }, 1500);
    }
  };

  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#6366F1', margin: '0 0 0.5rem 0' }}>AI Agent Fleet Orchestrator</h1>
          <p style={{ color: '#9A9AAE', margin: 0 }}>Autonomous tools, Paystack task funding, and streaming SSE inference</p>
        </div>
        <RealtimeStatusBadge connected={isConnected} label="Real-time Agent Mesh" />
      </header>

      {agentNotice && (
        <div style={{ margin: '1rem 0', padding: '1rem', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid #6366F1', borderRadius: '12px', color: '#A5B4FC' }}>
          {agentNotice}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {agents.map((agent) => (
          <Card key={agent.name}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <Badge label={agent.arm} color="#6366F1" />
              <span style={{ fontWeight: 700, color: '#10B981' }}>${agent.cost}/task</span>
            </div>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>{agent.name}</h3>
            <p style={{ fontSize: '0.85rem', color: '#9A9AAE', marginBottom: '1.5rem' }}>{agent.role}</p>
            <Button variant="primary" onClick={() => handleHireAgent(agent)} style={{ width: '100%' }}>
              Fund Task via Paystack
            </Button>
          </Card>
        ))}
      </div>

      <section style={{ margin: '2rem 0' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#6366F1' }}>Real-time Agent Execution & Tool Calls</h3>
        <Card>
          <div style={{ maxHeight: '160px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {messages.length === 0 ? (
              <span style={{ color: '#9A9AAE', fontSize: '0.9rem' }}>Real-time agent stream online. Ready for tool execution...</span>
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

      {selectedAgent && (
        <PaystackCheckoutModal
          isOpen={!!selectedAgent}
          onClose={() => setSelectedAgent(null)}
          title={`Fund AI Execution: ${selectedAgent.name}`}
          amount={selectedAgent.cost}
          currency="USD"
          onConfirm={handleConfirmPaystack}
          loading={loading}
        />
      )}
    </main>
  );
}
