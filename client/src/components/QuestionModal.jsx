import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { api } from '../services/api';

const STATUSES = ['Not Started', 'Done', 'Revising', 'Skipped'];

export default function QuestionModal({ question, progress, onClose, onProgress }) {
  const [status, setStatus] = useState(progress?.status || 'Not Started');
  const [note, setNote] = useState(progress?.note || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setStatus(progress?.status || 'Not Started');
    setNote(progress?.note || '');
  }, [progress, question?._id]);

  const save = async () => {
    setSaving(true);
    try {
      await api.patch(`/progress/${question._id}`, { status, note });
      onProgress(question._id, { status, note });
      toast.success('Saved');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (!question) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-lg w-full p-6 border border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{question.title}</h2>
        <div className="flex gap-2 mb-4">
          <span className={`px-2 py-0.5 rounded text-xs ${
            question.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
            question.difficulty === 'Hard' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
          }`}>{question.difficulty || 'Medium'}</span>
          {question.topicId?.name && (
            <span className="px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">{question.topicId.name}</span>
          )}
        </div>
        {question.link && (
          <a href={question.link} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm mb-4 block">
            Open on Leetcode/GFG →
          </a>
        )}
        <label className="block mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        <label className="block mb-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">Note</span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Your notes..."
          />
        </label>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
            Close
          </button>
          <button onClick={save} disabled={saving} className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50">
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
