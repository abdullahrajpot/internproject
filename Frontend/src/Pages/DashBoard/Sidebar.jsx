import { Link, useLocation } from 'react-router-dom';

const links = [
  { to: '/dashboard', label: 'Home' },
  { to: '/dashboard/users', label: 'Users' },
  { to: '/dashboard/internees', label: 'Internees' },
  { to: '/dashboard/progress', label: 'Progress' },
  { to: '/dashboard/assign-task', label: 'Assign Task' },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  return (
    <aside className="bg-gray-900 text-white w-60 min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-8">Admin Dashboard</h2>
      <nav className="flex flex-col gap-4">
        {links.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`py-2 px-4 rounded ${pathname === link.to ? 'bg-orange-500 text-white' : 'hover:bg-gray-700'}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
} 