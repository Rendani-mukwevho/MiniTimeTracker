import { useState, useEffect } from 'react';
import TimeEntryForm from './components/TimeEntryForm';

interface TimeEntry {
  id: string;
  task: string;
  hours: number;
}

export default function App() {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);
  const [timerActive, setTimerActive] = useState(false);
  const [time, setTime] = useState(0); // Time in seconds

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const handleAddEntry = (task: string, hours: number) => {
    const newEntry: TimeEntry = { id: Date.now().toString(), task, hours };
    setEntries([...entries, newEntry]);
    if (editingEntry) setEditingEntry(null);
  };

  const handleDelete = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
    if (editingEntry && editingEntry.id === id) setEditingEntry(null);
  };

  const handleEdit = (entry: TimeEntry) => {
    setEditingEntry(entry);
  };

  const handleSaveEdit = (task: string, hours: number) => {
    if (editingEntry) {
      setEntries(entries.map(entry =>
        entry.id === editingEntry.id ? { ...entry, task, hours } : entry
      ));
      setEditingEntry(null);
    }
  };

  const totalHours = entries.reduce((sum: number, entry: TimeEntry) => sum + entry.hours, 0);

  const handleAddTimerEntry = () => {
    if (time > 0) {
      const hours = time / 3600; // Convert seconds to hours
      handleAddEntry('Timer Task', hours);
      setTime(0); // Reset timer
      setTimerActive(false); // Stop timer
    }
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh', 
    width: '100vw' 
  }}>
    <div style={{ 
      width: '100%', 
      maxWidth: '800px', 
      padding: '20px', 
      textAlign: 'center' 
    }}>
      <h1>Time Tracker</h1>
      <TimeEntryForm
        onAddEntry={handleAddEntry}
        onSaveEdit={handleSaveEdit}
        editingEntry={editingEntry}
      />
      <div style={{ margin: '20px 0' }}>
        <h2>Timer: {formatTime(time)}</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <button
            onClick={() => setTimerActive(!timerActive)}
            style={{ padding: '8px 16px', background: timerActive ? '#ff4444' : '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            {timerActive ? 'Stop' : 'Start'}
          </button>
          <button
            onClick={handleAddTimerEntry}
            style={{ padding: '8px 16px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
            disabled={time === 0}
          >
            Add Timer Entry
          </button>
        </div>
      </div>
      <h2>Time Entries (Total: {totalHours.toFixed(2)} hours)</h2>
      <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left' }}>
        {entries.map((entry: TimeEntry) => (
          <li
            key={entry.id}
            style={{
              margin: '10px 0',
              padding: '15px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <span style={{ flex: 1 }}>{entry.task}</span>
            <span style={{ flex: 1 }}>{entry.hours.toFixed(2)} hours</span>
            <div style={{ flex: 1 }}>
              <button
                onClick={() => handleEdit(entry)}
                style={{ marginRight: '10px', padding: '5px 10px', background: '#ffa500', color: 'white', border: 'none', borderRadius: '4px' }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(entry.id)}
                style={{ padding: '5px 10px', background: '#ff4444', color: 'white', border: 'none', borderRadius: '4px' }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
);
}