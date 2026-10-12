import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  Flame,
  TrendingUp,
  ArrowRight,
  ListTodo,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { dashboardApi, taskApi } from '../services/api';
import TaskCard from '../components/TaskCard';
import QuickAddTask from '../components/QuickAddTask';

export default function DashboardPage({
  onOpenEditModal,
  onOpenDeleteModal,
  showToast,
  refreshTrigger,
  onTasksChanged,
}) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const data = await dashboardApi.getSummary();
      setSummary(data);
    } catch (err) {
      showToast(err.message || 'Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [refreshTrigger]);

  const handleToggleComplete = async (task) => {
    try {
      if (task.status === 'COMPLETED') {
        await taskApi.reopen(task.id);
        showToast(`Task reopened: "${task.title}"`, 'success');
      } else {
        await taskApi.complete(task.id);
        showToast(`Task completed! Great job.`, 'success');
      }
      onTasksChanged();
    } catch (err) {
      showToast(err.message || 'Failed to update task', 'error');
    }
  };

  const handleQuickAdd = async (payload) => {
    try {
      await taskApi.create(payload);
      showToast('Task added successfully!', 'success');
      onTasksChanged();
    } catch (err) {
      showToast(err.message || 'Failed to create task', 'error');
    }
  };

  if (loading && !summary) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Tasks',
      value: summary?.totalTasks || 0,
      icon: ListTodo,
      bg: '#e0e7ff',
      color: '#4338ca',
    },
    {
      label: 'Pending',
      value: summary?.pendingTasks || 0,
      icon: Clock,
      bg: '#f1f5f9',
      color: '#475569',
    },
    {
      label: 'Completed',
      value: summary?.completedTasks || 0,
      icon: CheckCircle2,
      bg: '#dcfce7',
      color: '#15803d',
    },
    {
      label: 'Overdue',
      value: summary?.overdueTasks || 0,
      icon: AlertCircle,
      bg: '#fee2e2',
      color: '#dc2626',
    },
    {
      label: "Today's Tasks",
      value: summary?.todayTasks || 0,
      icon: Calendar,
      bg: '#e0f2fe',
      color: '#0284c7',
    },
    {
      label: 'High Priority',
      value: summary?.highPriorityTasks || 0,
      icon: Flame,
      bg: '#ffedd5',
      color: '#ea580c',
    },
  ];

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard Overview</h1>
          <p className="page-subtitle">
            Welcome back! Here is a summary of your activities, deadlines, and progress.
          </p>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="stats-grid">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="stat-card">
              <div>
                <div className="stat-label">{stat.label}</div>
                <div className="stat-value">{stat.value}</div>
              </div>
              <div
                className="stat-icon-wrapper"
                style={{ backgroundColor: stat.bg, color: stat.color }}
              >
                <Icon size={24} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress & Quick Add Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20, marginBottom: 28 }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <TrendingUp size={18} color="#4f46e5" />
              <span style={{ fontWeight: 700, fontSize: '0.98rem', color: '#0f172a' }}>
                Task Completion Progress
              </span>
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#4f46e5' }}>
              {summary?.completionRate || 0}%
            </span>
          </div>
          <div className="progress-container" style={{ height: 10 }}>
            <div
              className="progress-bar-fill"
              style={{ width: `${Math.min(100, summary?.completionRate || 0)}%` }}
            />
          </div>
          <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
            {summary?.completedTasks || 0} of {summary?.totalTasks || 0} total tasks completed
          </span>
        </div>

        <QuickAddTask onTaskCreated={handleQuickAdd} />
      </div>

      {/* Overdue Alert banner if any */}
      {summary?.overdueTasks > 0 && (
        <div
          className="card"
          style={{
            marginBottom: 28,
            backgroundColor: '#fef2f2',
            borderColor: '#fca5a5',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#dc2626' }}>
              <AlertCircle size={20} />
              <span style={{ fontWeight: 700, fontSize: '1rem' }}>
                Attention Required: {summary.overdueTasks} Overdue Task{summary.overdueTasks > 1 ? 's' : ''}
              </span>
            </div>
            <Link
              to="/tasks?status=OVERDUE"
              style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                textDecoration: 'none',
              }}
            >
              View all overdue <ArrowRight size={14} />
            </Link>
          </div>
          <div className="task-list">
            {summary?.overdueTasksList?.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onEdit={onOpenEditModal}
                onDelete={onOpenDeleteModal}
              />
            ))}
          </div>
        </div>
      )}

      {/* Today's Tasks Section */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Calendar size={20} color="#4f46e5" />
            Today's Scheduled Tasks
          </h2>
          <Link
            to="/today"
            style={{
              fontSize: '0.88rem',
              fontWeight: 600,
              color: '#4f46e5',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              textDecoration: 'none',
            }}
          >
            Go to Today's Tasks <ArrowRight size={14} />
          </Link>
        </div>

        {summary?.todayTasksList && summary.todayTasksList.length > 0 ? (
          <div className="task-list">
            {summary.todayTasksList.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onEdit={onOpenEditModal}
                onDelete={onOpenDeleteModal}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state" style={{ padding: '36px 20px' }}>
            <Calendar className="empty-icon" />
            <h3 className="empty-title">No tasks due today</h3>
            <p className="empty-description">
              Enjoy your day or use the quick add form above to plan today's activities.
            </p>
          </div>
        )}
      </div>

      {/* Upcoming Tasks Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Clock size={20} color="#0891b2" />
            Upcoming Activities & Deadlines
          </h2>
          <Link
            to="/upcoming"
            style={{
              fontSize: '0.88rem',
              fontWeight: 600,
              color: '#0891b2',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              textDecoration: 'none',
            }}
          >
            View upcoming schedule <ArrowRight size={14} />
          </Link>
        </div>

        {summary?.upcomingTasksList && summary.upcomingTasksList.length > 0 ? (
          <div className="task-list">
            {summary.upcomingTasksList.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onEdit={onOpenEditModal}
                onDelete={onOpenDeleteModal}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state" style={{ padding: '36px 20px' }}>
            <Clock className="empty-icon" />
            <h3 className="empty-title">No upcoming deadlines</h3>
            <p className="empty-description">
              Your calendar is currently clear of future deadlines.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
