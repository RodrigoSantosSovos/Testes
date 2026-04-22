function TopDocTypesTable({ data, t }) {
  if (!data || !data.length) return null

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>{t.docType}</th>
            <th>{t.processed}</th>
            <th>{t.successCol}</th>
            <th>{t.errorsCol}</th>
            <th>{t.rate}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.docType}>
              <td className="td-name">{row.docType}</td>
              <td>{row.processed.toLocaleString()}</td>
              <td style={{ color: 'var(--success)' }}>{row.success.toLocaleString()}</td>
              <td style={{ color: 'var(--danger)' }}>{row.error.toLocaleString()}</td>
              <td>
                <span className={`badge ${row.rate >= 97 ? 'success' : row.rate >= 95 ? 'warning' : 'danger'}`}>
                  {row.rate}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TopDocTypesTable
