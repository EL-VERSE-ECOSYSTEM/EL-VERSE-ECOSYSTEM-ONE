export interface ApiClientOptions {
  baseUrl?: string;
  token?: string;
}

export interface PaystackInitializePayload {
  email: string;
  amount: number; // in subunits (kobo or cents)
  currency?: string;
  reference?: string;
  callback_url?: string;
  metadata?: Record<string, any>;
}

export interface PaystackInitializeResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    status: 'success' | 'failed' | 'abandoned';
    reference: string;
    amount: number;
    gateway_response: string;
    channel: string;
    currency: string;
    customer: {
      email: string;
    };
  };
}

export interface RealtimeMessage {
  type: string;
  channel_id: string;
  sender_id?: string;
  content: string;
  timestamp: string;
  data?: any;
}

export class ApiClient {
  private baseUrl: string;
  private token?: string;

  constructor(options: ApiClientOptions = {}) {
    this.baseUrl = options.baseUrl || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:10000');
    this.token = options.token;
  }

  async fetch(path: string, options: RequestInit = {}) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Request failed with status ${response.status}`);
    }

    return response.json();
  }

  /**
   * Initialize Paystack Checkout via payment service or API gateway
   */
  async initializePayment(payload: PaystackInitializePayload): Promise<PaystackInitializeResponse> {
    return this.fetch('/v1/payments/initialize', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  /**
   * Verify Paystack Transaction
   */
  async verifyPayment(reference: string): Promise<PaystackVerifyResponse> {
    return this.fetch(`/v1/payments/verify?reference=${encodeURIComponent(reference)}`, {
      method: 'GET',
    });
  }
}

/**
 * Creates a real-time WebSocket connection to the messaging/event gateway.
 */
export function createRealtimeClient(
  channelId: string,
  onMessage: (message: RealtimeMessage) => void,
  options: { wsUrl?: string; senderId?: string } = {}
) {
  if (typeof window === 'undefined' && typeof WebSocket === 'undefined') {
    return {
      send: () => {},
      close: () => {},
    };
  }

  const defaultWsUrl =
    typeof window !== 'undefined'
      ? `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.hostname}:10005/ws`
      : 'ws://localhost:10005/ws';

  const wsUrl = options.wsUrl || defaultWsUrl;
  let socket: WebSocket | null = null;
  let isClosed = false;

  try {
    socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            type: 'join_channel',
            channel_id: channelId,
            sender_id: options.senderId || 'anonymous',
          })
        );
      }
    };

    socket.onmessage = (event) => {
      try {
        const payload: RealtimeMessage = JSON.parse(event.data);
        onMessage(payload);
      } catch (err) {
        console.warn('Realtime parse error', err);
      }
    };

    socket.onerror = (err) => {
      console.warn('Realtime socket error', err);
    };

    socket.onclose = () => {
      // closed
    };
  } catch (e) {
    console.warn('Could not connect to Realtime WebSocket', e);
  }

  return {
    send: (content: string, type: string = 'chat', extraData?: any) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            type,
            channel_id: channelId,
            sender_id: options.senderId || 'anonymous',
            content,
            timestamp: new Date().toISOString(),
            data: extraData,
          })
        );
      }
    },
    close: () => {
      isClosed = true;
      if (socket) {
        socket.close();
      }
    },
  };
}
