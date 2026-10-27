function Topbar({ title, subtitle, searchPlaceholder, actionLabel }) {
  return (
    <header className="topbar">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="topbar-actions">
        <input type="text" placeholder={searchPlaceholder} />
        <button className="primary-btn">{actionLabel}</button>
      </div>
    </header>
  )
}

export default Topbar
