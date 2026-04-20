import { useState, useCallback, useMemo } from 'react'
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
import DocumentsPage from './pages/documents/DocumentsPage'
import PlaceholderPage from './pages/PlaceholderPage'
import './pages/PlaceholderPage.css'
import useDashboardData from './hooks/useDashboardData'
import useMenuItems from './hooks/useMenuItems'

function App() {
  const { t } = useI18n()
  const [user, setUser] = useState(null)

  const handleLogin = useCallback((userData) => setUser(userData), [])

  if (!user) {
    return <LoginPage onLogin={handleLogin} />
  }

  return <DashboardShell t={t} user={user} />
}

const PAGE_TITLES = {
  dashboard: (t) => ({ title: t.dashboard.title, subtitle: t.dashboard.subtitle }),
  crud: (t) => ({ title: t.crud.title, subtitle: t.crud.subtitle }),
  documents: (t) => ({ title: t.menu.documents, subtitle: t.docs.filtersTitle }),
}

function DashboardShell({ t, user }) {
  const {
    metricCards,
    revenueSources,
    campaignRows,
    activities,
  } = useDashboardData()

  const menuItems = useMenuItems(user.permissions || [])

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

  const pageMeta = useMemo(() => {
    const getter = PAGE_TITLES[page]
    if (getter) return getter(t)
    const label = findPageLabel(menuItems, page)
    return { title: label || page, subtitle: '' }
  }, [page, t, menuItems])

  return (
    <div className={shellClass}>
      <Sidebar
        menuItems={menuItems}
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
          title={pageMeta.title}
          subtitle={pageMeta.subtitle}
          searchPlaceholder={t.topbar.search}
          actionLabel={page === 'crud' ? t.topbar.newRecord : ''}
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

        {page === 'documents' && <DocumentsPage />}

        {page !== 'dashboard' && page !== 'crud' && page !== 'documents' && (
          <PlaceholderPage
            title={pageMeta.title}
            description={t.placeholder?.comingSoon || 'Esta página será implementada em breve.'}
            icon={
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            }
          />
        )}

        <footer className="app-footer">
          © {new Date().getFullYear()} Sovos. {t.footer.rights}
        </footer>
      </main>
    </div>
  )
}

function findPageLabel(items, page) {
  for (const item of items) {
    if (item.page === page) return item.label
    if (item.children) {
      const child = item.children.find((c) => c.page === page)
      if (child) return child.label
    }
  }
  return null
}

export default App
