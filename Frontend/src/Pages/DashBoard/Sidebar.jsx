import { Link, useLocation } from 'react-router-dom';
import {
  FaTimes,
  FaHome,
  FaUsers,
  FaUserGraduate,
  FaChartLine,
  FaTasks,
  FaSignOutAlt,
  FaChartBar,
  FaEnvelope,
  FaCog
} from 'react-icons/fa';
import { useSettings } from '../../Contexts/SettingsContext';

const links = [
  { to: '/dashboard', label: 'Home', icon: FaHome },
  { to: '/dashboard/users', label: 'Users', icon: FaUsers },
  { to: '/dashboard/internees', label: 'Internees', icon: FaUserGraduate },
  { to: '/dashboard/progress', label: 'Progress', icon: FaChartLine },
  { to: '/dashboard/assign-task', label: 'Assign Task', icon: FaTasks },
  { to: '/dashboard/analytics', label: 'Analytics', icon: FaChartBar },
  { to: '/dashboard/communications', label: 'Communications', icon: FaEnvelope },
  { to: '/dashboard/settings', label: 'Settings', icon: FaCog },
];

export default function Sidebar({ onClose }) {
  const { pathname } = useLocation();
  const { settings } = useSettings();
  const siteName = settings.general?.siteName || 'Admin Panel';
  const primaryColor = settings.appearance?.primaryColor || '#3B82F6';

  return (
    <aside className="bg-gray-900 text-white w-64 h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">{siteName}</h2>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation - SCROLLABLE */}
      <nav className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-2">
          {links.map(link => {
            const Icon = link.icon;
            const isActive = pathname === link.to;

            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={`flex items-center space-x-3 py-3 px-4 rounded-lg transition-colors duration-200 ${isActive
                    ? 'text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                style={isActive ? { backgroundColor: primaryColor } : {}}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer - FIXED AT BOTTOM */}
      <div className="p-6 border-t border-gray-700 flex-shrink-0">
        <button className="flex items-center space-x-3 w-full py-3 px-4 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors duration-200">
          <FaSignOutAlt className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
} 