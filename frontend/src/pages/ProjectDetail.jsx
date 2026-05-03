import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import TaskCard from '../components/TaskCard';
import { Plus, ArrowLeft, Trash2, UserPlus, X } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const COLUMNS = ['Todo', 'In Progress', 'Review', 'Done'];

const TaskModal = ({ projectId, users, onClose, onSaved, editTask }) => {
  const { user } = useAuth();
  const [form, setForm] = useState(editTask ? {
    title: editTask.title,
    description: editTask.description || '',
    assignedTo: editTask.assignedTo?._id || '',
    status: editTask.status,
    priority: editTask.priority,
    dueDate: editTask.dueDate ? editTask.dueDate.split('T')[0] : '',
  } : {
    title: '', description: '', assignedTo: '', status: 'Todo',
    priority: 'Medium', dueDate: ''
  });
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Task title required');
    setLoading(true);
    try {
      let res;
      if (editTask) {
        res = await API.put(`/tasks/${editTask._id}`, form);
        toast.success('Task updated!');
      } else {
        res = await API.post('/tasks', { ...form, project: projectId });
        toast.success('Task created!');
      }
      onSaved(res.data, !!editTask);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{editTask ? 'Edit Task' : 'Create Task'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={submit}>
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input className="form-input" name="title" placeholder="Task title" value={form.title} onChange={handle} required />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" name="description" placeholder="Details..." value={form.description} onChange={handle} />
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-select" name="status" value={form.status} onChange={handle}>
                {COLUMNS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select className="form-select" name="priority" value={form.priority} onChange={handle}>
                {['Low', 'Medium', 'High', 'Critical'].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Assign To</label>
              <select className="form-select" name="assignedTo" value={form.assignedTo} onChange={handle}>
                <option value="">Unassigned</option>
                {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input className="form-input" type="date" name="dueDate" value={form.dueDate} onChange={handle} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
              {loading ? 'Saving...' : editTask ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [showAddMember, setShowAddMember] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');

  useEffect(() => {
    fetchAll();
  }, [id]);

  const fetchAll = async () => {
    try {
      const [projRes, taskRes, userRes] = await Promise.all([
        API.get(`/projects/${id}`),
        API.get(`/tasks?project=${id}`),
        API.get('/auth/users')
      ]);
      setProject(projRes.data);
      setTasks(taskRes.data);
      setUsers(userRes.data);
    } catch (err) {
      toast.error('Failed to load project');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskSaved = (task, isEdit) => {
    if (isEdit) {
      setTasks(prev => prev.map(t => t._id === task._id ? task : t));
    } else {
      setTasks(prev => [task, ...prev]);
    }
  };

  const deleteTask = async (taskId) => {
    if (!confirm('Delete this task?')) return;
    try {
      await API.delete(`/tasks/${taskId}`);
      setTasks(prev => prev.filter(t => t._id !== taskId));
      toast.success('Task deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  const deleteProject = async () => {
    if (!confirm('Delete this project and all its tasks? This cannot be undone.')) return;
    try {
      await API.delete(`/projects/${id}`);
      toast.success('Project deleted');
      navigate('/projects');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  const addMember = async () => {
    if (!selectedUser) return toast.error('Select a user');
    try {
      const res = await API.post(`/projects/${id}/members`, { userId: selectedUser, role: 'Member' });
      setProject(res.data);
      setSelectedUser('');
      setShowAddMember(false);
      toast.success('Member added!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add member');
    }
  };

  const removeMember = async (userId) => {
    if (!confirm('Remove this member?')) return;
    try {
      await API.delete(`/projects/${id}/members/${userId}`);
      setProject(prev => ({
        ...prev,
        members: prev.members.filter(m => m.user._id !== userId)
      }));
      toast.success('Member removed');
    } catch (err) {
      toast.error('Failed to remove member');
    }
  };

  const isOwner = project?.owner?._id === user?._id;
  const canManage = isOwner || isAdmin;

  const availableToAdd = users.filter(u =>
    u._id !== project?.owner?._id &&
    !project?.members?.some(m => m.user._id === u._id)
  );

  if (loading) return (
    <div className="main-content">
      <div className="loading-center"><div className="loading-spinner" /></div>
    </div>
  );

  return (
    <div className="main-content">
      <div className="top-header">
        <div className="flex-center gap-3">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/projects')}>
            <ArrowLeft size={16} /> Back
          </button>
          <div>
            <div className="flex-center gap-2">
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: project?.color }} />
              <div className="page-title">{project?.name}</div>
            </div>
            <div className="page-subtitle">{project?.description}</div>
          </div>
        </div>
        <div className="flex-center gap-2">
          {canManage && (
            <>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowAddMember(true)}>
                <UserPlus size={14} /> Add Member
              </button>
              <button className="btn btn-danger btn-sm" onClick={deleteProject}>
                <Trash2 size={14} /> Delete
              </button>
            </>
          )}
          <button className="btn btn-primary btn-sm" onClick={() => { setEditTask(null); setShowTaskModal(true); }}>
            <Plus size={14} /> Add Task
          </button>
        </div>
      </div>

      <div className="page-container">
        {/* Members */}
        <div className="card mb-4">
          <div className="card-body" style={{ padding: '16px 24px' }}>
            <div className="flex-center gap-3">
              <span className="text-sm font-bold text-muted">Team:</span>
              <div className="member-chips">
                <div className="member-chip">
                  <div className="member-chip-avatar">
                    {project?.owner?.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  {project?.owner?.name} (Owner)
                </div>
                {project?.members?.map(m => (
                  <div key={m.user._id} className="member-chip">
                    <div className="member-chip-avatar">
                      {m.user.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    {m.user.name}
                    {canManage && (
                      <button onClick={() => removeMember(m.user._id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--sky-deep)', display: 'flex' }}>
                        <X size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="tasks-board">
          {COLUMNS.map(col => {
            const colTasks = tasks.filter(t => t.status === col);
            return (
              <div key={col} className="board-column">
                <div className="board-column-header">
                  <span className="board-column-title">{col}</span>
                  <span className="column-count">{colTasks.length}</span>
                </div>
                {colTasks.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--gray-300)', fontSize: 13 }}>
                    No tasks
                  </div>
                ) : (
                  colTasks.map(task => (
                    <div key={task._id} style={{ position: 'relative' }}>
                      <TaskCard task={task} onClick={() => { setEditTask(task); setShowTaskModal(true); }} />
                      {(canManage || task.createdBy?._id === user?._id) && (
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteTask(task._id); }}
                          style={{
                            position: 'absolute', top: 8, right: 8,
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: 'var(--gray-300)', padding: 4, borderRadius: 4
                          }}
                          title="Delete task"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  ))
                )}
                <button
                  className="btn btn-ghost btn-sm w-full mt-2"
                  style={{ justifyContent: 'center', color: 'var(--gray-400)', fontSize: 12 }}
                  onClick={() => { setEditTask(null); setShowTaskModal(true); }}
                >
                  <Plus size={13} /> Add task
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {showTaskModal && (
        <TaskModal
          projectId={id}
          users={[...users]}
          editTask={editTask}
          onClose={() => { setShowTaskModal(false); setEditTask(null); }}
          onSaved={handleTaskSaved}
        />
      )}

      {showAddMember && (
        <div className="modal-overlay" onClick={() => setShowAddMember(false)}>
          <div className="modal" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Add Member</h2>
              <button className="modal-close" onClick={() => setShowAddMember(false)}>✕</button>
            </div>
            <div className="form-group">
              <label className="form-label">Select User</label>
              <select className="form-select" value={selectedUser} onChange={e => setSelectedUser(e.target.value)}>
                <option value="">Choose a user...</option>
                {availableToAdd.map(u => (
                  <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowAddMember(false)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={addMember}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;