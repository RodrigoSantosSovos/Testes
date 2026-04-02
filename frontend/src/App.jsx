import { useState, useCallback } from 'react'
import './App.css'
import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'
import Panel from './components/common/Panel'
import MetricGrid from './components/dashboard/MetricGrid'
import PerformanceChart from './components/dashboard/PerformanceChart'
import RevenueSources from './components/dashboard/RevenueSources'
import CampaignTable from './components/dashboard/CampaignTable'
import ActivityList from './components/dashboard/ActivityList'
import useDashboardData from './hooks/useDashboardData'

function App() {
  const {
    menuSections,
    headerData,
    metricCards,
    revenueSources,
    campaignRows,
    activities,
  } = useDashboardData()

  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const toggleCollapsed = useCallback(() => setCollapsed((v) => !v), [])
  const toggleMobileOpen = useCallback(() => setMobileOpen((v) => !v), [])
  const closeMobile = useCallback(() => setMobileOpen(false), [])

  const shellClass = [
    'app-shell',
    collapsed ? 'sidebar-collapsed' : '',
    mobileOpen ? 'sidebar-mobile-open' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={shellClass}>
      <Sidebar
        brand="Metronic Style"
        sections={menuSections}
        collapsed={collapsed}
        onToggle={toggleCollapsed}
      />

      {mobileOpen && (
        <div className="sidebar-backdrop" onClick={closeMobile} />
      )}

      <main className="main-content">
        <Topbar
          title={headerData.title}
          subtitle={headerData.subtitle}
          searchPlaceholder={headerData.searchPlaceholder}
          actionLabel={headerData.primaryActionLabel}
          onMenuClick={toggleMobileOpen}
        />

        <MetricGrid metrics={metricCards} />

        <section className="content-grid">
          <Panel
            title="Performance Overview"
            className="panel-large"
            action={<button className="ghost-btn">Export</button>}
          >
            <PerformanceChart />
          </Panel>

          <Panel title="Revenue Sources">
            <RevenueSources sources={revenueSources} />
          </Panel>
        </section>

        <section className="content-grid">
          <Panel title="Campaign Performance" className="panel-large">
            <CampaignTable rows={campaignRows} />
          </Panel>

          <Panel title="Recent Activity">
            <ActivityList activities={activities} />
          </Panel>
        </section>
      </main>
    </div>
  )
}

export default App
