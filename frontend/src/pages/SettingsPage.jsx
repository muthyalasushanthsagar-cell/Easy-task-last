import React, { useState, useEffect } from 'react';
import {
  Settings,
  Bell,
  User,
  ShieldCheck,
  CheckCircle2,
  Database,
  ExternalLink,
  Laptop,
} from 'lucide-react';
import { dashboardApi } from '../services/api';

export default function SettingsPage({ showToast }) {
  const [name, setName] = useState(localStorage.getItem('et_user_name') || 'Sushanth Sagar');
  const [email, setEmail] = useState(localStorage.getItem('et_user_email') || 'user@easytask.local');
  const [defaultReminder, setDefaultReminder] = useState(localStorage.getItem('et_default_reminder') || '15');
  const [browserPermission, setBrowserPermission] = useState('default');
  const [backendStatus, setBackendStatus] = useState('checking');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setBrowserPermission(window.Notification.permission);
    }

    dashboardApi
      .getSummary()
      .then(() => setBackendStatus('connected'))
      .catch(() => setBackendStatus('error'));
  }, []);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    localStorage.setItem('et_user_name', name);
    localStorage.setItem('et_user_email', email);
    localStorage.setItem('et_default_reminder', defaultReminder);
    showToast('Preferences saved successfully!', 'success');
  };

  const handleRequestNotification = async () => {
    if (!('Notification' in window)) {
      showToast('This browser does not support desktop notifications.', 'error');
      return;
    }
    const permission = await window.Notification.requestPermission();
    setBrowserPermission(permission);
    if (permission === 'granted') {
      showToast('Browser notifications enabled!', 'success');
      new window.Notification('Easy Task Notifications Active', {
        body: 'You will receive reminders when tasks and deadlines are approaching.',
      });
    } else {
      showToast('Notification permission was ' + permission, 'error');
    }
  };

  const handleTestNotification = () => {
    if (browserPermission !== 'granted') {
      handleRequestNotification();
      return;
    }
    new window.Notification('Easy Task - Reminder Demo', {
      body: 'Upcoming Task: Review Q3 Project Deliverables [High Priority] due in 15 minutes!',
    });
    showToast('Test notification sent to your system tray / banner!', 'success');
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Settings size={26} color="#4f46e5" />
            Application Settings & Preferences
          </h1>
          <p className="page-subtitle">
            Configure your workspace, reminders, notifications, and profile details.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24 }}>
        {/* Profile Details */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                backgroundColor: '#e0e7ff',
                color: '#4338ca',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <User size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>User Profile</h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Personalize your Easy Task experience</p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Default Advance Reminder</label>
              <select
                className="form-select"
                value={defaultReminder}
                onChange={(e) => setDefaultReminder(e.target.value)}
              >
                <option value="5">5 minutes before</option>
                <option value="15">15 minutes before</option>
                <option value="30">30 minutes before</option>
                <option value="60">1 hour before</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary btn-sm" style={{ marginTop: 8 }}>
              Save Profile
            </button>
          </form>
        </div>

        {/* Notifications & System */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                backgroundColor: '#fef3c7',
                color: '#d97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Bell size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Notifications & Reminders</h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Configure desktop and browser alerts</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div
              style={{
                padding: '12px 14px',
                borderRadius: '8px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>Browser Notification Status</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  Current status: <strong style={{ textTransform: 'capitalize' }}>{browserPermission}</strong>
                </div>
              </div>

              {browserPermission !== 'granted' ? (
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={handleRequestNotification}
                >
                  Enable
                </button>
              ) : (
                <span className="badge badge-status-COMPLETED">Enabled</span>
              )}
            </div>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleTestNotification}
              style={{ gap: 6 }}
            >
              <Bell size={14} />
              Send Test Desktop Notification
            </button>

            <div
              style={{
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: '#f0f9ff',
                border: '1px solid #bae6fd',
                fontSize: '0.82rem',
                color: '#0369a1',
                lineHeight: 1.45,
              }}
            >
              <strong>Technical Note:</strong> Browser Notifications run in active browser tabs and Windows notification centers. For background delivery when the browser is completely closed, a Progressive Web App (PWA) with a Web Push Service worker and external messaging server (e.g. Firebase Cloud Messaging / VAPID) is recommended in production.
            </div>
          </div>
        </div>

        {/* Backend & Database Health */}
        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                backgroundColor: '#dcfce7',
                color: '#15803d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Database size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Backend & Database Integration</h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Live Spring Boot REST API connectivity</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: backendStatus === 'connected' ? '#10b981' : '#ef4444',
                }}
              />
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                {backendStatus === 'connected' ? 'Spring Boot REST API Online' : 'Connecting to API...'}
              </span>
            </div>

            <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Base URL: <code>{import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}</code>
            </span>

            <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Database: <strong>MySQL Server (Primary) / H2 File Fallback</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
