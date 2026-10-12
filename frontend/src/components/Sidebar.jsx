import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  CalendarClock,
  CheckCircle2,
  ShoppingCart,
  Settings,
  X,
  Sparkles,
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose, stats }) {
  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/tasks', label: 'All Tasks', icon: CheckSquare, badge: stats?.pendingTasks },
    { to: '/today', label: "Today's Tasks", icon: Calendar, badge: stats?.todayTasks },
    { to: '/upcoming', label: 'Upcoming', icon: CalendarClock },
    { to: '/completed', label: 'Completed', icon: CheckCircle2 },
  ];

  const secondaryItems = [
    { to: '/grocery', label: 'Grocery & Lists', icon: ShoppingCart },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <NavLink to="/" className="app-brand" onClick={onClose}>
            <div className="app-logo-icon">
              <Sparkles size={20} />
            </div>
            <div className="app-brand-text">
              Easy<span>Task</span>
            </div>
          </NavLink>
          <button
            className="menu-toggle-btn"
            onClick={onClose}
            aria-label="Close Navigation Menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-title">TASKS</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <div className="nav-item-content">
                  <Icon size={18} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="nav-badge">{item.badge}</span>
                )}
              </NavLink>
            );
          })}

          <div className="nav-section-title" style={{ marginTop: 14 }}>
            EVERYDAY & TOOLS
          </div>
          {secondaryItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <div className="nav-item-content">
                  <Icon size={18} />
                  <span>{item.label}</span>
                </div>
              </NavLink>
            );
          })}
        </nav>

        {stats && (
          <div className="sidebar-footer">
            <div className="quick-stats-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b' }}>
                  Progress Today
                </span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4f46e5' }}>
                  {stats.completionRate || 0}%
                </span>
              </div>
              <div className="progress-container">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${Math.min(100, stats.completionRate || 0)}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
