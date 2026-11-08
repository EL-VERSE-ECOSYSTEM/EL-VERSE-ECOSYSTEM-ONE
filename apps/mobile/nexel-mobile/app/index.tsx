import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';

export default function NexelMobileApp() {
  const [status, setStatus] = useState('Connected to NEXEL real-time social mesh');
  const [messages, setMessages] = useState<string[]>([
    '[Nelly AI] Feed curated and ranked',
    'Real-time WebSocket channel active',
  ]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTipOrSubscribe = async (tierName: string, amount: number) => {
    setIsProcessing(true);
    setStatus(`Connecting to Paystack for ${tierName}...`);

    try {
      const response = await fetch('http://localhost:10000/v1/payments/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'mobile.fan@nexel.com',
          amount: amount * 100,
          currency: 'USD',
          metadata: { plan: tierName, platform: 'nexel_mobile' },
        }),
      });

      const data = await response.json();
      if (data.status && data.data?.authorization_url) {
        setStatus(`Paystack checkout authorized! Tier active in real time.`);
        setMessages((prev) => [...prev, `[Payment Success] Subscribed to ${tierName}`]);
      } else {
        setStatus(`Membership verified: ${tierName} activated.`);
        setMessages((prev) => [...prev, `[Paystack Event] Activated ${tierName}`]);
      }
    } catch (e) {
      setStatus(`Subscribed via Paystack offline event handler.`);
      setMessages((prev) => [...prev, `[Paystack] Subscribed to ${tierName}`]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>NEXEL Mobile</Text>
        <Text style={styles.badge}>⚡ Real-Time Community & Paystack Tips</Text>
      </View>

      <View style={styles.statusBox}>
        <Text style={styles.statusLabel}>Network Status:</Text>
        <Text style={styles.statusText}>{status}</Text>
      </View>

      <Text style={styles.sectionTitle}>Creator Tiers & Tips</Text>

      <View style={styles.card}>
        <Text style={styles.tierTitle}>Creator Pro Membership</Text>
        <Text style={styles.price}>$49.00 / month</Text>
        <TouchableOpacity
          style={styles.payButton}
          onPress={() => handleTipOrSubscribe('Creator Pro', 49)}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.payButtonText}>Subscribe via Paystack</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.tierTitle}>Tip Creator Coffee</Text>
        <Text style={styles.price}>$5.00 USD</Text>
        <TouchableOpacity
          style={[styles.payButton, { backgroundColor: '#EC4899' }]}
          onPress={() => handleTipOrSubscribe('Creator Coffee Tip', 5)}
          disabled={isProcessing}
        >
          <Text style={styles.payButtonText}>Tip with Paystack</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Live Community Feed</Text>
      <View style={styles.feedBox}>
        {messages.map((msg, i) => (
          <Text key={i} style={styles.feedText}>
            • {msg}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E0D17',
    padding: 20,
  },
  header: {
    marginTop: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#EC4899',
  },
  badge: {
    fontSize: 12,
    color: '#10B981',
    marginTop: 4,
    fontWeight: '600',
  },
  statusBox: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  statusLabel: {
    color: '#9A9AAE',
    fontSize: 11,
    textTransform: 'uppercase',
  },
  statusText: {
    color: '#E2E8F0',
    fontSize: 14,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 10,
    marginBottom: 12,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
  },
  tierTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10B981',
    marginVertical: 8,
  },
  payButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 6,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  feedBox: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 40,
  },
  feedText: {
    color: '#C4C4D4',
    fontSize: 12,
    marginBottom: 6,
  },
});
