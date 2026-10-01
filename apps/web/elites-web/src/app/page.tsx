import React from 'react';

export default function ElitesHomePage() {
  return (
    <main data-arm="elites" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img src="/assets/elites-logo.jpeg" alt="ELITES" style={{ height: '40px' }} />
          <h1 style={{ fontSize: '1.5rem', margin: 0, color: '#8B5CF6' }}>ELITES</h1>
        </div>
        <nav style={{ display: 'flex', gap: '1.5rem' }}>
          <a href="#mentors" style={{ color: '#C4C4D4', textDecoration: 'none' }}>Mentorship</a>
          <a href="#courses" style={{ color: '#C4C4D4', textDecoration: 'none' }}>Courses</a>
          <a href="#simulator" style={{ color: '#C4C4D4', textDecoration: 'none' }}>3D IDE Simulator</a>
        </nav>
      </header>

      <section style={{ textAlign: 'center', margin: '4rem 0' }}>
        <h2 style={{ fontSize: '3.5rem', fontWeight: 800, background: 'linear-gradient(135deg, #8B5CF6 0%, #F59E0B 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Stop Watching Tutorials. Start Building with a Mentor.
        </h2>
        <p style={{ fontSize: '1.25rem', color: '#9A9AAE', maxW: '600px', margin: '1rem auto' }}>
          50+ Senior Developers, 500+ Active Learners, 200+ Projects Shipped.
        </p>
      </section>
    </main>
  );
}
