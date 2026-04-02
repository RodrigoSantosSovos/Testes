import './App.css'
import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'
import Panel from './components/common/Panel'
import MetricGrid from './components/dashboard/MetricGrid'
import PerformanceChart from './components/dashboard/PerformanceChart'
import RevenueSources from './components/dashboard/RevenueSources'
import CampaignTable from './components/dashboard/CampaignTable'
import ActivityList from './components/dashboard/ActivityList'
import {
  activities,
  campaignRows,
  headerData,
  menuSections,
  metricCards,
  revenueSources,
} from './data/dashboardData'

function App() {
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

        <MetricGrid cards={metricCards} />

        <section className="content-grid">
          <Panel title="Performance Overview" large actionLabel="Export">
            <PerformanceChart />
          </Panel>

          <Panel title="Revenue Sources">
            <RevenueSources items={revenueSources} />
          </Panel>
        </section>

        <section className="content-grid">
          <Panel title="Campaign Performance" large>
            <CampaignTable rows={campaignRows} />
          </Panel>

          <Panel title="Recent Activity">
            <ActivityList items={activities} />
          </Panel>
        </section>
      </main>
    </div>
  )
}

export default App
