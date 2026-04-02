import './App.css'

const metricCards = [
  { title: 'Total Revenue', value: '$124,500', delta: '+12.4%', tone: 'success' },
  { title: 'New Customers', value: '1,284', delta: '+8.1%', tone: 'primary' },
  { title: 'Open Tickets', value: '47', delta: '-2.7%', tone: 'danger' },
  { title: 'Conversion Rate', value: '6.82%', delta: '+0.9%', tone: 'success' },
]

const tableRows = [
  {
    campaign: 'Spring Product Launch',
    channel: 'Email',
    status: 'Active',
    spent: '$12,300',
    roi: '4.2x',
  },
  {
    campaign: 'Retargeting Q2',
    channel: 'Social',
    status: 'Paused',
    spent: '$8,940',
    roi: '2.8x',
  },
  {
    campaign: 'Enterprise Leads',
    channel: 'LinkedIn',
    status: 'Active',
    spent: '$21,120',
    roi: '5.1x',
  },
  {
    campaign: 'Brand Awareness',
    channel: 'Display',
    status: 'Draft',
    spent: '$4,780',
    roi: '1.9x',
  },
]

const activities = [
  {
    title: 'New user onboarding completed',
    time: '10 minutes ago',
    color: 'primary',
  },
  {
    title: 'Monthly sales report generated',
    time: '48 minutes ago',
    color: 'success',
  },
  {
    title: 'Customer ticket #3482 escalated',
    time: '2 hours ago',
    color: 'danger',
  },
  {
    title: 'Product feed synchronized',
    time: 'Yesterday, 21:14',
    color: 'warning',
  },
]

function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">Metronic Style</div>
        <nav className="menu">
          <p className="menu-title">MAIN</p>
          <button className="menu-item active">Dashboard</button>
          <button className="menu-item">eCommerce</button>
          <button className="menu-item">Analytics</button>
          <button className="menu-item">Customers</button>
          <button className="menu-item">Reports</button>
        </nav>

        <nav className="menu">
          <p className="menu-title">SETTINGS</p>
          <button className="menu-item">Profile</button>
          <button className="menu-item">Billing</button>
          <button className="menu-item">System Logs</button>
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h1>Dashboard Overview</h1>
            <p>Welcome back, Rodrigo. Here is your performance summary.</p>
          </div>
          <div className="topbar-actions">
            <input type="text" placeholder="Search..." />
            <button className="primary-btn">Create Report</button>
          </div>
        </header>

        <section className="metric-grid">
          {metricCards.map((card) => (
            <article className="metric-card" key={card.title}>
              <p>{card.title}</p>
              <h3>{card.value}</h3>
              <span className={`badge ${card.tone}`}>{card.delta}</span>
            </article>
          ))}
        </section>

        <section className="content-grid">
          <article className="panel panel-large">
            <div className="panel-head">
              <h2>Performance Overview</h2>
              <button className="ghost-btn">Export</button>
            </div>
            <div className="chart-wrap">
              <svg viewBox="0 0 700 260" aria-label="Performance chart">
                <defs>
                  <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#3699ff" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#3699ff" stopOpacity="0.02" />
                  </linearGradient>
                </defs>
                <path
                  d="M40 210 C90 170, 150 180, 200 145 C250 110, 300 130, 350 95 C400 70, 450 90, 500 72 C550 58, 610 68, 660 35 L660 230 L40 230 Z"
                  fill="url(#areaGradient)"
                />
                <polyline
                  points="40,210 100,180 160,170 220,135 280,125 340,100 400,85 460,90 520,70 580,65 660,35"
                  fill="none"
                  stroke="#3699ff"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </article>

          <article className="panel">
            <div className="panel-head">
              <h2>Revenue Sources</h2>
            </div>
            <div className="progress-list">
              <div>
                <p>Direct Sales</p>
                <div className="progress-bar"><span style={{ width: '68%' }} /></div>
              </div>
              <div>
                <p>Social Media</p>
                <div className="progress-bar"><span style={{ width: '42%' }} /></div>
              </div>
              <div>
                <p>Email Campaigns</p>
                <div className="progress-bar"><span style={{ width: '57%' }} /></div>
              </div>
              <div>
                <p>Affiliates</p>
                <div className="progress-bar"><span style={{ width: '31%' }} /></div>
              </div>
            </div>
          </article>
        </section>

        <section className="content-grid">
          <article className="panel panel-large">
            <div className="panel-head">
              <h2>Campaign Performance</h2>
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Campaign</th>
                    <th>Channel</th>
                    <th>Status</th>
                    <th>Spent</th>
                    <th>ROI</th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row) => (
                    <tr key={row.campaign}>
                      <td>{row.campaign}</td>
                      <td>{row.channel}</td>
                      <td>{row.status}</td>
                      <td>{row.spent}</td>
                      <td>{row.roi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <article className="panel">
            <div className="panel-head">
              <h2>Recent Activity</h2>
            </div>
            <ul className="activity-list">
              {activities.map((item) => (
                <li key={item.title}>
                  <span className={`dot ${item.color}`} />
                  <div>
                    <p>{item.title}</p>
                    <small>{item.time}</small>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        </section>
      </main>
    </div>
  )
}

export default App
