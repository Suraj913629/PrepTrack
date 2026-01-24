import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Landing() {
  const { user } = useAuth();
  const { dark, toggle } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950">
      <header className="flex justify-between items-center px-6 py-4">
        <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">PrepTrack</span>
        <div className="flex items-center gap-4">
          <button
            onClick={toggle}
            className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
            aria-label="Toggle theme"
          >
            {dark ? '☀️' : '🌙'}
          </button>
          {user ? (
            <Link
              to="/dashboard"
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:underline">
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Track DSA & Placement Prep
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          Striver-style sheet tracker, daily planner, streaks, analytics, and PDF export. Built for serious preparers.
        </p>
        {!user && (
          <Link
            to="/register"
            className="inline-block px-8 py-4 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow-lg"
          >
            Start for free
          </Link>
        )}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
          {['Sheets & Topics', 'Daily Planner', 'Streaks & Analytics', 'PDF Export'].map((t) => (
            <div
              key={t}
              className="p-4 rounded-xl bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700"
            >
              <span className="font-medium text-gray-900 dark:text-white">{t}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
