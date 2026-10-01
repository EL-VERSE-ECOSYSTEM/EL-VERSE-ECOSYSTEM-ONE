import React from 'react';

export default function ElcodersHomePage() {
  return (
    <main data-arm="elcoders" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img src="/assets/elcoders-logo.webp" alt="ELCODERS" style={{ height: '40px' }} />
          <h1 style={{ fontSize: '1.5rem', margin: 0, color: '#0066FF' }}>ELCODERS</h1>
        </div>
        <nav style={{ display: 'flex', gap: '1.5rem' }}>
          <a href="#services" style={{ color: '#C4C4D4', textDecoration: 'none' }}>Solutions</a>
          <a href="#products" style={{ color: '#C4C4D4', textDecoration: 'none' }}>Products</a>
          <a href="#tech" style={{ color: '#C4C4D4', textDecoration: 'none' }}>Tech Matrix</a>
          <a href="#pricing" style={{ color: '#C4C4D4', textDecoration: 'none' }}>Investment</a>
        </nav>
      </header>

      <section style={{ textAlign: 'center', margin: '4rem 0' }}>
        <h2 style={{ fontSize: '3.5rem', fontWeight: 800, background: 'linear-gradient(135deg, #0066FF 0%, #00D4FF 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Your Idea + Our Code = Scalable Success
        </h2>
        <p style={{ fontSize: '1.25rem', color: '#9A9AAE', maxW: '600px', margin: '1rem auto' }}>
          24hr First Commit Guarantee. 12+ MVPs Shipped, 500+ Hours Code Delivered, 98% Client Satisfaction.
        </p>
        <button style={{ padding: '1rem 2rem', fontSize: '1rem', background: 'linear-gradient(135deg, #0066FF 0%, #00D4FF 100%)', border: 'none', borderRadius: '12px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>
          Book Free Consultation
        </button>
      </section>
    </main>
  );
}
