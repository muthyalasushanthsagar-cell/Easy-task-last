import React, { useState, useEffect } from 'react';
import { Calendar, Plus, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { taskApi } from '../services/api';
import TaskCard from '../components/TaskCard';
import QuickAddTask from '../components/QuickAddTask';

export default function TodayTasksPage({
  onOpenNewTaskModal,
  onOpenEditModal,
  onOpenDeleteModal,
  showToast,
  refreshTrigger,
  onTasksChanged,
}) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTodayTasks = async () => {
    try {
      setLoading(true);
      const data = await taskApi.getToday();
      setTasks(data);
    } catch (err) {
      showToast(err.message || "Failed to load today's tasks", 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayTasks();
  }, [refreshTrigger]);

  const handleToggleComplete = async (task) => {
    try {
      if (task.status === 'COMPLETED') {
        await taskApi.reopen(task.id);
        showToast(`Task reopened: "${task.title}"`, 'success');
      } else {
        await taskApi.complete(task.id);
        showToast(`Task completed!`, 'success');
      }
      onTasksChanged();
    } catch (err) {
      showToast(err.message || 'Failed to update task', 'error');
    }
  };

  const handleQuickAdd = async (payload) => {
    try {
      // Set due date to today end of day if not set
      if (!payload.dueDateTime) {
        const todayEvening = new Date();
        todayEvening.setHours(20, 0, 0, 0);
        payload.dueDateTime = todayEvening.toISOString();
      }
      await taskApi.create(payload);
      showToast('Task added to today!', 'success');
      onTasksChanged();
    } catch (err) {
      showToast(err.message || 'Failed to create task', 'error');
    }
  };

  const pending = tasks.filter((t) => t.status !== 'COMPLETED' && !t.overdue);
  const overdue = tasks.filter((t) => t.overdue && t.status !== 'COMPLETED');
  const completed = tasks.filter((t) => t.status === 'COMPLETED');

  const todayFormatted = new Date().toLocaleDateString([], {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Calendar size={26} color="#4f46e5" />
            Today's Schedule
          </h1>
          <p className="page-subtitle">{todayFormatted}</p>
        </div>
        <button className="btn btn-primary" onClick={onOpenNewTaskModal}>
          <Plus size={16} />
          <span>New Task</span>
        </button>
      </div>

      <QuickAddTask onTaskCreated={handleQuickAdd} />

      {/* Breakdown Badges */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          marginBottom: 24,
          flexWrap: 'wrap',
        }}
      >
        <div className="badge badge-status-PENDING" style={{ padding: '6px 14px', fontSize: '0.82rem' }}>
          <Clock size={14} /> Pending: {pending.length}
        </div>
        <div className="badge badge-priority-HIGH" style={{ padding: '6px 14px', fontSize: '0.82rem' }}>
          <AlertCircle size={14} /> Overdue: {overdue.length}
        </div>
        <div className="badge badge-status-COMPLETED" style={{ padding: '6px 14px', fontSize: '0.82rem' }}>
          <CheckCircle2 size={14} /> Completed: {completed.length}
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner" />
          <p>Loading today's schedule...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <Calendar className="empty-icon" />
          <h3 className="empty-title">All clear for today!</h3>
          <p className="empty-description">
            You don't have any tasks scheduled for today. Add one above or take a well-deserved break!
          </p>
        </div>
      ) : (
        <div className="task-list">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleComplete={handleToggleComplete}
              onEdit={onOpenEditModal}
              onDelete={onOpenDeleteModal}
            />
          ))}
        </div>
      )}
    </div>
  );
}
