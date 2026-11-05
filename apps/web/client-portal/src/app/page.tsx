import React from 'react';

const metrics = [
  { label: 'Active sprint', value: '4/6', change: '+12% vs last week' },
  { label: 'Budget used', value: '$82.4K', change: '+$6.1K this month' },
  { label: 'Team velocity', value: '96%', change: 'Healthy delivery pace' },
  { label: 'Open actions', value: '08', change: '3 due this week' },
];

const milestones = [
  { title: 'Platform architecture & auth', owner: 'Engineering', status: 'approved', state: 'Completed on 18 Oct' },
  { title: 'Payments + webhook orchestration', owner: 'Integration', status: 'review', state: 'Awaiting approval' },
  { title: 'Operational dashboard & analytics', owner: 'Product', status: 'pending', state: 'In progress' },
];

const deliverables = [
  { name: 'Frontend onboarding flow', progress: 88, tag: 'Design review' },
  { name: 'Role-based access system', progress: 72, tag: 'QA pass' },
  { name: 'Stripe + Korapay sync', progress: 56, tag: 'Pending webhook checks' },
];

const invoices = [
  { title: 'Sprint 04 retainer', date: 'Due 11 Nov', amount: '$8,400' },
  { title: 'Additional UX review', date: 'Due 14 Nov', amount: '$2,100' },
  { title: 'API integration add-on', date: 'Paid on 09 Nov', amount: '$3,700' },
];

const activity = [
  { name: 'Nia Patel', role: 'Product Lead', action: 'approved the onboarding prototype', time: '2h ago' },
  { name: 'Chris Alvarez', role: 'Engineer', action: 'shared the accessibility audit report', time: '4h ago' },
  { name: 'Elly AI', role: 'Project assistant', action: 'flagged 2 risk items in the billing flow', time: 'Today' },
];

function IconHome() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V20h14V9.5" />
    </svg>
  );
}

function IconChart() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 18h16" />
      <path d="M7 14V9" />
      <path d="M12 14V5" />
      <path d="M17 14v-7" />
    </svg>
  );
}

function IconFolders() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H9l1.5 2h8A2.5 2.5 0 0 1 21 9.5v7A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5v-9Z" />
    </svg>
  );
}

function IconInvoice() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 3h8l4 4v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
      <path d="M14 3v4h4" />
      <path d="M8 11h8M8 15h8" />
    </svg>
  );
}

function IconMessages() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7A2.5 2.5 0 0 1 17.5 16H10l-6 4v-4.5A2.5 2.5 0 0 1 4 13.5v-7Z" />
    </svg>
  );
}

function IconSettings() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3v3M12 18v3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M3 12h3M18 12h3M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}

