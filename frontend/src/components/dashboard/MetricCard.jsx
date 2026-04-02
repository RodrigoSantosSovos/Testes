function MetricCard({ metric }) {
  const { title, value, delta, tone } = metric

  return (
    <article className="metric-card">
      <p>{title}</p>
      <h3>{value}</h3>
      <span className={`badge ${tone}`}>{delta}</span>
    </article>
  )
}

export default MetricCard
