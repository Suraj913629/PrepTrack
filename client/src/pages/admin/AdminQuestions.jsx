import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { api } from '../../services/api';

export default function AdminQuestions() {
  const [sheets, setSheets] = useState([]);
  const [topics, setTopics] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ sheetId: '', topicId: '', title: '', link: '', difficulty: 'Medium' });
  const [importJson, setImportJson] = useState('');
  const [importTopic, setImportTopic] = useState('');
  const [importSheet, setImportSheet] = useState('');

  useEffect(() => {
    api.get('/sheets').then(({ data }) => setSheets(data));
  }, []);

  const loadTopics = (sheetId) => {
    if (!sheetId) return setTopics([]);
    api.get('/topics', { params: { sheetId } }).then(({ data }) => setTopics(data));
  };

  const load = () => api.get('/questions').then(({ data }) => setQuestions(data)).catch(() => toast.error('Failed')).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm({ sheetId: sheets[0]?._id || '', topicId: '', title: '', link: '', difficulty: 'Medium' });
    setModal('create');
    if (sheets[0]?._id) loadTopics(sheets[0]._id);
  };
  const openEdit = (q) => {
    setForm({
      sheetId: q.sheetId?._id || q.sheetId || '',
      topicId: q.topicId?._id || q.topicId || '',
      title: q.title,
      link: q.link || '',
      difficulty: q.difficulty || 'Medium',
    });
    setModal({ type: 'edit', id: q._id });
    loadTopics(q.sheetId?._id || q.sheetId);
  };

  const onSheetChange = (sid) => {
    setForm((f) => ({ ...f, sheetId: sid, topicId: '' }));
    loadTopics(sid);
  };

  const save = async (e) => {
    e.preventDefault();
    try {
      if (modal === 'create') {
        await api.post('/questions', form);
        toast.success('Question created');
      } else if (modal?.type === 'edit') {
        await api.patch(`/questions/${modal.id}`, form);
        toast.success('Question updated');
      }
      setModal(null);
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed');
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this question?')) return;
    try {
      await api.delete(`/questions/${id}`);
      toast.success('Deleted');
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed');
    }
  };

  const handleBulkImport = async (e) => {
    e.preventDefault();
    let arr;
    try {
      arr = JSON.parse(importJson);
      if (!Array.isArray(arr)) throw new Error('Must be an array');
    } catch (err) {
      toast.error('Invalid JSON or not an array');
      return;
    }
    const sheetId = importSheet || undefined;
    const topicId = importTopic || undefined;
    if (!sheetId || !topicId) {
      toast.error('Select sheet and topic for import');
      return;
    }
    const toInsert = arr.map((o) => ({
      sheetId,
      topicId,
      title: o.title || o.name || String(o),
      link: o.link || o.url || '',
      difficulty: ['Easy', 'Medium', 'Hard'].includes(o.difficulty) ? o.difficulty : 'Medium',
    }));
    try {
      await api.post('/questions/bulk', { questions: toInsert });
      toast.success(`Imported ${toInsert.length} questions`);
      setImportJson('');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Import failed');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Manage Questions</h1>
      <div className="flex flex-wrap gap-4 mb-6">
        <button onClick={openCreate} className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">Add Question</button>
        <div className="flex-1" />
        <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
          <summary className="cursor-pointer font-medium text-gray-900 dark:text-white">Bulk import (JSON)</summary>
          <form onSubmit={handleBulkImport} className="mt-4 space-y-2">
            <select value={importSheet} onChange={(e) => { const v = e.target.value; setImportSheet(v); setImportTopic(''); loadTopics(v); }} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" required>
              <option value="">Sheet</option>
              {sheets.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
            <select value={importTopic} onChange={(e) => setImportTopic(e.target.value)} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" required>
              <option value="">Topic</option>
              {topics.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
            </select>
            <textarea value={importJson} onChange={(e) => setImportJson(e.target.value)} placeholder='[{"title":"Q1","link":"https://...","difficulty":"Medium"},...]' rows={4} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 font-mono text-sm" />
            <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-600 text-white">Import</button>
          </form>
        </details>
      </div>
      {loading ? (
        <div className="flex justify-center py-8"><div className="animate-spin h-8 w-8 border-2 border-indigo-500 border-t-transparent rounded-full" /></div>
      ) : (
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Title</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Topic</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Difficulty</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {questions.map((q) => (
                <tr key={q._id}>
                  <td className="px-4 py-3 text-gray-900 dark:text-white">{q.title}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{q.topicId?.name || q.topicId || '—'}</td>
                  <td className="px-4 py-3">{q.difficulty || 'Medium'}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => openEdit(q)} className="text-indigo-600 dark:text-indigo-400 hover:underline mr-2">Edit</button>
                    <button onClick={() => remove(q._id)} className="text-red-600 dark:text-red-400 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setModal(null)}>
          <form onSubmit={save} className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{modal === 'create' ? 'New Question' : 'Edit Question'}</h2>
            <label className="block mb-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">Sheet</span>
              <select value={form.sheetId} onChange={(e) => onSheetChange(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" required>
                <option value="">Select</option>
                {sheets.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
            </label>
            <label className="block mb-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">Topic</span>
              <select value={form.topicId} onChange={(e) => setForm((f) => ({ ...f, topicId: e.target.value }))} className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" required>
                <option value="">Select</option>
                {topics.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
              </select>
            </label>
            <label className="block mb-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">Title</span>
              <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" required />
            </label>
            <label className="block mb-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">Link</span>
              <input value={form.link} onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))} type="url" placeholder="https://..." className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" />
            </label>
            <label className="block mb-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">Difficulty</span>
              <select value={form.difficulty} onChange={(e) => setForm((f) => ({ ...f, difficulty: e.target.value }))} className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700">
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </label>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setModal(null)} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-600 text-white">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
