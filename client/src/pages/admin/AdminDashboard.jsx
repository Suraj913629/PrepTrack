import { Link } from 'react-router-dom';

const links = [
  { to: '/admin/sheets', label: 'Manage Sheets' },
  { to: '/admin/topics', label: 'Manage Topics' },
  { to: '/admin/questions', label: 'Manage Questions' },
  { to: '/admin/users', label: 'Manage Users' },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Admin Dashboard</h1>
      <div className="grid sm:grid-cols-2 gap-4">
        {links.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-indigo-300 dark:hover:border-indigo-600"
          >
            <span className="font-medium text-gray-900 dark:text-white">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
