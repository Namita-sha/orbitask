import { useState, useEffect } from 'react';
import API from '../api/axios';
import { Users } from 'lucide-react';
import toast from 'react-hot-toast';

const Team = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/auth/users')
      .then(res => setUsers(res.data))
      .catch(() => toast.error('Failed to load team'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="main-content">
      <div className="top-header">
        <div>
          <div className="page-title">Team</div>
          <div className="page-subtitle">{users.length} members in your organization</div>
        </div>
      </div>

      <div className="page-container">
        {loading ? (
          <div className="loading-center"><div className="loading-spinner" /></div>
        ) : (
          <div className="card">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => {
                    const initials = u.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                    return (
                      <tr key={u._id}>
                        <td>
                          <div className="flex-center gap-3">
                            <div className="user-avatar">{initials}</div>
                            <div className="font-bold text-sm">{u.name}</div>
                          </div>
                        </td>
                        <td><span className="text-sm text-muted">{u.email}</span></td>
                        <td>
                          <span className={`role-badge ${u.role === 'Admin' ? 'admin' : 'member'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td><span className="text-sm text-muted">{new Date(u.createdAt).toLocaleDateString()}</span></td>
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

export default Team;