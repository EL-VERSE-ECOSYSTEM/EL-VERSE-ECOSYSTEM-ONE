'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { ApiClient, PaystackInitializePayload, PaystackVerifyResponse, createRealtimeClient, RealtimeMessage } from '@elverse/shared-api';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export interface UsePaystackPaymentOptions {
  apiClient?: ApiClient;
  onSuccess?: (response: PaystackVerifyResponse) => void;
  onError?: (error: Error) => void;
}

export function usePaystackPayment(options: UsePaystackPaymentOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transaction, setTransaction] = useState<PaystackVerifyResponse['data'] | null>(null);
  const clientRef = useRef(options.apiClient || new ApiClient());

  const initialize = useCallback(
    async (payload: PaystackInitializePayload): Promise<string | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await clientRef.current.initializePayment(payload);
        if (response.status && response.data?.authorization_url) {
          if (typeof window !== 'undefined' && options.onSuccess) {
            // Setup listener
          }
          return response.data.authorization_url;
        } else {
          throw new Error(response.message || 'Payment initialization failed');
        }
      } catch (err: any) {
        const errMsg = err?.message || 'Payment initialization failed';
        setError(errMsg);
        if (options.onError) {
          options.onError(err);
        }
        return null;
      } finally {
        setLoading(false);
      }
    },
    [options]
  );

  const verify = useCallback(
    async (reference: string): Promise<PaystackVerifyResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        const res = await clientRef.current.verifyPayment(reference);
        if (res.status && res.data.status === 'success') {
          setTransaction(res.data);
          if (options.onSuccess) {
            options.onSuccess(res);
          }
          return res;
        } else {
          throw new Error(res.message || 'Payment verification failed');
        }
      } catch (err: any) {
        const errMsg = err?.message || 'Payment verification failed';
        setError(errMsg);
        if (options.onError) {
          options.onError(err);
        }
        return null;
      } finally {
        setLoading(false);
      }
    },
    [options]
  );

  return {
    initialize,
    verify,
    loading,
    error,
    transaction,
  };
}

export interface UseRealtimeSubscriptionOptions {
  channelId: string;
  senderId?: string;
  wsUrl?: string;
  onMessage?: (message: RealtimeMessage) => void;
}

export function useRealtimeSubscription({
  channelId,
  senderId,
  wsUrl,
  onMessage,
}: UseRealtimeSubscriptionOptions) {
  const [messages, setMessages] = useState<RealtimeMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const clientRef = useRef<ReturnType<typeof createRealtimeClient> | null>(null);
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  useEffect(() => {
    if (!channelId) return;

    setIsConnected(true);
    const client = createRealtimeClient(
      channelId,
      (msg) => {
        setMessages((prev) => [...prev, msg]);
        if (onMessageRef.current) {
          onMessageRef.current(msg);
        }
      },
      { wsUrl, senderId }
    );
    clientRef.current = client;

    return () => {
      client.close();
      setIsConnected(false);
    };
  }, [channelId, senderId, wsUrl]);

  const sendMessage = useCallback((content: string, type: string = 'chat', extraData?: any) => {
    if (clientRef.current) {
      clientRef.current.send(content, type, extraData);
    }
  }, []);

  return {
    messages,
    sendMessage,
    isConnected,
  };
}