export default function ClientPortalPage() {
  return (
    <main className="portal-shell">
      <aside className="sidebar">
        <div>
          <div className="brand">
            <div className="brand-mark">EV</div>
            <div className="brand-copy">
              <strong>EL VERSE</strong>
              <span>Client portal</span>
            </div>
          </div>

          <nav className="nav" aria-label="Primary navigation">
            <button className="nav-item active" type="button">
              <IconHome />
              Overview
            </button>
            <button className="nav-item" type="button">
              <IconChart />
              Analytics
            </button>
            <button className="nav-item" type="button">
              <IconFolders />
              Deliverables
            </button>
            <button className="nav-item" type="button">
              <IconInvoice />
              Invoices
            </button>
            <button className="nav-item" type="button">
              <IconMessages />
              Messages
            </button>
            <button className="nav-item" type="button">
              <IconSettings />
              Settings
            </button>
          </nav>
        </div>

        <div className="sidebar-card">
          <h4>Project health</h4>
          <strong>92%</strong>
          <p>Delivery confidence remains strong with one onboarding task still pending review.</p>
        </div>
      </aside>

      <div className="main-panel">
        <header className="topbar">
          <div className="topbar-title">
            <small>Current engagement</small>
            <strong>ELCODERS Platform Rebuild</strong>
          </div>

          <div className="topbar-actions">
            <button className="action-button" type="button">Schedule a review</button>
            <button className="primary-button" type="button">Approve milestone</button>
            <div className="avatar" aria-label="User profile">AP</div>
          </div>
        </header>

        <section className="hero">
          <div className="panel hero-copy">
            <span className="eyebrow">On track</span>
            <h1>Product delivery dashboard</h1>
            <p>
              We are shipping the next phase of the client experience with a cleaner onboarding journey,
              secure access controls, and automated billing updates.
            </p>
            <div className="meta-strip">
              <span className="meta-pill">Due in 12 days</span>
              <span className="meta-pill">6 active stakeholders</span>
              <span className="meta-pill">Milestone 04</span>
            </div>
          </div>

          <div className="panel hero-summary">
            <div className="progress-ring"><span>72%</span></div>
            <div>
              <h3>Current progress</h3>
              <div className="stack-value">$82,400</div>
              <div className="stack-meta">
                <span>Budget used</span>
                <span>+8.4%</span>
              </div>
            </div>
          </div>
        </section>

        <section className="stats-grid" aria-label="Project metrics overview">
          {metrics.map((metric) => (
            <div className="panel stat-card" key={metric.label}>
              <small>{metric.label}</small>
              <div className="stat-value">{metric.value}</div>
              <div className="stat-change">↗ {metric.change}</div>
            </div>
          ))}
        </section>

        <section className="content-grid">
          <div className="panel section-panel">
            <div className="panel-header">
              <h3>Milestone timeline</h3>
              <span className="tag">Updated today</span>
            </div>

            <div className="timeline-list">
              {milestones.map((item) => (
                <div className="timeline-item" key={item.title}>
                  <span className={`timeline-dot ${item.status === 'approved' ? 'success' : item.status === 'review' ? 'warning' : ''}`} />
                  <div className="timeline-copy">
                    <strong>{item.title}</strong>
                    <span>{item.owner}</span>
                    <small>{item.state}</small>
                  </div>
                  <span className={`status-badge ${item.status}`}>
                    {item.status === 'approved' ? 'Approved' : item.status === 'review' ? 'Under review' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel section-panel">
            <div className="panel-header">
              <h3>Deliverables</h3>
              <span className="tag">3 items</span>
            </div>

            <div className="deliverables-list">
              {deliverables.map((item) => (
                <div className="deliverable-item" key={item.name}>
                  <div className="deliverable-main">
                    <div className="deliverable-icon">{item.name.charAt(0).toUpperCase()}</div>
                    <div>
                      <strong>{item.name}</strong>
                      <span>{item.tag}</span>
                    </div>
                  </div>

                  <div className="inline-bar" aria-label={`${item.progress}% complete`}>
                    <i style={{ width: `${item.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="content-grid">
          <div className="panel section-panel">
            <div className="panel-header">
              <h3>Invoice & billing</h3>
              <span className="tag">Next due 11 Nov</span>
            </div>

            <div className="invoice-list">
              {invoices.map((invoice) => (
                <div className="invoice-row" key={invoice.title}>
                  <div className="invoice-meta">
                    <strong>{invoice.title}</strong>
                    <span>{invoice.date}</span>
                  </div>
                  <div className="amount">{invoice.amount}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel section-panel">
            <div className="panel-header">
              <h3>Team activity</h3>
              <span className="tag">Live feed</span>
            </div>

            <div className="feed-list">
              {activity.map((item) => (
                <div className="feed-item" key={`${item.name}-${item.time}`}>
                  <div className="avatar" aria-label={item.name}>{item.name.split(' ').map((chunk) => chunk[0]).slice(0, 2).join('').toUpperCase()}</div>
                  <div className="feed-copy">
                    <strong>{item.name}</strong>
                    <span>{item.role}</span>
                    <small>{item.action}</small>
                  </div>
                  <span className="pill">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
