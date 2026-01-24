import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { api } from '../../services/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users').then(({ data }) => setUsers(data)).catch(() => toast.error('Failed')).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin h-10 w-10 border-2 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Manage Users</h1>
      <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Name</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Email</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Role</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Streak</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Last Active</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {users.map((u) => (
              <tr key={u._id}>
                <td className="px-4 py-3 text-gray-900 dark:text-white">{u.name}</td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{u.email}</td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-xs ${u.role === 'admin' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-gray-100 dark:bg-gray-700'}`}>{u.role}</span></td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{u.streakCount ?? 0}</td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{u.lastActiveDate ? new Date(u.lastActiveDate).toLocaleDateString() : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
