import React, { useState } from 'react';
import { Plus } from 'lucide-react';

export default function QuickAddTask({ onTaskCreated }) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setIsSubmitting(true);
      const payload = {
        title: title.trim(),
        priority,
        category: 'General',
        dueDateTime: dueDate ? new Date(dueDate).toISOString() : null,
        reminderAdvanceMinutes: dueDate ? 15 : null,
      };
      await onTaskCreated(payload);
      setTitle('');
      setDueDate('');
      setPriority('MEDIUM');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="quick-add-box">
      <form onSubmit={handleSubmit} className="quick-add-form">
        <input
          type="text"
          className="quick-add-input"
          placeholder="+ Add a quick task (e.g. Call team at 4 PM, Buy almond milk)..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSubmitting}
        />

        <select
          className="select-control"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          disabled={isSubmitting}
        >
          <option value="LOW">Low Priority</option>
          <option value="MEDIUM">Medium Priority</option>
          <option value="HIGH">High Priority</option>
        </select>

        <input
          type="datetime-local"
          className="select-control"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          disabled={isSubmitting}
          title="Due Date & Time (Optional)"
        />

        <button
          type="submit"
          className="btn btn-primary btn-sm"
          disabled={!title.trim() || isSubmitting}
        >
          <Plus size={16} />
          <span>Add</span>
        </button>
      </form>
    </div>
  );
}
