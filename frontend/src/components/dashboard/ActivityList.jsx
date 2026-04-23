function RecentErrors({ data }) {
  if (!data || !data.length) return null

  return (
    <ul className="activity-list">
      {data.map((item) => (
        <li key={item.id}>
          <span className={`dot ${item.severity}`} />
          <div>
            <p><strong>{item.company}</strong> — {item.docType}</p>
            <small>{item.error}</small>
            <small className="error-time">{item.time}</small>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default RecentErrors
