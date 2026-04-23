import { useState, useCallback } from 'react'

const SEMAPHORE = ['⏳', '✅', '❌']
const SEMAPHORE_CLASS = ['warning', 'success', 'danger']

function ResultsTable({ data, t, onOpenDetail, actionOptions, onBatchAction, onExport }) {
  const d = t.docs
  const [selected, setSelected] = useState([])

  const toggleAll = useCallback(() => {
    if (!data) return
    setSelected((prev) => prev.length === data.rows.length ? [] : data.rows.map((r) => r.id))
  }, [data])

  const toggleOne = useCallback((id) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  }, [])

  if (!data) return null

  if (data.rows.length === 0) {
    return <p className="doc-no-results">{d.noResults}</p>
  }

  return (
    <div className="doc-results">
      <div className="doc-results-header">
        <h3>{d.results} ({data.totalRecords})</h3>
        <div className="doc-results-actions">
          {actionOptions.length > 0 && (
            <div className="doc-batch-dropdown">
              <button
                type="button"
                className="ghost-btn"
                disabled={selected.length === 0}
                onClick={(e) => {
                  const menu = e.currentTarget.nextElementSibling
                  menu.classList.toggle('open')
                }}
              >
                {d.batchActions} ({selected.length}) ▾
              </button>
              <ul className="doc-batch-menu">
                {actionOptions.map((a) => (
                  <li key={a.value}>
                    <button onClick={() => { onBatchAction(selected, a.value); setSelected([]) }}>
                      {t.docActions?.[a.labelKey] || a.value}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button type="button" className="ghost-btn" onClick={onExport}>
            {d.exportExcel}
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th className="th-check">
                <input
                  type="checkbox"
                  checked={selected.length === data.rows.length && data.rows.length > 0}
                  onChange={toggleAll}
                />
              </th>
              {data.columns.map((col) => (
                <th key={col.tag}>{col.label || t.docFilters?.[col.labelKey] || col.labelKey}</th>
              ))}
              <th>Status</th>
              <th className="th-sem" />
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row) => (
              <tr key={row.id} className={selected.includes(row.id) ? 'row-selected' : ''}>
                <td className="td-check" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selected.includes(row.id)}
                    onChange={() => toggleOne(row.id)}
                  />
                </td>
                {data.columns.map((col) => (
                  <td key={col.tag} onClick={() => onOpenDetail(row.id)} className="td-clickable">
                    {row[col.tag] ?? '—'}
                  </td>
                ))}
                <td onClick={() => onOpenDetail(row.id)} className="td-clickable">{row.statusDescription}</td>
                <td onClick={() => onOpenDetail(row.id)} className="td-clickable td-sem">
                  <span className={`sem sem-${SEMAPHORE_CLASS[row.semaphore]}`}>
                    {SEMAPHORE[row.semaphore]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ResultsTable
