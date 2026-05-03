import { format, isPast } from 'date-fns';
import { Calendar, AlertCircle } from 'lucide-react';

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

const TaskCard = ({ task, onClick }) => {
  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'Done';
  const assigneeName = task.assignedTo?.name || 'Unassigned';
  const initials = task.assignedTo?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '?';

  return (
    <div className={`task-card ${isOverdue ? 'overdue' : ''}`} onClick={() => onClick && onClick(task)}>
      <div className="flex-center gap-2 mb-2" style={{ justifyContent: 'space-between' }}>
        <span className={`badge ${priorityClass[task.priority]}`}>{task.priority}</span>
        {isOverdue && <AlertCircle size={14} color="var(--danger)" />}
      </div>

      <div className="task-title">{task.title}</div>

      {task.description && (
        <div className="task-desc" style={{
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}>
          {task.description}
        </div>
      )}

      <div className="task-meta">
        <div className="task-assignee">
          <div className="assignee-avatar">{initials}</div>
          <span>{assigneeName}</span>
        </div>

        {task.dueDate && (
          <div className={`task-due ${isOverdue ? 'overdue' : ''}`}>
            <Calendar size={11} />
            {format(new Date(task.dueDate), 'MMM d')}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;