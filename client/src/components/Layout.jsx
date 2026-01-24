import { Outlet } from 'react-router-dom';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const nav = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/tracker', label: 'Tracker' },
  { to: '/planner', label: 'Planner' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/profile', label: 'Profile' },
];

const adminNav = [
  { to: '/dashboard', label: '← App' },
  { to: '/admin', label: 'Admin' },
  { to: '/admin/sheets', label: 'Sheets' },
  { to: '/admin/topics', label: 'Topics' },
  { to: '/admin/questions', label: 'Questions' },
  { to: '/admin/users', label: 'Users' },
];

export default function Layout() {
  const { user } = useAuth();
  const { dark, toggle } = useTheme();
  const loc = useLocation();
  const isAdmin = user?.role === 'admin';
  const isAdminPath = loc.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <Link to={isAdmin ? '/admin' : '/dashboard'} className="font-semibold text-lg text-indigo-600 dark:text-indigo-400">
            PrepTrack
          </Link>
          <nav className="flex items-center gap-1">
            {(isAdminPath ? adminNav : nav).map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  loc.pathname === to
                    ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {label}
              </Link>
            ))}
            {isAdmin && !isAdminPath && (
              <Link to="/admin" className="px-3 py-2 rounded-md text-sm text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20">
                Admin
              </Link>
            )}
            <button
              type="button"
              onClick={toggle}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Toggle dark mode"
            >
              {dark ? '☀️' : '🌙'}
            </button>
            <Link to="/profile" className="ml-2 px-3 py-1.5 text-sm rounded-lg bg-gray-100 dark:bg-gray-700">
              {user?.name}
            </Link>
          </nav>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <Outlet />
      </main>
    </div>
  );
}
