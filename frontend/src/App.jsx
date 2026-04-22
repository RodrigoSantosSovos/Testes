import { useState, useCallback, useMemo } from 'react'
import './App.css'
import { useI18n } from './i18n/useI18n'
import LoginPage from './pages/LoginPage'
import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'
import Panel from './components/common/Panel'
import MetricGrid from './components/dashboard/MetricGrid'
import PerformanceChart from './components/dashboard/PerformanceChart'
import ErrorsByDocType from './components/dashboard/RevenueSources'
import TopDocTypesTable from './components/dashboard/CampaignTable'
import RecentErrors from './components/dashboard/ActivityList'
import ErrorsByCompany from './components/dashboard/ErrorsByCompany'
import SuccessRateRing from './components/dashboard/SuccessRateRing'
import CrudDemo from './pages/CrudDemo'
import DocumentsPage from './pages/documents/DocumentsPage'
import GeneralConfigPage from './pages/configuration/GeneralConfigPage'
import RulePrintPage from './pages/configuration/RulePrintPage'
import RuleDistributionPage from './pages/configuration/RuleDistributionPage'
import PartnerPage from './pages/security/PartnerPage'
import CompanyPage from './pages/security/CompanyPage'
import UserPage from './pages/security/UserPage'
import BusinessGroupPage from './pages/security/BusinessGroupPage'
import IdocGeneratorPage from './pages/idoc/IdocGeneratorPage'
import UtilitySearchPage from './pages/utilities/UtilitySearchPage'
import UtilityExportPage from './pages/utilities/UtilityExportPage'
import UtilityCountryOpsPage from './pages/utilities/UtilityCountryOpsPage'
import UtilityQueuePage from './pages/utilities/UtilityQueuePage'
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
  dashboard: (t) => ({ title: t.dashboard?.title || 'Dashboard', subtitle: t.dashboard?.subtitle || '' }),
  crud: (t) => ({ title: t.crud.title, subtitle: t.crud.subtitle }),
  documents: (t) => ({ title: t.menu.documents, subtitle: t.docs.filtersTitle }),
  'config-general': (t) => ({ title: t.menu.configGeneral, subtitle: `${t.menu.configuration} > ${t.menu.configGeneral}` }),
  'config-rule-print': (t) => ({ title: t.menu.configRulePrint, subtitle: `${t.menu.configuration} > ${t.menu.configRulePrint}` }),
  'config-rule-distribution': (t) => ({ title: t.menu.configRuleDistribution, subtitle: `${t.menu.configuration} > ${t.menu.configRuleDistribution}` }),
  'sec-partner': (t) => ({ title: t.menu.secPartner, subtitle: `${t.menu.security} > ${t.menu.secPartner}` }),
  'sec-companies': (t) => ({ title: t.menu.secCompanies, subtitle: `${t.menu.security} > ${t.menu.secCompanies}` }),
  'sec-users': (t) => ({ title: t.menu.secUsers, subtitle: `${t.menu.security} > ${t.menu.secUsers}` }),
  'sec-business-group': (t) => ({ title: t.menu.secBusinessGroup, subtitle: `${t.menu.security} > ${t.menu.secBusinessGroup}` }),
  'idoc-generation': () => ({ title: 'Geração de IDoc', subtitle: 'Gerador e Editor de IDOC NFSe SAP' }),
  'util-search': (t) => ({ title: t.menu.utilSearch, subtitle: `${t.menu.utilities} > ${t.menu.utilSearch}` }),
  'util-export': (t) => ({ title: t.menu.utilExport, subtitle: `${t.menu.utilities} > ${t.menu.utilExport}` }),
  'util-country': (t) => ({ title: t.menu.utilCountry, subtitle: `${t.menu.utilities} > ${t.menu.utilCountry}` }),
  'util-queue': (t) => ({ title: t.menu.utilQueue, subtitle: `${t.menu.utilities} > ${t.menu.utilQueue}` }),
}

function DashboardShell({ t, user }) {
  const { data: dashData, loading: dashLoading } = useDashboardData()
  const d = t.dash

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

        {page === 'dashboard' && !dashLoading && dashData && (
          <>
            <MetricGrid metrics={[
              { title: d.totalProcessed, value: dashData.kpis.totalProcessed.toLocaleString(), delta: dashData.kpis.totalProcessedDelta, tone: 'primary' },
              { title: d.totalErrors, value: dashData.kpis.totalErrors.toLocaleString(), delta: dashData.kpis.totalErrorsDelta, tone: 'danger' },
              { title: d.successRate, value: `${dashData.kpis.successRate}%`, delta: dashData.kpis.successRateDelta, tone: 'success' },
              { title: d.avgTime, value: `${dashData.kpis.avgProcessingTime}s`, delta: dashData.kpis.avgProcessingTimeDelta, tone: 'warning' },
            ]} />
            <section className="content-grid">
              <Panel title={d.docsPerDay} className="panel-large">
                <PerformanceChart data={dashData.documentsPerDay} t={d} />
              </Panel>
              <Panel title={d.successRateTitle}>
                <SuccessRateRing rate={dashData.kpis.successRate} />
              </Panel>
            </section>
            <section className="content-grid">
              <Panel title={d.errorsByCompany} className="panel-large">
                <ErrorsByCompany data={dashData.errorsByCompany} t={d} />
              </Panel>
              <Panel title={d.errorsByDocType}>
                <ErrorsByDocType data={dashData.errorsByDocType} />
              </Panel>
            </section>
            <section className="content-grid">
              <Panel title={d.topDocTypes} className="panel-large">
                <TopDocTypesTable data={dashData.topDocumentTypes} t={d} />
              </Panel>
              <Panel title={d.recentErrors}>
                <RecentErrors data={dashData.recentErrors} />
              </Panel>
            </section>
          </>
        )}

        {page === 'crud' && <CrudDemo />}

        {page === 'documents' && <DocumentsPage userPermissions={user.permissions} />}

        {page === 'config-general' && <GeneralConfigPage />}

        {page === 'config-rule-print' && <RulePrintPage />}

        {page === 'config-rule-distribution' && <RuleDistributionPage />}

        {page === 'sec-partner' && <PartnerPage />}

        {page === 'sec-companies' && <CompanyPage />}

        {page === 'sec-users' && <UserPage />}

        {page === 'sec-business-group' && <BusinessGroupPage />}

        {page === 'idoc-generation' && <IdocGeneratorPage />}

        {page === 'util-search' && <UtilitySearchPage />}
        {page === 'util-export' && <UtilityExportPage />}
        {page === 'util-country' && <UtilityCountryOpsPage />}
        {page === 'util-queue' && <UtilityQueuePage />}

        {!['dashboard', 'crud', 'documents', 'config-general', 'config-rule-print', 'config-rule-distribution', 'sec-partner', 'sec-companies', 'sec-users', 'sec-business-group', 'idoc-generation', 'util-search', 'util-export', 'util-country', 'util-queue'].includes(page) && (
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
