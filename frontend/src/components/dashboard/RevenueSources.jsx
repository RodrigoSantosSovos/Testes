function ErrorsByDocType({ data }) {
  if (!data || !data.length) return null
  const maxCount = Math.max(...data.map((d) => d.count))

  return (
    <div className="progress-list">
      {data.map((item) => (
        <div key={item.docType}>
          <div className="error-doctype-row">
            <p>{item.docType}</p>
            <span className="error-count">{item.count}</span>
          </div>
          <div className="progress-bar">
            <span style={{ width: `${(item.count / maxCount) * 100}%`, background: 'linear-gradient(90deg, var(--danger), #ff7b8a)' }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default ErrorsByDocType
