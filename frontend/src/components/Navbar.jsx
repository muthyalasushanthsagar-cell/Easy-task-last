import React from 'react';
import { Menu, Plus, User } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';

export default function Navbar({ onToggleSidebar, onOpenNewTaskModal }) {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          className="menu-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle Navigation Menu"
        >
          <Menu size={22} />
        </button>
      </div>

      <div className="navbar-right">
        <button
          className="btn btn-primary btn-sm"
          onClick={onOpenNewTaskModal}
          style={{ gap: 6 }}
        >
          <Plus size={16} />
          <span>New Task</span>
        </button>

        <NotificationDropdown />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            paddingLeft: 8,
            borderLeft: '1px solid #e2e8f0',
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              backgroundColor: '#e0e7ff',
              color: '#4338ca',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.85rem',
            }}
          >
            ET
          </div>
          <span
            style={{
              fontSize: '0.88rem',
              fontWeight: 600,
              color: '#334155',
              display: 'none',
            }}
            className="user-name-label"
          >
            My Workspace
          </span>
        </div>
      </div>
    </header>
  );
}
