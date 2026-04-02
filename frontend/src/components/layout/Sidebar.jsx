function Sidebar({ brand, sections, collapsed, onToggle }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand">{brand}</div>
        <button
          className="sidebar-toggle"
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            {collapsed ? (
              <path
                d="M7 4l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : (
              <path
                d="M13 4l-6 6 6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </svg>
        </button>
      </div>

      <div className="sidebar-nav">
        {sections.map((section) => (
          <nav className="menu" key={section.title}>
            <p className="menu-title">{section.title}</p>
            {section.items.map((item) => (
              <button
                key={item.label}
                className={`menu-item ${item.active ? 'active' : ''}`.trim()}
                title={collapsed ? item.label : undefined}
              >
                {item.label}
              </button>
            ))}
          </nav>
        ))}
      </div>
    </aside>
  )
}

export default Sidebar
