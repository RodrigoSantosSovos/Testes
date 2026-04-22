function SuccessRateRing({ rate }) {
  const r = 54
  const circ = 2 * Math.PI * r
  const offset = circ - (rate / 100) * circ

  return (
    <div className="success-ring-wrap">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={r} fill="none" stroke="var(--ghost-bg)" strokeWidth="12" />
        <circle
          cx="70" cy="70" r={r} fill="none"
          stroke={rate >= 97 ? 'var(--success)' : rate >= 95 ? 'var(--warning)' : 'var(--danger)'}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform="rotate(-90 70 70)"
        />
        <text x="70" y="66" textAnchor="middle" fontSize="28" fontWeight="700" fill="var(--heading-color)">
          {rate}%
        </text>
        <text x="70" y="86" textAnchor="middle" fontSize="11" fill="var(--muted-text)">
          Success
        </text>
      </svg>
    </div>
  )
}

export default SuccessRateRing
