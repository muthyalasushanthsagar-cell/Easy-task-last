import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, ArrowUpDown, CheckSquare } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { taskApi } from '../services/api';
import TaskCard from '../components/TaskCard';

export default function AllTasksPage({
  onOpenNewTaskModal,
  onOpenEditModal,
  onOpenDeleteModal,
  showToast,
  refreshTrigger,
  onTasksChanged,
}) {
  const [searchParams] = useSearchParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(searchParams.get('status') || 'ALL');
  const [priority, setPriority] = useState('ALL');
  const [category, setCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = {
        search: search.trim() || undefined,
        status: status !== 'ALL' && status !== 'OVERDUE' ? status : undefined,
        priority: priority !== 'ALL' ? priority : undefined,
        category: category !== 'ALL' ? category : undefined,
        sortBy,
        sortDir,
      };

      let data = await taskApi.getAll(params);

      // Client-side filter for OVERDUE status if selected
      if (status === 'OVERDUE') {
        data = data.filter((t) => t.overdue);
      }

      setTasks(data);
    } catch (err) {
      showToast(err.message || 'Failed to fetch tasks', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [search, status, priority, category, sortBy, sortDir, refreshTrigger]);

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

  const categories = ['ALL', 'General', 'Work', 'Study', 'Personal', 'Shopping', 'Health', 'Finance'];

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <CheckSquare size={26} color="#4f46e5" />
            All Tasks
          </h1>
          <p className="page-subtitle">
            View, search, filter, and organize all your tasks and assignments in one place.
          </p>
        </div>
        <button className="btn btn-primary" onClick={onOpenNewTaskModal}>
          <Plus size={16} />
          <span>New Task</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <Search size={18} className="search-input-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search tasks by name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          {/* Status Filter */}
          <select
            className="select-control"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            title="Filter by Status"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="OVERDUE">Overdue</option>
          </select>

          {/* Priority Filter */}
          <select
            className="select-control"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            title="Filter by Priority"
          >
            <option value="ALL">All Priorities</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>

          {/* Category Filter */}
          <select
            className="select-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            title="Filter by Category"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'ALL' ? 'All Categories' : c}
              </option>
            ))}
          </select>

          {/* Sort By */}
          <select
            className="select-control"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            title="Sort By"
          >
            <option value="createdAt">Date Created</option>
            <option value="dueDateTime">Due Date</option>
            <option value="priority">Priority</option>
          </select>

          {/* Sort Direction Toggle */}
          <button
            className="btn-icon"
            onClick={() => setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
            title={sortDir === 'asc' ? 'Ascending Order' : 'Descending Order'}
            style={{ border: '1px solid #e2e8f0', borderRadius: 8, height: 38, width: 38 }}
          >
            <ArrowUpDown size={16} />
          </button>
        </div>
      </div>

      {/* Task List / Empty States */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner" />
          <p>Loading tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <CheckSquare className="empty-icon" />
          <h3 className="empty-title">No tasks found</h3>
          <p className="empty-description">
            {search || status !== 'ALL' || priority !== 'ALL' || category !== 'ALL'
              ? 'Try adjusting your search query or filters to find what you are looking for.'
              : 'You have no tasks created yet. Click "New Task" above to get started!'}
          </p>
          <button className="btn btn-primary" onClick={onOpenNewTaskModal}>
            <Plus size={16} />
            <span>Create First Task</span>
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
