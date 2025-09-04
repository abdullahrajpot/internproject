import { Routes, Route } from 'react-router-dom';
import InternDashboardLayout from './InternDashboardLayout';
import Home from './Home';
import LMS from './LMS';
import Tasks from './Tasks';
import Calendar from './Calender';
export default function InternDashboardRoutes() {
  return (
    <Routes>
      <Route path="/" element={<InternDashboardLayout />}>
        <Route index element={<Home />} />
        <Route path="lms" element={<LMS />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="calender" element={<Calendar />} />


      </Route>
    </Routes>
  );
} 