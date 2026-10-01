import React from 'react';

export default function ElspaceHomePage() {
  return (
    <main data-arm="elspace" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img src="/assets/elspace-logo.jpeg" alt="ELSPACE" style={{ height: '40px' }} />
          <h1 style={{ fontSize: '1.5rem', margin: 0, color: '#10B981' }}>ELSPACE</h1>
        </div>
      </header>

      <section style={{ textAlign: 'center', margin: '4rem 0' }}>
        <h2 style={{ fontSize: '3.5rem', fontWeight: 800, background: 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Freelance Arm of EL VERSE
        </h2>
        <p style={{ fontSize: '1.25rem', color: '#9A9AAE' }}>
          Connecting Vetted Tech Talent with High-Impact Projects.
        </p>
      </section>
    </main>
  );
}
