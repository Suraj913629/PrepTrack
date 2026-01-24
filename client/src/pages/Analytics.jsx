import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { api } from '../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';


const COLORS = ['#6366f1', '#22c55e', '#eab308', '#ef4444', '#8b5cf6', '#ec4899'];

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/analytics')
      .then((res) => setData(res.data))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin h-10 w-10 border-2 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    );
  }
  if (!data) return <div className="text-gray-500 dark:text-gray-400">Could not load analytics.</div>;

  const topicPie = (data.topicWise || []).map((t, i) => ({ name: t.name, value: t.done, color: COLORS[i % COLORS.length] }));
  const diffPie = (data.difficultyWise || []).map((d, i) => ({ name: d.name, value: d.done, color: COLORS[i % COLORS.length] }));

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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <button onClick={exportPdf} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800">
          Export PDF
        </button>
      </div>
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Topic-wise progress (Done)</h2>
          {topicPie.some((t) => t.value > 0) ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={topicPie}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, value }) => (value ? `${name}: ${value}` : '')}
                >
                  {topicPie.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[260px] flex items-center justify-center text-gray-500 dark:text-gray-400">No data yet</div>
          )}
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Difficulty-wise (Done)</h2>
          {diffPie.some((d) => d.value > 0) ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={diffPie}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, value }) => (value ? `${name}: ${value}` : '')}
                >
                  {diffPie.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[260px] flex items-center justify-center text-gray-500 dark:text-gray-400">No data yet</div>
          )}
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Weekly progress (completed per day)</h2>
        {(data.weeklyProgress || []).some((d) => d.count > 0) ? (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.weeklyProgress || []}>
              <XAxis dataKey="day" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ backgroundColor: 'var(--tw-bg-opacity, 1)', border: '1px solid #e5e7eb' }}
                labelStyle={{ color: '#374151' }}
              />
              <Bar dataKey="count" fill="#6366f1" name="Completed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[280px] flex items-center justify-center text-gray-500 dark:text-gray-400">No data yet</div>
        )}
      </div>
    </div>
  );
}
