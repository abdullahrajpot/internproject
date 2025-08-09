import { Routes, Route } from 'react-router-dom';
import InternDashboardLayout from './InternDashboardLayout';
import Home from './Home';
import LMS from './LMS';

export default function InternDashboardRoutes() {
  return (
    <Routes>
      <Route path="/" element={<InternDashboardLayout />}>
        <Route index element={<Home />} />
        <Route path="lms" element={<LMS />} />
      </Route>
    </Routes>
  );
} 