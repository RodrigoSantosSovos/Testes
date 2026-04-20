function ResultsTable({ results, t }) {
  const d = t.docs

  if (!results) return null

  if (results.length === 0) {
    return <p className="doc-no-results">{d.noResults}</p>
  }

  return (
    <div className="doc-results">
      <h3>{d.results} ({results.length})</h3>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>{d.documentType}</th>
              <th>{d.process}</th>
              <th>{d.situation}</th>
              <th>{d.createdAt}</th>
            </tr>
          </thead>
          <tbody>
            {results.map((row) => (
              <tr key={row.id}>
                <td className="td-name">{row.id}</td>
                <td>{row.documentType}</td>
                <td>{row.process}</td>
                <td>
                  <span className={`badge ${situationTone(row.situation)}`}>
                    {row.situation}
                  </span>
                </td>
                <td>{new Date(row.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function situationTone(s) {
  if (s.includes('Success')) return 'success'
  if (s.includes('Error')) return 'danger'
  return 'warning'
}

export default ResultsTable
