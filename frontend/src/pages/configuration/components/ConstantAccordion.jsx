import { useState } from 'react'
import ConstantField from './ConstantField'

function ConstantAccordion({ categories, onConstantChange, onSaveIndividual, t }) {
  const [collapsed, setCollapsed] = useState({})

  const toggle = (cat) => {
    setCollapsed((prev) => ({ ...prev, [cat]: !prev[cat] }))
  }

  const categoryNames = Object.keys(categories).sort()

  return (
    <div className="cfg-accordion">
      {categoryNames.map((cat) => {
        const isOpen = !collapsed[cat]
        const constants = categories[cat].sort((a, b) => a.constantName.localeCompare(b.constantName))

        return (
          <div key={cat} className="cfg-accordion-panel">
            <button
              type="button"
              className={`cfg-accordion-header ${isOpen ? 'open' : ''}`}
              onClick={() => toggle(cat)}
            >
              <span className="cfg-accordion-title">{cat}</span>
              <span className="cfg-accordion-count">{constants.length}</span>
              <svg className={`cfg-accordion-chevron ${isOpen ? 'open' : ''}`} width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M5 6l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>

            {isOpen && (
              <div className="cfg-accordion-body">
                <table>
                  <thead>
                    <tr>
                      <th>{t.config.constantName}</th>
                      <th>{t.config.value}</th>
                      <th className="cfg-th-action" />
                    </tr>
                  </thead>
                  <tbody>
                    {constants.map((c) => (
                      <ConstantField
                        key={c.constantName}
                        constant={c}
                        onChange={onConstantChange}
                        onSaveIndividual={onSaveIndividual}
                        t={t}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default ConstantAccordion
