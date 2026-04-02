import MetricCard from './MetricCard'

function MetricGrid({ metrics }) {
  return (
    <section className="metric-grid">
      {metrics.map((metric) => (
        <MetricCard key={metric.title} metric={metric} />
      ))}
    </section>
  )
}

export default MetricGrid
