function PerformanceChart() {
  return (
    <div className="chart-wrap">
      <svg viewBox="0 0 700 260" aria-label="Performance chart">
        <defs>
          <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#3699ff" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#3699ff" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path
          d="M40 210 C90 170, 150 180, 200 145 C250 110, 300 130, 350 95 C400 70, 450 90, 500 72 C550 58, 610 68, 660 35 L660 230 L40 230 Z"
          fill="url(#areaGradient)"
        />
        <polyline
          points="40,210 100,180 160,170 220,135 280,125 340,100 400,85 460,90 520,70 580,65 660,35"
          fill="none"
          stroke="#3699ff"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

export default PerformanceChart
