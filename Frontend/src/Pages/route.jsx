import { createBrowserRouter } from 'react-router-dom';
import App from '../App'; // Root layout with Header
import Home from './Frontend/Home';
import About from './Frontend/About';
import Auth from './Auth';
import Login from './Auth/Login';
import Register from './Auth/Register';
import ForgotPassword from './Auth/ForgotPassword';
import Internship from './Frontend/Internship';
import Services from './Frontend/Services';
import ResetPassword from './Auth/ResetPassword';
import Roadmap from './Frontend/Roadmap';
import RoadmapDetail from './Frontend/RoadmapDetail';
import StepResources from './Frontend/RoadmapDetail/StepResources';
import DashboardRoutes from './DashBoard';
import ProtectedRoute from '../components/ProtectedRoute';
import InternDashboardRoutes from './InternDashboard';
import Profile from './Frontend/Profile';
import RoadmapGenerator from './Frontend/RoadmapGenerator';

const Router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // This includes the Header
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'internship', element: <Internship /> },
      { path: 'services', element: <Services /> },
      { path: 'roadmap', element: <Roadmap/> },
      { path: 'roadmap/:id', element: <RoadmapDetail/> },
      { path: 'roadmap-generator', element: <RoadmapGenerator /> },
      { path: 'roadmap/:roadmapId/step/:stepId', element: <StepResources/> },
      { path: 'profile', element: (
        <ProtectedRoute allowedRoles={['admin', 'intern', 'user']}>
          <Profile />
        </ProtectedRoute>
      ) },
    ]
  },
  {
    path: '/auth',
    element: <Auth />,
    children: [
      { index: true, element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "reset-password", element: <ResetPassword /> }
    ]
  },
  {
    path: '/dashboard/*',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <DashboardRoutes />
      </ProtectedRoute>
    )
  }
  , {
    path: '/interndashboard/*',
    element: (
      <ProtectedRoute allowedRoles={['intern']}>
        <InternDashboardRoutes />
      </ProtectedRoute>
    )
  }
]);

export default Router;
