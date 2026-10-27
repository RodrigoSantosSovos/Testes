import MetricCard from './MetricCard'

function MetricGrid({ cards }) {
  return (
    <section className="metric-grid">
      {cards.map((card) => (
        <MetricCard key={card.title} {...card} />
      ))}
    </section>
  )
}

export default MetricGrid
