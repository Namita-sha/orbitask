import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import TaskCard from '../components/TaskCard';
import { CheckSquare, Filter } from 'lucide-react';
import { isPast } from 'date-fns';
import toast from 'react-hot-toast';

const statusClass = {
  'Todo': 'badge-todo',
  'In Progress': 'badge-progress',
  'Review': 'badge-review',
  'Done': 'badge-done',
};

const priorityClass = {
  'Low': 'priority-low',
  'Medium': 'priority-medium',
  'High': 'priority-high',
  'Critical': 'priority-critical',
};

const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get('/tasks/my');
        setTasks(res.data);
      } catch (err) {
        toast.error('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = tasks.filter(t => {
    if (filter === 'All') return true;
    if (filter === 'Overdue') return isPast(new Date(t.dueDate)) && t.status !== 'Done';
    return t.status === filter;
  });

  return (
    <div className="main-content">
      <div className="top-header">
        <div>
          <div className="page-title">My Tasks</div>
          <div className="page-subtitle">{tasks.length} tasks assigned to you</div>
        </div>
      </div>

      <div className="page-container">
        <div className="filter-bar">
          <Filter size={16} color="var(--gray-400)" />
          {['All', 'Todo', 'In Progress', 'Review', 'Done', 'Overdue'].map(f => (
            <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter(f)}>
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-center"><div className="loading-spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><CheckSquare size={32} /></div>
            <div className="empty-state-title">No tasks found</div>
            <div className="empty-state-text">
              {filter === 'All' ? 'No tasks assigned to you yet' : `No ${filter} tasks`}
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Project</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(task => {
                    const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'Done';
                    return (
                      <tr key={task._id}>
                        <td>
                          <div className="font-bold text-sm">{task.title}</div>
                          {task.description && (
                            <div className="text-xs text-muted" style={{ marginTop: 2 }}>
                              {task.description.slice(0, 60)}...
                            </div>
                          )}
                        </td>
                        <td>
                          <div className="flex-center gap-2">
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: task.project?.color || 'var(--sky)' }} />
                            <span className="text-sm">{task.project?.name}</span>
                          </div>
                        </td>
                        <td><span className={`badge ${priorityClass[task.priority]}`}>{task.priority}</span></td>
                        <td><span className={`badge ${statusClass[task.status]}`}>{task.status}</span></td>
                        <td>
                          {task.dueDate ? (
                            <span className={`text-sm ${isOverdue ? '' : 'text-muted'}`}
                              style={{ color: isOverdue ? 'var(--danger)' : undefined, fontWeight: isOverdue ? 600 : 400 }}>
                              {new Date(task.dueDate).toLocaleDateString()}
                              {isOverdue && ' ⚠️'}
                            </span>
                          ) : <span className="text-sm text-muted">No date</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;