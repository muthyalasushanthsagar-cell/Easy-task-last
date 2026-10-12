import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, Clock, AlertTriangle, Info, CheckCheck } from 'lucide-react';
import { notificationApi } from '../services/api';

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const data = await notificationApi.getAll();
      setNotifications(data);
      const unread = data.filter((n) => !n.read).length;
      setUnreadCount(unread);

      // Trigger browser notification for latest unread reminder if permission granted
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        const latestUnreadReminder = data.find((n) => !n.read && n.type === 'REMINDER');
        if (latestUnreadReminder && !sessionStorage.getItem(`notified_${latestUnreadReminder.id}`)) {
          sessionStorage.setItem(`notified_${latestUnreadReminder.id}`, 'true');
          new window.Notification(latestUnreadReminder.title, {
            body: latestUnreadReminder.message,
            icon: '/vite.svg',
          });
        }
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll notifications every 20 seconds for real-time reminders
    const interval = setInterval(fetchNotifications, 20000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation();
    try {
      await notificationApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' · ' + date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="notification-container" ref={dropdownRef}>
      <button
        className="notification-bell-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="Notifications & Reminders"
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && <span className="unread-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-dropdown-header">
            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>
              Notifications ({unreadCount} new)
            </span>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#4f46e5',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <CheckCheck size={14} /> Mark all read
              </button>
            )}
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div style={{ padding: '24px 18px', textAlign: 'center', color: '#94a3b8', fontSize: '0.88rem' }}>
                No notifications right now
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`notification-item ${!n.read ? 'unread' : ''}`}
                  onClick={() => !n.read && handleMarkAsRead(n.id, { stopPropagation: () => {} })}
                >
                  <div className="notification-item-icon">
                    {n.type === 'OVERDUE' ? (
                      <AlertTriangle size={18} color="#ef4444" />
                    ) : n.type === 'REMINDER' ? (
                      <Bell size={18} color="#4f46e5" />
                    ) : (
                      <Info size={18} color="#0891b2" />
                    )}
                  </div>
                  <div className="notification-item-body">
                    <div className="notification-item-title">{n.title}</div>
                    <div className="notification-item-message">{n.message}</div>
                    <div className="notification-item-time">{formatTime(n.createdAt)}</div>
                  </div>
                  {!n.read && (
                    <button
                      className="btn-icon"
                      onClick={(e) => handleMarkAsRead(n.id, e)}
                      title="Mark as read"
                      style={{ padding: 4, height: 26, width: 26, alignSelf: 'center' }}
                    >
                      <Check size={14} color="#64748b" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
