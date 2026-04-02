function RevenueSources({ sources }) {
  return (
    <div className="progress-list">
      {sources.map((source) => (
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
