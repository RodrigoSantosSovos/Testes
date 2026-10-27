function PerformanceChart({ data, t }) {
  if (!data || !data.length) return null
  const maxVal = Math.max(...data.map((d) => d.success + d.error)) * 1.15
  const barW = 700 / data.length
  const scale = (v) => 220 - (v / maxVal) * 200

  return (
    <div className="chart-wrap">
      <svg viewBox="0 0 700 260" aria-label="Documents per day">
        {data.map((d, i) => {
          const x = i * barW + barW * 0.15
          const w = barW * 0.35
          const sH = 220 - scale(d.success)
          const eH = 220 - scale(d.error)
          return (
            <g key={d.date}>
              <rect x={x} y={scale(d.success)} width={w} height={sH} rx="3" fill="var(--success)" opacity="0.8" />
              <rect x={x + w + 2} y={scale(d.error)} width={w} height={eH} rx="3" fill="var(--danger)" opacity="0.8" />
              <text x={x + w} y="248" textAnchor="middle" fill="var(--muted-text)" fontSize="10">
                {d.date.slice(5)}
              </text>
            </g>
          )
        })}
        <line x1="0" y1="220" x2="700" y2="220" stroke="var(--panel-border)" strokeWidth="1" />
      </svg>
      <div className="chart-legend">
        <span className="chart-legend-item"><span className="chart-dot" style={{ background: 'var(--success)' }} />{t.success}</span>
        <span className="chart-legend-item"><span className="chart-dot" style={{ background: 'var(--danger)' }} />{t.errors}</span>
      </div>
    </div>
  )
}

export default PerformanceChart
