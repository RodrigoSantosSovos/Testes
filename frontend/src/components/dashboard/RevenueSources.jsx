function RevenueSources({ items }) {
  return (
    <div className="progress-list">
      {items.map((source) => (
        <div key={source.name}>
          <p>{source.name}</p>
          <div className="progress-bar">
            <span style={{ width: source.value }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default RevenueSources
