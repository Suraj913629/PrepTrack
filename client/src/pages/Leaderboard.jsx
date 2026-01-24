import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { api } from '../services/api';

export default function Leaderboard() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/leaderboard').then(({ data }) => setList(data)).catch(() => toast.error('Failed to load')).finally(() => setLoading(false));
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
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Leaderboard</h1>
      <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-xl">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-400">#</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Name</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Completed</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Streak</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-400">This week</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {list.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">No entries yet.</td></tr>
            ) : (
              list.map((u, i) => (
                <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{i + 1}</td>
                  <td className="px-4 py-3 text-gray-900 dark:text-white">{u.name}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{u.completed ?? 0}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{u.streak ?? 0}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{u.weeklyCompleted ?? 0}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
