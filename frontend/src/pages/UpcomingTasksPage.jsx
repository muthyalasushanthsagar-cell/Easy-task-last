import React, { useState, useEffect } from 'react';
import { CalendarClock, Plus } from 'lucide-react';
import { taskApi } from '../services/api';
import TaskCard from '../components/TaskCard';

export default function UpcomingTasksPage({
  onOpenNewTaskModal,
  onOpenEditModal,
  onOpenDeleteModal,
  showToast,
  refreshTrigger,
  onTasksChanged,
}) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUpcomingTasks = async () => {
    try {
      setLoading(true);
      const data = await taskApi.getUpcoming();
      setTasks(data);
    } catch (err) {
      showToast(err.message || 'Failed to load upcoming tasks', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcomingTasks();
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

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <CalendarClock size={26} color="#0891b2" />
            Upcoming Tasks & Deadlines
          </h1>
          <p className="page-subtitle">
            Plan ahead and stay prepared for upcoming milestones, meetings, and deadlines.
          </p>
        </div>
        <button className="btn btn-primary" onClick={onOpenNewTaskModal}>
          <Plus size={16} />
          <span>New Task</span>
        </button>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner" />
          <p>Loading upcoming tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <CalendarClock className="empty-icon" />
          <h3 className="empty-title">No upcoming tasks scheduled</h3>
          <p className="empty-description">
            You don't have any future tasks beyond today. Click "New Task" to schedule upcoming work.
          </p>
          <button className="btn btn-primary" onClick={onOpenNewTaskModal}>
            <Plus size={16} />
            <span>Schedule New Task</span>
          </button>
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
