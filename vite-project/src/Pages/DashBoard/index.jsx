import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import DashboardHome from './DashboardHome';
import Users from './Users';
import Internees from './Internees';
import Progress from './Progress';
import AssignTask from './AssignTask';

export default function DashboardRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<DashboardHome />} />
        <Route path="users" element={<Users />} />
        <Route path="internees" element={<Internees />} />
        <Route path="progress" element={<Progress />} />
        <Route path="assign-task" element={<AssignTask />} />
      </Route>
    </Routes>
  );
}
