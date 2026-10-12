import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import TaskModal from '../components/TaskModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import Toast from '../components/Toast';
import { taskApi, dashboardApi } from '../services/api';

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const [deleteModalState, setDeleteModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    isDeleting: false,
  });

  // Toasts
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const fetchStats = async () => {
    try {
      const data = await dashboardApi.getSummary();
      setStats(data);
    } catch (err) {
      console.error('Error fetching dashboard summary:', err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [refreshTrigger]);

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // Open task modal for create
  const handleOpenNewTask = () => {
    setTaskToEdit(null);
    setIsTaskModalOpen(true);
  };

  // Open task modal for edit
  const handleOpenEditTask = (task) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  // Save Task (Create or Update)
  const handleSaveTask = async (payload, id) => {
    if (id) {
      await taskApi.update(id, payload);
      showToast('Task updated successfully!', 'success');
    } else {
      await taskApi.create(payload);
      showToast('Task created successfully!', 'success');
    }
    triggerRefresh();
  };

  // Open Delete Confirmation Modal for task
  const handleOpenDeleteTask = (task) => {
    setDeleteModalState({
      isOpen: true,
      title: `Delete "${task.title}"?`,
      message: 'Are you sure you want to delete this task? This action cannot be undone.',
      isDeleting: false,
      onConfirm: async () => {
        try {
          setDeleteModalState((prev) => ({ ...prev, isDeleting: true }));
          await taskApi.delete(task.id);
          showToast('Task deleted successfully.', 'success');
          setDeleteModalState({ isOpen: false });
          triggerRefresh();
        } catch (err) {
          showToast(err.message || 'Failed to delete task', 'error');
          setDeleteModalState((prev) => ({ ...prev, isDeleting: false }));
        }
      },
    });
  };

  return (
    <div className="app-container">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        stats={stats}
      />

      <div className="main-content">
        <Navbar
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          onOpenNewTaskModal={handleOpenNewTask}
        />

        <main>
          <Outlet
            context={{
              onOpenNewTaskModal: handleOpenNewTask,
              onOpenEditModal: handleOpenEditTask,
              onOpenDeleteModal: handleOpenDeleteTask,
              showToast,
              refreshTrigger,
              onTasksChanged: triggerRefresh,
            }}
          />
        </main>
      </div>

      {/* Task Dialog Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalState.isOpen}
        title={deleteModalState.title}
        message={deleteModalState.message}
        onConfirm={deleteModalState.onConfirm}
        onCancel={() => setDeleteModalState({ isOpen: false })}
        isDeleting={deleteModalState.isDeleting}
      />

      {/* Global Toast Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
