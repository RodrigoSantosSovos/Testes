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
import CrudDemo from './pages/CrudDemo'
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

  const pageTitle = page === 'crud' ? 'CRUD Demo' : headerData.title
  const pageSubtitle =
    page === 'crud'
      ? 'Demonstração de formulários, tabelas, botões, cards e demais componentes.'
      : headerData.subtitle

  return (
    <div className={shellClass}>
      <Sidebar
        brand="Metronic Style"
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
          actionLabel={page === 'crud' ? 'Novo Registro' : headerData.primaryActionLabel}
          onMenuClick={toggleMobileOpen}
        />

        {page === 'dashboard' && (
          <>
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
          </>
        )}

        {page === 'crud' && <CrudDemo />}
      </main>
    </div>
  )
}

export default App
