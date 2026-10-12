import React from 'react';
import {
  Check,
  Clock,
  Calendar,
  AlertCircle,
  Bell,
  Edit2,
  Trash2,
  RotateCcw,
  Tag,
} from 'lucide-react';

export default function TaskCard({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
}) {
  const isCompleted = task.status === 'COMPLETED';
  const isOverdue = task.overdue;

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      className={`task-card ${isCompleted ? 'completed' : ''} ${isOverdue ? 'is-overdue' : ''}`}
    >
      <button
        className={`checkbox-btn ${isCompleted ? 'checked' : ''}`}
        onClick={() => onToggleComplete(task)}
        aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
        title={isCompleted ? 'Reopen task' : 'Complete task'}
      >
        {isCompleted && <Check size={14} strokeWidth={3} />}
      </button>

      <div className="task-card-body">
        <div className="task-title-row">
          <span className="task-title">{task.title}</span>
          <div className="task-actions">
            {isCompleted ? (
              <button
                className="btn-icon"
                onClick={() => onToggleComplete(task)}
                title="Reopen task"
              >
                <RotateCcw size={16} />
              </button>
            ) : (
              <button
                className="btn-icon"
                onClick={() => onEdit(task)}
                title="Edit task"
              >
                <Edit2 size={16} />
              </button>
            )}
            <button
              className="btn-icon"
              onClick={() => onDelete(task)}
              title="Delete task"
              style={{ color: '#ef4444' }}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {task.description && (
          <p className="task-description">{task.description}</p>
        )}

        <div className="task-metadata-row">
          {/* Priority */}
          <span className={`badge badge-priority-${task.priority}`}>
            {task.priority}
          </span>

          {/* Category */}
          {task.category && (
            <span className="badge badge-category">
              <Tag size={12} />
              {task.category}
            </span>
          )}

          {/* Overdue alert */}
          {isOverdue && !isCompleted && (
            <span className="meta-item overdue">
              <AlertCircle size={14} />
              Overdue
            </span>
          )}

          {/* Due date */}
          {task.dueDateTime && (
            <span className={`meta-item ${isOverdue && !isCompleted ? 'overdue' : ''}`}>
              <Clock size={14} />
              Due: {formatDate(task.dueDateTime)}
            </span>
          )}

          {/* Start date */}
          {task.startDateTime && (
            <span className="meta-item">
              <Calendar size={14} />
              Starts: {formatDate(task.startDateTime)}
            </span>
          )}

          {/* Advance Reminder */}
          {task.reminderDateTime && !isCompleted && (
            <span className="meta-item" style={{ color: '#6366f1' }}>
              <Bell size={14} />
              Reminder: {formatDate(task.reminderDateTime)}
            </span>
          )}

          {/* Completed date */}
          {isCompleted && task.completedAt && (
            <span className="meta-item" style={{ color: '#10b981' }}>
              <Check size={14} />
              Done {formatDate(task.completedAt)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
