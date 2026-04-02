function Topbar({ title, subtitle, searchPlaceholder, actionLabel, onMenuClick }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="menu-hamburger"
          onClick={onMenuClick}
          aria-label="Toggle menu"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path
              d="M3 6h16M3 11h16M3 16h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </div>
      <div className="topbar-actions">
        <input type="text" placeholder={searchPlaceholder} />
        <button className="primary-btn">{actionLabel}</button>
      </div>
    </header>
  )
}

export default Topbar
