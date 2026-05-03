import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import {
  FolderKanban, CheckSquare, AlertTriangle, Clock,
  TrendingUp, Plus, ArrowRight
} from 'lucide-react';
import { format, isPast } from 'date-fns';
import toast from 'react-hot-toast';

const statusClass = {
  'Todo': 'badge-todo',
  'In Progress': 'badge-progress',
  'Review': 'badge-review',
  'Done': 'badge-done',
};

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/tasks/dashboard');
        setStats(res.data);
      } catch (err) {
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="main-content">
      <div className="loading-center">
        <div className="loading-spinner" />
        <span>Loading dashboard...</span>
      </div>
    </div>
  );

  const greetingTime = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="main-content">
      <div className="top-header">
        <div>
          <div className="page-title">{greetingTime()}, {user?.name?.split(' ')[0]} 👋</div>
          <div className="page-subtitle">Here's what's happening in your workspace today</div>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/projects')}>
          <Plus size={16} /> New Project
        </button>
      </div>

      <div className="page-container">
        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card sky">
            <div className="stat-icon sky"><FolderKanban size={22} /></div>
            <div className="stat-value">{stats?.totalProjects || 0}</div>
            <div className="stat-label">Total Projects</div>
          </div>
          <div className="stat-card powder">
            <div className="stat-icon powder"><CheckSquare size={22} /></div>
            <div className="stat-value">{stats?.totalTasks || 0}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
          <div className="stat-card warning">
            <div className="stat-icon warning"><Clock size={22} /></div>
            <div className="stat-value">{stats?.myTasks || 0}</div>
            <div className="stat-label">Assigned to Me</div>
          </div>
          <div className="stat-card danger">
            <div className="stat-icon danger"><AlertTriangle size={22} /></div>
            <div className="stat-value">{stats?.overdueTasks || 0}</div>
            <div className="stat-label">Overdue Tasks</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Task Breakdown */}
          <div className="card">
            <div className="card-body">
              <div className="section-header">
                <div className="section-title">Task Breakdown</div>
                <TrendingUp size={18} color="var(--sky-deep)" />
              </div>

              {['Todo', 'In Progress', 'Review', 'Done'].map(status => {
                const count = stats?.statusBreakdown?.[status] || 0;
                const total = stats?.totalTasks || 1;
                const pct = Math.round((count / total) * 100);
                return (
                  <div key={status} style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span className="text-sm font-bold">{status}</span>
                      <span className="text-sm text-muted">{count} tasks</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Tasks */}
          <div className="card">
            <div className="card-body">
              <div className="section-header">
                <div className="section-title">Recent Activity</div>
                <button className="btn btn-ghost btn-sm" onClick={() => navigate('/tasks')}>
                  View all <ArrowRight size={14} />
                </button>
              </div>

              {stats?.recentTasks?.length === 0 ? (
                <div className="empty-state" style={{ padding: '32px 0' }}>
                  <div className="empty-state-text">No tasks yet. Create a project to get started!</div>
                </div>
              ) : (
                stats?.recentTasks?.map(task => {
                  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'Done';
                  return (
                    <div key={task._id} style={{
                      padding: '12px 0',
                      borderBottom: '1px solid var(--gray-50)',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 12
                    }}>
                      <div style={{ flex: 1 }}>
                        <div className="text-sm font-bold" style={{ marginBottom: 2 }}>{task.title}</div>
                        <div className="text-xs text-muted">{task.project?.name}</div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                        <span className={`badge ${statusClass[task.status]}`}>{task.status}</span>
                        {isOverdue && <span className="text-xs" style={{ color: 'var(--danger)' }}>Overdue</span>}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;