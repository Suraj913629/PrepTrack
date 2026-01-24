import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { api } from '../../services/api';

export default function AdminTopics() {
  const [sheets, setSheets] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ sheetId: '', name: '' });

  useEffect(() => {
    api.get('/sheets').then(({ data }) => setSheets(data)).catch(() => {});
  }, []);

  const load = () => api.get('/topics').then(({ data }) => setTopics(data)).catch(() => toast.error('Failed')).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm({ sheetId: sheets[0]?._id || '', name: '' });
    setModal('create');
  };
  const openEdit = (t) => {
    setForm({ sheetId: t.sheetId?._id || t.sheetId || '', name: t.name });
    setModal({ type: 'edit', id: t._id });
  };

  const save = async (e) => {
    e.preventDefault();
    try {
      if (modal === 'create') {
        await api.post('/topics', form);
        toast.success('Topic created');
      } else if (modal?.type === 'edit') {
        await api.patch(`/topics/${modal.id}`, { name: form.name, sheetId: form.sheetId });
        toast.success('Topic updated');
      }
      setModal(null);
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed');
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this topic and its questions?')) return;
    try {
      await api.delete(`/topics/${id}`);
      toast.success('Deleted');
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Manage Topics</h1>
      <button onClick={openCreate} className="mb-4 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">Add Topic</button>
      {loading ? (
        <div className="flex justify-center py-8"><div className="animate-spin h-8 w-8 border-2 border-indigo-500 border-t-transparent rounded-full" /></div>
      ) : (
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Sheet</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Name</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {topics.map((t) => (
                <tr key={t._id}>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{t.sheetId?.name || t.sheetId || '—'}</td>
                  <td className="px-4 py-3 text-gray-900 dark:text-white">{t.name}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => openEdit(t)} className="text-indigo-600 dark:text-indigo-400 hover:underline mr-2">Edit</button>
                    <button onClick={() => remove(t._id)} className="text-red-600 dark:text-red-400 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setModal(null)}>
          <form onSubmit={save} className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{modal === 'create' ? 'New Topic' : 'Edit Topic'}</h2>
            <label className="block mb-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">Sheet</span>
              <select value={form.sheetId} onChange={(e) => setForm((f) => ({ ...f, sheetId: e.target.value }))} className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" required>
                <option value="">Select</option>
                {sheets.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
            </label>
            <label className="block mb-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">Name</span>
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" required />
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
