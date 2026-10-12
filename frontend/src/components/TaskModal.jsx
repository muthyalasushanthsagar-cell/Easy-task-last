import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Bell, Tag, Flag, AlertCircle } from 'lucide-react';

export default function TaskModal({
  isOpen,
  onClose,
  onSave,
  taskToEdit,
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('General');
  const [priority, setPriority] = useState('MEDIUM');
  const [status, setStatus] = useState('PENDING');
  const [startDateTime, setStartDateTime] = useState('');
  const [dueDateTime, setDueDateTime] = useState('');
  const [reminderOption, setReminderOption] = useState('15'); // 15 mins default
  const [customReminderTime, setCustomReminderTime] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Format local ISO datetime for input[type="datetime-local"]
  const toLocalISO = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const tzOffset = d.getTimezoneOffset() * 60000;
    const localISOTime = new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
    return localISOTime;
  };

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || '');
      setDescription(taskToEdit.description || '');
      setCategory(taskToEdit.category || 'General');
      setPriority(taskToEdit.priority || 'MEDIUM');
      setStatus(taskToEdit.status || 'PENDING');
      setStartDateTime(toLocalISO(taskToEdit.startDateTime));
      setDueDateTime(toLocalISO(taskToEdit.dueDateTime));

      if (taskToEdit.reminderAdvanceMinutes != null) {
        setReminderOption(String(taskToEdit.reminderAdvanceMinutes));
      } else if (taskToEdit.reminderDateTime) {
        setReminderOption('custom');
        setCustomReminderTime(toLocalISO(taskToEdit.reminderDateTime));
      } else {
        setReminderOption('none');
      }
    } else {
      // Defaults for new task
      setTitle('');
      setDescription('');
      setCategory('General');
      setPriority('MEDIUM');
      setStatus('PENDING');
      setStartDateTime('');
      // Default due today evening
      const now = new Date();
      now.setHours(18, 0, 0, 0);
      setDueDateTime(toLocalISO(now));
      setReminderOption('15');
      setCustomReminderTime('');
    }
    setError('');
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }

    if (startDateTime && dueDateTime) {
      if (new Date(dueDateTime) < new Date(startDateTime)) {
        setError('Due date & time cannot be earlier than start date & time.');
        return;
      }
    }

    let reminderAdvanceMinutes = null;
    let reminderDateTime = null;

    if (reminderOption === 'custom') {
      if (customReminderTime) {
        reminderDateTime = new Date(customReminderTime).toISOString();
      }
    } else if (reminderOption !== 'none') {
      reminderAdvanceMinutes = parseInt(reminderOption, 10);
    }

    const payload = {
      title: title.trim(),
      description: description.trim() || null,
      category: category.trim() || 'General',
      priority,
      status,
      startDateTime: startDateTime ? new Date(startDateTime).toISOString() : null,
      dueDateTime: dueDateTime ? new Date(dueDateTime).toISOString() : null,
      reminderAdvanceMinutes,
      reminderDateTime,
    };

    try {
      setIsSubmitting(true);
      await onSave(payload, taskToEdit ? taskToEdit.id : null);
      setIsSubmitting(false);
      onClose();
    } catch (err) {
      setIsSubmitting(false);
      setError(err.message || 'Failed to save task.');
    }
  };

  const categories = ['General', 'Work', 'Study', 'Personal', 'Shopping', 'Health', 'Finance'];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {taskToEdit ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button className="btn-icon" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 14px',
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                  color: '#dc2626',
                  fontSize: '0.88rem',
                  marginBottom: 16,
                }}
              >
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Title */}
            <div className="form-group">
              <label className="form-label">
                Task Title <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Prepare client project presentation"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
                required
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Description (Optional)</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Add subtasks, relevant notes, or links..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Category & Status */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {taskToEdit && (
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
              )}
            </div>

            {/* Priority Selector */}
            <div className="form-group">
              <label className="form-label">Priority Level</label>
              <div className="priority-selector">
                {['LOW', 'MEDIUM', 'HIGH'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    className={`priority-btn ${priority === p ? `selected-${p}` : ''}`}
                    onClick={() => setPriority(p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Start and Due Date */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Start Date & Time (Optional)</label>
                <input
                  type="datetime-local"
                  className="form-input"
                  value={startDateTime}
                  onChange={(e) => setStartDateTime(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Due Date & Time (Optional)</label>
                <input
                  type="datetime-local"
                  className="form-input"
                  value={dueDateTime}
                  onChange={(e) => setDueDateTime(e.target.value)}
                />
              </div>
            </div>

            {/* Advance Reminder */}
            <div className="form-group">
              <label className="form-label">
                <Bell size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                Advance Reminder
              </label>
              <select
                className="form-select"
                value={reminderOption}
                onChange={(e) => setReminderOption(e.target.value)}
              >
                <option value="none">No reminder</option>
                <option value="5">5 minutes before</option>
                <option value="15">15 minutes before</option>
                <option value="30">30 minutes before</option>
                <option value="60">1 hour before</option>
                <option value="custom">Custom reminder date & time</option>
              </select>

              {reminderOption === 'custom' && (
                <div style={{ marginTop: 10 }}>
                  <input
                    type="datetime-local"
                    className="form-input"
                    value={customReminderTime}
                    onChange={(e) => setCustomReminderTime(e.target.value)}
                    placeholder="Pick reminder time"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : taskToEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
