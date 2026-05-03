import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import ProjectCard from '../components/ProjectCard';
import { Plus, Search, FolderKanban } from 'lucide-react';
import toast from 'react-hot-toast';

const COLORS = ['#87CEEB', '#5BB8E0', '#B0D9F0', '#34D399', '#FBBF24', '#F87171', '#A78BFA', '#FB923C'];

const ProjectModal = ({ onClose, onSaved }) => {
  const [form, setForm] = useState({
    name: '', description: '', dueDate: '', color: '#87CEEB', priority: 'Medium', status: 'Active'
  });
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Project name is required');
    setLoading(true);
    try {
      const res = await API.post('/projects', form);
      toast.success('Project created! 🎉');
      onSaved(res.data);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Create New Project</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={submit}>
          <div className="form-group">
            <label className="form-label">Project Name *</label>
            <input className="form-input" name="name" placeholder="e.g. Website Redesign" value={form.name} onChange={handle} required />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" name="description" placeholder="Brief description of the project..." value={form.description} onChange={handle} />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select className="form-select" name="priority" value={form.priority} onChange={handle}>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input className="form-input" type="date" name="dueDate" value={form.dueDate} onChange={handle} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Project Color</label>
            <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
              {COLORS.map(c => (
                <button key={c} type="button" onClick={() => setForm({ ...form, color: c })}
                  style={{
                    width: 28, height: 28, borderRadius: '50%', background: c,
                    border: form.color === c ? '3px solid var(--black)' : '2px solid transparent',
                    cursor: 'pointer', transition: 'transform 0.15s'
                  }}
                />
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Projects = () => {
  const { isAdmin } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await API.get('/projects');
      setProjects(res.data);
    } catch (err) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const filtered = projects.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || p.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="main-content">
      <div className="top-header">
        <div>
          <div className="page-title">Projects</div>
          <div className="page-subtitle">{projects.length} projects in your workspace</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> New Project
        </button>
      </div>

      <div className="page-container">
        <div className="filter-bar">
          <div className="search-input-wrap">
            <Search className="search-icon" />
            <input
              className="form-input search-input"
              placeholder="Search projects..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          {['All', 'Active', 'On Hold', 'Completed'].map(f => (
            <button key={f} className={`btn ${filter === f ? 'btn-primary btn-sm' : 'btn-secondary btn-sm'}`}
              onClick={() => setFilter(f)}>
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-center"><div className="loading-spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><FolderKanban size={32} /></div>
            <div className="empty-state-title">No projects yet</div>
            <div className="empty-state-text">Create your first project to get started</div>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              <Plus size={16} /> Create Project
            </button>
          </div>
        ) : (
          <div className="projects-grid">
            {filtered.map(p => <ProjectCard key={p._id} project={p} />)}
          </div>
        )}
      </div>

      {showModal && (
        <ProjectModal
          onClose={() => setShowModal(false)}
          onSaved={(p) => setProjects(prev => [p, ...prev])}
        />
      )}
    </div>
  );
};

export default Projects;