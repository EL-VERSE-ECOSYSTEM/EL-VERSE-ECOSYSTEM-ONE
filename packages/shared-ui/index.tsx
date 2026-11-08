import React, { useState } from 'react';
import './tokens.css';
export { ThemeToggle } from './theme-toggle';

export const BRAND_CONFIGS = {
  elcoders: { name: 'ELCODERS', primaryColor: '#0066FF', logo: '/assets/elcoders-logo.webp' },
  elites: { name: 'ELITES', primaryColor: '#8B5CF6', logo: '/assets/elites-logo.jpeg' },
  elspace: { name: 'ELSPACE', primaryColor: '#10B981', logo: '/assets/elspace-logo.jpeg' },
  elaccess: { name: 'EL ACCESS', primaryColor: '#F97316', logo: '/assets/elaccess-logo.jpeg' },
  nexel: { name: 'NEXEL', primaryColor: '#EC4899', logo: '/assets/nexel-logo.jpeg' },
};

export function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  style,
  type = 'button',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  disabled?: boolean;
  style?: React.CSSProperties;
  type?: 'button' | 'submit' | 'reset';
}) {
  let bg = 'var(--arm-gradient, #0066FF)';
  let border = 'none';
  let color = '#FFFFFF';

  if (variant === 'secondary') {
    bg = 'var(--glass-bg, rgba(255,255,255,0.1))';
  } else if (variant === 'outline') {
    bg = 'transparent';
    border = '1px solid rgba(255,255,255,0.2)';
  } else if (variant === 'danger') {
    bg = '#EF4444';
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{
        padding: '10px 20px',
        borderRadius: '12px',
        border,
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        background: bg,
        color,
        transition: 'all 0.2s ease',
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function Card({ children, style, className }: { children: React.ReactNode; style?: React.CSSProperties; className?: string }) {
  return (
    <div
      className={className}
      style={{
        background: 'var(--glass-bg, rgba(255,255,255,0.06))',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--glass-border, rgba(255,255,255,0.12))',
        borderRadius: '16px',
        padding: '1.5rem',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Badge({ label, color = '#10B981' }: { label: string; color?: string }) {
  return (
    <span
      style={{
        padding: '4px 10px',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: 600,
        backgroundColor: `${color}22`,
        color,
        border: `1px solid ${color}44`,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
      }}
    >
      {label}
    </span>
  );
}

export function RealtimeStatusBadge({
  connected,
  label = 'Real-time Live',
}: {
  connected: boolean;
  label?: string;
}) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 10px',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: 600,
        backgroundColor: connected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
        color: connected ? '#10B981' : '#EF4444',
        border: `1px solid ${connected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
      }}
    >
      <span
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: connected ? '#10B981' : '#EF4444',
          boxShadow: connected ? '0 0 8px #10B981' : 'none',
        }}
      />
      {connected ? label : 'Disconnected'}
    </span>
  );
}

export function PaystackCheckoutModal({
  isOpen,
  onClose,
  title,
  amount,
  currency = 'USD',
  onConfirm,
  loading = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  amount: number;
  currency?: string;
  onConfirm: () => void;
  loading?: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        style={{
          background: '#12121A',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '20px',
          padding: '2rem',
          maxWidth: '450px',
          width: '100%',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#FFFFFF' }}>{title}</h3>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#9A9AAE',
              fontSize: '1.5rem',
              cursor: 'pointer',
              lineHeight: 1,
            }}
          >
            &times;
          </button>
        </div>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            borderRadius: '12px',
            padding: '1.25rem',
            marginBottom: '1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ fontSize: '0.85rem', color: '#9A9AAE', marginBottom: '4px' }}>Total Due</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#10B981' }}>
            {currency} {amount.toLocaleString()}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: '#00D4FF', background: 'rgba(0, 212, 255, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
              🔒 Secured by Paystack
            </span>
            <span style={{ fontSize: '0.75rem', color: '#A78BFA' }}>Instant real-time verification</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            disabled={loading}
            style={{ background: 'linear-gradient(135deg, #0066FF 0%, #00D4FF 100%)' }}
          >
            {loading ? 'Connecting to Paystack...' : 'Pay with Paystack'}
          </Button>
        </div>
      </div>
    </div>
  );
}
