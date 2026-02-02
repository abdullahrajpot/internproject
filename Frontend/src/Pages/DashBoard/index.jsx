import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import DashboardHome from './DashboardHome';
import Users from './Users';
import Internees from './Internees';
import Progress from './Progress';
import AssignTask from './AssignTask';
import Analytics from './Analytics';
import Communications from './Communications';
import Settings from './Settings';
import ErrorBoundary from '../../components/ErrorBoundary';

export default function DashboardRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={
          <ErrorBoundary fallbackMessage="Error loading dashboard home">
            <DashboardHome />
          </ErrorBoundary>
        } />
        <Route path="users" element={
          <ErrorBoundary fallbackMessage="Error loading users page">
            <Users />
          </ErrorBoundary>
        } />
        <Route path="internees" element={
          <ErrorBoundary fallbackMessage="Error loading internees page">
            <Internees />
          </ErrorBoundary>
        } />
        <Route path="progress" element={
          <ErrorBoundary fallbackMessage="Error loading progress page">
            <Progress />
          </ErrorBoundary>
        } />
        <Route path="assign-task" element={
          <ErrorBoundary fallbackMessage="Error loading assign task page">
            <AssignTask />
          </ErrorBoundary>
        } />
        <Route path="analytics" element={
          <ErrorBoundary fallbackMessage="Error loading analytics page">
            <Analytics />
          </ErrorBoundary>
        } />
        <Route path="communications" element={
          <ErrorBoundary fallbackMessage="Error loading communications page">
            <Communications />
          </ErrorBoundary>
        } />
        <Route path="settings" element={
          <ErrorBoundary fallbackMessage="Error loading settings page">
            <Settings />
          </ErrorBoundary>
        } />
      </Route>
    </Routes>
  );
}
