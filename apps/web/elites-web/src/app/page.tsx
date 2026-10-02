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
        <p style={{ fontSize: '1.25rem', color: '#9A9AAE', maxWidth: '600px', margin: '1rem auto' }}>
          50+ Senior Developers, 500+ Active Learners, 200+ Projects Shipped.
        </p>
      </section>

      <section id="mentors" style={{ margin: '4rem 0' }}>
        <h3 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#8B5CF6' }}>Featured Mentors</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {['Senior Fullstack Architect', 'Cloud Native Lead', 'AI Systems Engineer'].map((role, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
              <h4 style={{ margin: '0 0 0.5rem 0' }}>Mentor #{i + 1}</h4>
              <p style={{ color: '#9A9AAE', fontSize: '0.9rem', margin: 0 }}>{role}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
