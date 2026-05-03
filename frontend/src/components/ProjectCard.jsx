import { useNavigate } from 'react-router-dom';
import { FolderKanban, Users, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

const statusColor = {
  'Active': 'var(--sky-deep)',
  'On Hold': 'var(--warning)',
  'Completed': 'var(--success)',
};

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();

  return (
    <div className="project-card" onClick={() => navigate(`/projects/${project._id}`)}>
      <div className="project-card-header">
        <div className="project-color-bar" style={{ background: project.color || '#87CEEB' }} />
        <div className="flex-center gap-2" style={{ justifyContent: 'space-between', marginBottom: 6 }}>
          <div className="project-name">{project.name}</div>
          <span className="badge" style={{
            background: `${statusColor[project.status]}18`,
            color: statusColor[project.status],
            border: `1px solid ${statusColor[project.status]}40`,
            fontSize: 10
          }}>
            {project.status}
          </span>
        </div>
        <div className="project-desc">{project.description || 'No description'}</div>
      </div>

      <div className="project-card-body">
        <div className="progress-bar-wrap">
          <div className="progress-label">
            <span className="progress-text">Progress</span>
            <span className="progress-pct">{project.progress || 0}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${project.progress || 0}%` }} />
          </div>
        </div>
      </div>

      <div className="project-card-footer">
        <div className="flex-center gap-3" style={{ justifyContent: 'space-between' }}>
          <div className="flex-center gap-1 text-sm text-muted">
            <CheckCircle2 size={13} />
            {project.doneTasks || 0}/{project.totalTasks || 0} tasks
          </div>
          <div className="flex-center gap-1 text-sm text-muted">
            <Users size={13} />
            {(project.members?.length || 0) + 1} members
          </div>
          {project.dueDate && (
            <div className="text-xs text-muted">
              Due {format(new Date(project.dueDate), 'MMM d')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;