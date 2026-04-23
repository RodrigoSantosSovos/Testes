import MetricCard from './MetricCard'

function MetricGrid({ metrics }) {
  return (
    <section className="metric-grid">
      {metrics.map((card) => (
        <MetricCard key={card.title} {...card} />
      ))}
    </section>
  )
}

export default MetricGrid
