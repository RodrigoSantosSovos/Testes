import { useCallback } from 'react'

function ConstantField({ constant, onChange, onSaveIndividual, t }) {
  const handleChange = useCallback((newValue) => {
    onChange(constant.constantName, newValue)
  }, [constant.constantName, onChange])

  const isBool = constant.constantType === 'Boolean' || constant.constantType === 'TF.Integration.Types.Boolean'
  const isPassword = constant.constantType === 'Password' || constant.constantType === 'EncryptedPassword'

  return (
    <tr className="cfg-constant-row">
      <td className="cfg-constant-name">
        <code>{constant.constantName}</code>
      </td>
      <td className="cfg-constant-value">
        {isBool ? (
          <label className="cfg-checkbox">
            <input
              type="checkbox"
              checked={constant.constantValue === 'true' || constant.constantValue === 'True'}
              onChange={(e) => handleChange(e.target.checked.toString())}
            />
            <span>{constant.constantValue === 'true' || constant.constantValue === 'True' ? 'true' : 'false'}</span>
          </label>
        ) : isPassword ? (
          <input
            type="password"
            value={constant.constantValue}
            onChange={(e) => handleChange(e.target.value)}
            className="cfg-input cfg-input-password"
          />
        ) : (
          <input
            type="text"
            value={constant.constantValue}
            onChange={(e) => handleChange(e.target.value)}
            className="cfg-input"
          />
        )}
      </td>
      <td className="cfg-constant-actions">
        <button
          type="button"
          className="cfg-save-individual"
          onClick={() => onSaveIndividual(constant)}
          title={t.config.saveIndividual}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2"/><path d="M17 21v-8H7v8M7 3v5h8" stroke="currentColor" strokeWidth="2"/></svg>
        </button>
      </td>
    </tr>
  )
}

export default ConstantField
