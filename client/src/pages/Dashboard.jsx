import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../services/api';

const stat = (label, value, sub) => (
  <div key={label} className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
    <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
    <div className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">{value}</div>
    {sub != null && <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{sub}</div>}
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard').then(({ data }) => setStats(data)).catch(() => toast.error('Failed to load')).finally(() => setLoading(false));
  }, []);

  const exportPdf = async () => {
    try {
      const { data } = await api.get('/export/progress/pdf', { responseType: 'blob' });
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `preptrack-progress-${new Date().toISOString().slice(0, 10)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('PDF downloaded');
    } catch (e) {
      toast.error('Export failed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-10 w-10 border-2 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!stats) return <div className="text-gray-500 dark:text-gray-400">Could not load stats.</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {stat('Total questions', stats.totalQuestions)}
        {stat('Completed', stats.completed)}
        {stat('Revising', stats.revising)}
        {stat('Skipped', stats.skipped)}
        {stat('Current streak', stats.streakCount, 'days')}
        {stat('Last active', stats.lastActiveDate ? new Date(stats.lastActiveDate).toLocaleDateString() : '—')}
        {stat("Today's progress", `${stats.todayDone}/${stats.todayTotal}`, stats.todayPercent != null ? `${stats.todayPercent}%` : null)}
      </div>
      <div className="flex flex-wrap gap-4">
        <Link to="/tracker" className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">Open Tracker</Link>
        <Link to="/planner" className="px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800">Daily Planner</Link>
        <Link to="/analytics" className="px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800">Analytics</Link>
        <button onClick={exportPdf} className="px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800">
          Export PDF
        </button>
      </div>
    </div>
  );
}
