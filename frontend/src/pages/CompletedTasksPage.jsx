import React, { useState, useEffect } from 'react';
import { CheckCircle2, RotateCcw, Trash2, Award } from 'lucide-react';
import { taskApi } from '../services/api';
import TaskCard from '../components/TaskCard';

export default function CompletedTasksPage({
  onOpenEditModal,
  onOpenDeleteModal,
  showToast,
  refreshTrigger,
  onTasksChanged,
}) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCompleted = async () => {
    try {
      setLoading(true);
      const data = await taskApi.getCompleted();
      setTasks(data);
    } catch (err) {
      showToast(err.message || 'Failed to load completed tasks', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompleted();
  }, [refreshTrigger]);

  const handleToggleComplete = async (task) => {
    try {
      await taskApi.reopen(task.id);
      showToast(`Reopened: "${task.title}"`, 'success');
      onTasksChanged();
    } catch (err) {
      showToast(err.message || 'Failed to reopen task', 'error');
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <CheckCircle2 size={26} color="#10b981" />
            Completed Tasks
          </h1>
          <p className="page-subtitle">
            Celebrate your accomplishments and keep track of finished goals and assignments.
          </p>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            backgroundColor: '#ecfdf5',
            color: '#059669',
            padding: '8px 16px',
            borderRadius: '9999px',
            fontWeight: 700,
            fontSize: '0.9rem',
          }}
        >
          <Award size={18} />
          <span>{tasks.length} Accomplished</span>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner" />
          <p>Loading completed tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <CheckCircle2 className="empty-icon" />
          <h3 className="empty-title">No completed tasks yet</h3>
          <p className="empty-description">
            Complete your scheduled tasks to see your history and achievements here.
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
