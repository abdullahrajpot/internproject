import { Routes, Route } from 'react-router-dom';
import InternDashboardLayout from './InternDashboardLayout';
import Home from './Home';
import LMS from './LMS';
import Tasks from './Tasks';
import Calendar from './Calender';
import Profile from './Profile';
import Reports from './Reports';
import ResourceLibrary from './ResourceLibrary';
import ContactSupport from './ContactSupport';
export default function InternDashboardRoutes() {
  return (
    <Routes>
      <Route path="/" element={<InternDashboardLayout />}>
        <Route index element={<Home />} />
        <Route path="lms" element={<LMS />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="Reports" element={<Reports />} />
        <Route path="calender" element={<Calendar />} />
        <Route path="Profile" element={<Profile />} />
        <Route path="documents" element={<ResourceLibrary />} />
        <Route path="support" element={<ContactSupport />} />

      </Route>
    </Routes>
  );
} 