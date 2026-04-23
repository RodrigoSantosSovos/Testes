function ErrorsByCompany({ data, t }) {
  if (!data || !data.length) return null

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>{t.company}</th>
            <th>{t.totalErrors}</th>
            <th>NF-e</th>
            <th>CT-e</th>
            <th>{t.other}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.companyId}>
              <td className="td-name">{row.companyName}</td>
              <td><span className="badge danger">{row.total}</span></td>
              <td>{row.nfe || '—'}</td>
              <td>{row.cte || '—'}</td>
              <td>{row.other || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ErrorsByCompany
