import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../Contexts/AuthContext';

export default function Sidebar() {
  const { user } = useAuth();
  const { pathname } = useLocation();

  return (
    <aside className="bg-gray-900 text-white w-60 min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-8">Intern Dashboard</h2>
      <nav className="flex flex-col gap-4">
        <Link to="/interndashboard" className={`py-2 px-4 rounded ${pathname === '/interndashboard' ? 'bg-orange-500 text-white' : 'hover:bg-gray-700'}`}>Home</Link>
        {user?.role === 'intern' && (
          <Link to="/interndashboard/lms" className={`py-2 px-4 rounded ${pathname === '/intern-dashboard/lms' ? 'bg-orange-500 text-white' : 'hover:bg-gray-700'}`}>LMS</Link>
        )}
      </nav>
    </aside>
  );
} 