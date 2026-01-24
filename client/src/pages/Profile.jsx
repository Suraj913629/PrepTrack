import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Profile</h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 max-w-md">
        <div className="mb-4">
          <span className="text-sm text-gray-500 dark:text-gray-400">Name</span>
          <div className="text-gray-900 dark:text-white">{user?.name}</div>
        </div>
        <div className="mb-4">
          <span className="text-sm text-gray-500 dark:text-gray-400">Email</span>
          <div className="text-gray-900 dark:text-white">{user?.email}</div>
        </div>
        <div className="mb-6">
          <span className="text-sm text-gray-500 dark:text-gray-400">Role</span>
          <div className="text-gray-900 dark:text-white capitalize">{user?.role}</div>
        </div>
        {user?.role === 'admin' && (
          <Link to="/admin" className="block mb-4 text-indigo-600 dark:text-indigo-400 hover:underline">
            Open Admin Panel →
          </Link>
        )}
        <button
          onClick={logout}
          className="px-4 py-2 rounded-lg border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
