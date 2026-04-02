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

  return (
    <div className="app-shell">
      <Sidebar brand="Metronic Style" sections={menuSections} />

      <main className="main-content">
        <Topbar
          title={headerData.title}
          subtitle={headerData.subtitle}
          searchPlaceholder={headerData.searchPlaceholder}
          actionLabel={headerData.primaryActionLabel}
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
