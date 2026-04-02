function MetricCard({ title, value, delta, tone }) {
  return (
    <article className="metric-card">
      <p>{title}</p>
      <h3>{value}</h3>
      <span className={`badge ${tone}`}>{delta}</span>
    </article>
  )
}

export default MetricCard
