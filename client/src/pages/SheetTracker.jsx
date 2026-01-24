import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { api } from '../services/api';
import QuestionModal from '../components/QuestionModal';

export default function SheetTracker() {
  const [sheets, setSheets] = useState([]);
  const [topics, setTopics] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [progress, setProgress] = useState({});
  const [sheetId, setSheetId] = useState(null);
  const [topicFilter, setTopicFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalQ, setModalQ] = useState(null);

  useEffect(() => {
    api.get('/sheets').then(({ data }) => {
      setSheets(data);
      if (data.length && !sheetId) setSheetId(data[0]._id);
    }).catch(() => toast.error('Failed to load sheets'));
  }, []);

  useEffect(() => {
    if (!sheetId) return;
    api.get('/topics', { params: { sheetId } }).then(({ data }) => setTopics(data)).catch(() => {});
  }, [sheetId]);

  useEffect(() => {
    const p = { sheetId, topicId: topicFilter || undefined, difficulty: difficultyFilter || undefined, search: search || undefined };
    api.get('/questions', { params: p }).then(({ data }) => setQuestions(data)).catch(() => toast.error('Failed to load questions'));
    api.get('/progress').then(({ data }) => setProgress(data)).catch(() => {});
  }, [sheetId, topicFilter, difficultyFilter, search]);

  useEffect(() => { setLoading(false); }, [sheets, topics, questions]);

  const filtered = questions.filter((q) => {
    if (statusFilter) {
      const p = progress[q._id];
      const s = (p?.status || 'Not Started');
      if (s !== statusFilter) return false;
    }
    return true;
  });

  const onProgress = (qId, data) => {
    setProgress((prev) => ({
      ...prev,
      [qId]: { ...prev[qId], ...data },
    }));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Sheet Tracker</h1>
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={sheetId || ''}
          onChange={(e) => setSheetId(e.target.value || null)}
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="">Select sheet</option>
          {sheets.map((s) => (
            <option key={s._id} value={s._id}>{s.name}</option>
          ))}
        </select>
        <select
          value={topicFilter}
          onChange={(e) => setTopicFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="">All topics</option>
          {topics.map((t) => (
            <option key={t._id} value={t._id}>{t.name}</option>
          ))}
        </select>
        <select
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="">All difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="">All statuses</option>
          <option value="Not Started">Not Started</option>
          <option value="Done">Done</option>
          <option value="Revising">Revising</option>
          <option value="Skipped">Skipped</option>
        </select>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white min-w-[180px]"
        />
      </div>
      {filtered.length === 0 ? (
        <div className="text-gray-500 dark:text-gray-400 py-12 text-center">No questions match filters.</div>
      ) : (
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Title</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Topic</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Difficulty</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Status</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filtered.map((q) => {
                const p = progress[q._id];
                const status = p?.status || 'Not Started';
                return (
                  <tr key={q._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-3 text-gray-900 dark:text-white">{q.title}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{q.topicId?.name || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        q.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                        q.difficulty === 'Hard' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>{q.difficulty || 'Medium'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        status === 'Done' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400' :
                        status === 'Revising' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                        status === 'Skipped' ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400' :
                        'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-500'
                      }`}>{status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setModalQ(q)}
                        className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm"
                      >
                        Open
                      </button>
                      {q.link && (
                        <a href={q.link} target="_blank" rel="noopener noreferrer" className="ml-2 text-indigo-600 dark:text-indigo-400 hover:underline text-sm">
                          Link
                        </a>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {modalQ && (
        <QuestionModal
          question={modalQ}
          progress={progress[modalQ._id]}
          onClose={() => setModalQ(null)}
          onProgress={onProgress}
        />
      )}
    </div>
  );
}
