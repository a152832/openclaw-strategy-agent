import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'

const NavIcons = {
  dashboard: (
    <svg
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={1.8}
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <rect x='3' y='3' width='7' height='7' rx='1.5' />
      <rect x='14' y='3' width='7' height='7' rx='1.5' />
      <rect x='14' y='14' width='7' height='7' rx='1.5' />
      <rect x='3' y='14' width='7' height='7' rx='1.5' />
    </svg>
  ),
  analysis: (
    <svg
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={1.8}
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <polyline points='22 12 18 12 15 21 9 3 6 12 2 12' />
    </svg>
  ),
  settings: (
    <svg
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={1.8}
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <circle cx='12' cy='12' r='3' />
      <path d='M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z' />
    </svg>
  )
}

const navItems = [
  { to: '/', label: '总览', icon: NavIcons.dashboard, end: true },
  { to: '/analysis', label: 'AI 策略对话', icon: NavIcons.analysis },
  { to: '/settings', label: '设置', icon: NavIcons.settings }
]

export default function Layout() {
  return (
    <div className='layout'>
      {/* Desktop Sidebar */}
      <aside className='sidebar'>
        <div className='sidebar-logo'>
          <h1>⚡ OpenClaw</h1>
          <p>Crypto Strategy Agent</p>
        </div>
        <nav className='sidebar-nav'>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div
          style={{ padding: '16px 20px', borderTop: '1px solid var(--border)' }}
        >
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            数据源: Binance 公开行情
          </div>
          <div
            style={{
              fontSize: '0.7rem',
              color: 'var(--text-muted)',
              marginTop: 4
            }}
          >
            v1.0.0 Phase 1
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className='main-content'>
        <header className='top-header'>
          <div style={{ flex: 1, fontWeight: 600, fontSize: '0.95rem' }}>
            ⚡ OpenClaw Strategy Agent
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <span className='badge badge-buy' style={{ fontSize: '0.65rem' }}>
              ● 实时
            </span>
          </div>
        </header>

        <main className='page-content fade-in'>
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className='bottom-nav'>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
