import { useState } from 'react'
import SovosLogo from '../common/SovosLogo'
import MenuIcon from '../common/MenuIcon'

function Sidebar({ menuItems, collapsed, onToggle, activePage, onNavigate }) {
  const [expanded, setExpanded] = useState({})

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const isActive = (item) => {
    if (item.page === activePage) return true
    if (item.children) return item.children.some((c) => c.page === activePage)
    return false
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand">
          <SovosLogo width={110} />
        </div>
        <button
          className="sidebar-toggle"
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            {collapsed ? (
              <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            ) : (
              <path d="M13 4l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            )}
          </svg>
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const hasChildren = item.children && item.children.length > 0
          const isOpen = expanded[item.id]
          const active = isActive(item)

          return (
            <div key={item.id} className="menu-group">
              <button
                className={[
                  'menu-item',
                  active ? 'active' : '',
                  item.disabled ? 'disabled' : '',
                ].filter(Boolean).join(' ')}
                title={collapsed ? item.label : undefined}
                onClick={() => {
                  if (item.disabled) return
                  if (hasChildren) {
                    toggleExpand(item.id)
                  } else if (item.page) {
                    onNavigate(item.page)
                  }
                }}
              >
                <MenuIcon name={item.icon} />
                <span className="menu-item-label">{item.label}</span>
                {hasChildren && !collapsed && (
                  <svg className={`menu-chevron ${isOpen ? 'open' : ''}`} width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M5 6l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                )}
              </button>

              {hasChildren && isOpen && !collapsed && (
                <div className="sub-menu">
                  {item.children.map((child) => (
                    <button
                      key={child.id}
                      className={`sub-menu-item ${child.page === activePage ? 'active' : ''}`}
                      onClick={() => onNavigate(child.page)}
                    >
                      {child.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar
