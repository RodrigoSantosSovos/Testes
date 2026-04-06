import { useState, useCallback } from 'react'
import './App.css'
import { useI18n } from './i18n/useI18n'
import LoginPage from './pages/LoginPage'
import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'
import Panel from './components/common/Panel'
import MetricGrid from './components/dashboard/MetricGrid'
import PerformanceChart from './components/dashboard/PerformanceChart'
import RevenueSources from './components/dashboard/RevenueSources'
import CampaignTable from './components/dashboard/CampaignTable'
import ActivityList from './components/dashboard/ActivityList'
import CrudDemo from './pages/CrudDemo'
import useDashboardData from './hooks/useDashboardData'

function App() {
  const { t } = useI18n()
  const [user, setUser] = useState(null)

  const handleLogin = useCallback((username) => setUser(username), [])

  if (!user) {
    return <LoginPage onLogin={handleLogin} />
  }

  return <DashboardShell t={t} user={user} />
}

function DashboardShell({ t }) {
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
  const [page, setPage] = useState('dashboard')

  const toggleCollapsed = useCallback(() => setCollapsed((v) => !v), [])
  const toggleMobileOpen = useCallback(() => setMobileOpen((v) => !v), [])
  const closeMobile = useCallback(() => setMobileOpen(false), [])
  const navigate = useCallback((p) => {
    setPage(p)
    setMobileOpen(false)
  }, [])

  const shellClass = [
    'app-shell',
    collapsed ? 'sidebar-collapsed' : '',
    mobileOpen ? 'sidebar-mobile-open' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const pageTitle = page === 'crud' ? t.crud.title : headerData.title
  const pageSubtitle = page === 'crud' ? t.crud.subtitle : headerData.subtitle

  return (
    <div className={shellClass}>
      <Sidebar
        sections={menuSections}
        collapsed={collapsed}
        onToggle={toggleCollapsed}
        activePage={page}
        onNavigate={navigate}
      />

      {mobileOpen && (
        <div className="sidebar-backdrop" onClick={closeMobile} />
      )}

      <main className="main-content">
        <Topbar
          title={pageTitle}
          subtitle={pageSubtitle}
          searchPlaceholder={headerData.searchPlaceholder}
          actionLabel={page === 'crud' ? t.topbar.newRecord : headerData.primaryActionLabel}
          onMenuClick={toggleMobileOpen}
        />

        {page === 'dashboard' && (
          <>
            <MetricGrid metrics={metricCards} />

            <section className="content-grid">
              <Panel
                title={t.dashboard.performanceOverview}
                className="panel-large"
                action={<button className="ghost-btn">{t.dashboard.export}</button>}
              >
                <PerformanceChart />
              </Panel>

              <Panel title={t.dashboard.revenueSources}>
                <RevenueSources sources={revenueSources} />
              </Panel>
            </section>

            <section className="content-grid">
              <Panel title={t.dashboard.campaignPerformance} className="panel-large">
                <CampaignTable rows={campaignRows} />
              </Panel>

              <Panel title={t.dashboard.recentActivity}>
                <ActivityList activities={activities} />
              </Panel>
            </section>
          </>
        )}

        {page === 'crud' && <CrudDemo />}
      </main>
    </div>
  )
}

export default App
