import './tokens.css';

export * from './tokens.css';

export const BRAND_CONFIGS = {
  elcoders: { name: 'ELCODERS', primaryColor: '#0066FF', logo: '/assets/elcoders-logo.webp' },
  elites: { name: 'ELITES', primaryColor: '#8B5CF6', logo: '/assets/elites-logo.jpeg' },
  elspace: { name: 'ELSPACE', primaryColor: '#10B981', logo: '/assets/elspace-logo.jpeg' },
  elaccess: { name: 'EL ACCESS', primaryColor: '#F97316', logo: '/assets/elaccess-logo.jpeg' },
  nexel: { name: 'NEXEL', primaryColor: '#EC4899', logo: '/assets/nexel-logo.jpeg' },
};

export function Button({ children, onClick, variant = 'primary' }: { children: React.ReactNode; onClick?: () => void; variant?: 'primary' | 'secondary' }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '12px 24px',
        borderRadius: '12px',
        border: 'none',
        fontWeight: 600,
        cursor: 'pointer',
        background: variant === 'primary' ? 'var(--arm-gradient, #0066FF)' : 'var(--glass-bg, rgba(255,255,255,0.1))',
        color: '#FFFFFF',
      }}
    >
      {children}
    </button>
  );
}

export function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
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
      }}
    >
      {label}
    </span>
  );
}
