import React, { useState } from 'react';

interface TimeEntryFormProps {
  onAddEntry: (task: string, hours: number) => void;
  onSaveEdit: (task: string, hours: number) => void;
  editingEntry: { id: string; task: string; hours: number } | null;
}

const TimeEntryForm: React.FC<TimeEntryFormProps> = ({ onAddEntry, onSaveEdit, editingEntry }) => {
  const [task, setTask] = useState(editingEntry ? editingEntry.task : '');
  const [hours, setHours] = useState(editingEntry ? editingEntry.hours.toString() : '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!task.trim()) {
      alert('Please enter a task name!');
      return;
    }
    const parsedHours = parseFloat(hours);
    if (isNaN(parsedHours) || parsedHours <= 0) {
      alert('Please enter a valid number of hours!');
      return;
    }
    if (editingEntry) {
      onSaveEdit(task, parsedHours);
    } else {
      onAddEntry(task, parsedHours);
    }
    setTask('');
    setHours('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder={editingEntry ? 'Edit task' : 'Task name'}
          style={{ padding: '8px', flex: 1, maxWidth: '200px', textAlign: 'center' }}
        />
        <input
          type="number"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          placeholder={editingEntry ? 'Edit hours' : 'Hours'}
          step="0.1"
          style={{ padding: '8px', width: '100px', textAlign: 'center' }}
        />
      </div>
      <div>
        <button
          type="submit"
          style={{ padding: '8px 16px', background: editingEntry ? '#28a745' : '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          {editingEntry ? 'Save Edit' : 'Add Entry'}
        </button>
        {editingEntry && (
          <button
            type="button"
            onClick={() => { setTask(''); setHours(''); }}
            style={{ marginLeft: '10px', padding: '8px 16px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TimeEntryForm;