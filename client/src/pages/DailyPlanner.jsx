import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { api } from '../services/api';

export default function DailyPlanner() {
  const [plan, setPlan] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [percent, setPercent] = useState(0);
  const [perDay, setPerDay] = useState(5);
  const [loading, setLoading] = useState(true);
  const [genLoading, setGenLoading] = useState(false);

  const load = () => {
    api.get('/daily-plan/today')
      .then(({ data }) => {
        setPlan(data.plan);
        setTasks(data.tasks || []);
        setCompleted(data.completedTasks || []);
        setPercent(data.completionPercent || 0);
      })
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const generate = () => {
    setGenLoading(true);
    api.post('/daily-plan/generate', { questionsPerDay: perDay })
      .then(({ data }) => {
        setPlan(data.plan);
        setTasks(data.plan?.tasks ? data.plan.tasks : []);
        setCompleted([]);
        setPercent(0);
        load();
        toast.success('Plan generated');
      })
      .catch((e) => toast.error(e.response?.data?.message || 'Generate failed'))
      .finally(() => setGenLoading(false));
  };

  const complete = (task) => {
    const qId = task._id;
    api.patch(`/daily-plan/complete/${qId}`)
      .then(({ data }) => {
        setPercent(data.completionPercent ?? 0);
        setCompleted((c) => [...c, task]);
        setTasks((t) => t.filter((x) => x._id !== qId));
        toast.success('Marked done');
      })
      .catch(() => toast.error('Failed'));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Daily Planner</h1>
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <label className="flex items-center gap-2">
          <span className="text-gray-600 dark:text-gray-400">Questions per day:</span>
          <input
            type="number"
            min={1}
            max={50}
            value={perDay}
            onChange={(e) => setPerDay(Number(e.target.value) || 5)}
            className="w-20 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          />
        </label>
        <button
          onClick={generate}
          disabled={genLoading}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {genLoading ? 'Generating…' : 'Generate today’s plan'}
        </button>
        <div className="text-gray-600 dark:text-gray-400">
          Today: <span className="font-medium text-gray-900 dark:text-white">{percent}%</span> complete
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin h-8 w-8 border-2 border-indigo-500 border-t-transparent rounded-full" /></div>
      ) : !plan && tasks.length === 0 ? (
        <div className="text-gray-500 dark:text-gray-400 py-12 text-center">
          No plan for today. Set questions per day and click &quot;Generate today’s plan&quot;.
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map((t) => (
            <div
              key={t._id}
              className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            >
              <div>
                <div className="font-medium text-gray-900 dark:text-white">{t.title}</div>
                {t.topicId?.name && <div className="text-sm text-gray-500 dark:text-gray-400">{t.topicId.name}</div>}
              </div>
              <div className="flex items-center gap-2">
                {t.link && <a href={t.link} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 text-sm">Link</a>}
                <button
                  onClick={() => complete(t)}
                  className="px-3 py-1.5 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700"
                >
                  Mark done
                </button>
              </div>
            </div>
          ))}
          {completed.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Completed</h3>
              {completed.map((c) => (
                <div key={c._id} className="py-2 text-gray-500 dark:text-gray-400 line-through">
                  {c.title || '—'}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
