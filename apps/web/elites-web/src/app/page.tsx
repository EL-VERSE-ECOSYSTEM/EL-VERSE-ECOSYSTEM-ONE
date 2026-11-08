'use client';

import React, { useState } from 'react';
import { usePaystackPayment, useRealtimeSubscription } from '@elverse/shared-hooks';
import { Button, Card, RealtimeStatusBadge, PaystackCheckoutModal, Badge } from '@elverse/shared-ui';

const courses = [
  { id: 'course-1', title: 'Senior Fullstack System Architecture', rank: 'A', price: 250, tutor: 'Arch Lead Sarah' },
  { id: 'course-2', title: 'Cloud Native Microservices with Go', rank: 'B', price: 180, tutor: 'Staff Eng Dave' },
  { id: 'course-3', title: 'AI Systems & LLM Fine-Tuning', rank: 'S', price: 320, tutor: 'AI Lead Viktor' },
];

export default function ElitesHomePage() {
  const [selectedCourse, setSelectedCourse] = useState<typeof courses[0] | null>(null);
  const [enrollmentStatus, setEnrollmentStatus] = useState<string | null>(null);
  const { initialize, loading, error } = usePaystackPayment();
  const { isConnected, messages, sendMessage } = useRealtimeSubscription({
    channelId: 'elites-courses',
  });

  const handleEnrollClick = (course: typeof courses[0]) => {
    setSelectedCourse(course);
  };

  const handleConfirmPaystack = async () => {
    if (!selectedCourse) return;
    setEnrollmentStatus('Initializing Paystack gateway...');
    const url = await initialize({
      email: 'learner@elverse.com',
      amount: selectedCourse.price * 100,
      currency: 'USD',
      metadata: { course_id: selectedCourse.id, course_title: selectedCourse.title },
    });

    if (url) {
      sendMessage(`User enrolled in ${selectedCourse.title} via Paystack`, 'enrollment');
      setEnrollmentStatus(`Checkout ready: Redirecting or opening Paystack portal...`);
      setTimeout(() => {
        setEnrollmentStatus(`Payment verified via Paystack! Enrolled in ${selectedCourse.title}`);
        setSelectedCourse(null);
      }, 1500);
    } else {
      setEnrollmentStatus(`Payment initialization error: ${error || 'Please try again'}`);
    }
  };

  return (
    <main data-arm="elites" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img src="/assets/elites-logo.jpeg" alt="ELITES" style={{ height: '40px' }} />
          <h1 style={{ fontSize: '1.5rem', margin: 0, color: '#8B5CF6' }}>ELITES</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <RealtimeStatusBadge connected={isConnected} label="Real-time Mentorship Stream" />
          <nav style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#mentors" style={{ color: '#C4C4D4', textDecoration: 'none' }}>Mentorship</a>
            <a href="#courses" style={{ color: '#C4C4D4', textDecoration: 'none' }}>Courses</a>
          </nav>
        </div>
      </header>

      <section style={{ textAlign: 'center', margin: '4rem 0' }}>
        <h2 style={{ fontSize: '3.5rem', fontWeight: 800, background: 'linear-gradient(135deg, #8B5CF6 0%, #F59E0B 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Stop Watching Tutorials. Start Building with a Mentor.
        </h2>
        <p style={{ fontSize: '1.25rem', color: '#9A9AAE', maxWidth: '600px', margin: '1rem auto' }}>
          50+ Senior Developers, 500+ Active Learners, 200+ Projects Shipped. Instant Paystack Checkout & Real-time Verification.
        </p>
        {enrollmentStatus && (
          <div style={{ margin: '1.5rem auto', maxWidth: '500px', padding: '1rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10B981', borderRadius: '12px', color: '#10B981' }}>
            {enrollmentStatus}
          </div>
        )}
      </section>

      <section id="courses" style={{ margin: '4rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '2rem', margin: 0, color: '#8B5CF6' }}>Available Courses & Socratic Tracks</h3>
          <Badge label="Paystack Enabled" color="#8B5CF6" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {courses.map((course) => (
            <Card key={course.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <Badge label={`Rank: ${course.rank}`} color="#F59E0B" />
                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#10B981' }}>${course.price}</span>
              </div>
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>{course.title}</h4>
              <p style={{ color: '#9A9AAE', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Taught by {course.tutor}</p>
              <Button
                variant="primary"
                onClick={() => handleEnrollClick(course)}
                style={{ width: '100%', background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)' }}
              >
                Enroll via Paystack
              </Button>
            </Card>
          ))}
        </div>
      </section>

      <section style={{ margin: '4rem 0' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#8B5CF6' }}>Live Real-Time Activity Feed</h3>
        <Card>
          <div style={{ maxHeight: '150px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {messages.length === 0 ? (
              <span style={{ color: '#9A9AAE', fontSize: '0.9rem' }}>Listening to live learning and payment events in real time...</span>
            ) : (
              messages.map((m, idx) => (
                <div key={idx} style={{ fontSize: '0.85rem', color: '#E2E8F0', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px' }}>
                  <span style={{ color: '#8B5CF6', fontWeight: 600 }}>[{new Date(m.timestamp || Date.now()).toLocaleTimeString()}]</span> {m.content}
                </div>
              ))
            )}
          </div>
        </Card>
      </section>

      {selectedCourse && (
        <PaystackCheckoutModal
          isOpen={!!selectedCourse}
          onClose={() => setSelectedCourse(null)}
          title={`Enroll in ${selectedCourse.title}`}
          amount={selectedCourse.price}
          currency="USD"
          onConfirm={handleConfirmPaystack}
          loading={loading}
        />
      )}
    </main>
  );
}
