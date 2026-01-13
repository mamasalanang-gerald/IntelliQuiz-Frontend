import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts
import SuperAdminLayout from '../components/superadmin/SuperAdminLayout';
import AdminLayout from '../components/admin/AdminLayout';

// Super Admin Pages
import SuperAdminDashboardPage from '../pages/superadmin/DashboardPage';
import UsersPage from '../pages/superadmin/UsersPage';
import SuperAdminQuizzesPage from '../pages/superadmin/QuizzesPage';
import SuperAdminQuestionsPage from '../pages/superadmin/QuestionsPage';
import PermissionsPage from '../pages/superadmin/PermissionsPage';
import SuperAdminTeamsPage from '../pages/superadmin/TeamsPage';
import SuperAdminScoreboardPage from '../pages/superadmin/ScoreboardPage';

// Admin Pages
import AdminDashboardPage from '../pages/admin/DashboardPage';
import AdminQuizzesPage from '../pages/admin/QuizzesPage';
import AdminQuestionsPage from '../pages/admin/QuestionsPage';
import AdminTeamsPage from '../pages/admin/TeamsPage';
import AdminScoreboardPage from '../pages/admin/ScoreboardPage';
import AdminHostPage from '../pages/admin/HostPage';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  // Super Admin Routes
  {
    path: '/superadmin',
    element: <SuperAdminLayout />,
    children: [
      { index: true, element: <SuperAdminDashboardPage /> },
      { path: 'users', element: <UsersPage /> },
      { path: 'quizzes', element: <SuperAdminQuizzesPage /> },
      { path: 'quizzes/:quizId/questions', element: <SuperAdminQuestionsPage /> },
      { path: 'permissions', element: <PermissionsPage /> },
      { path: 'teams', element: <SuperAdminTeamsPage /> },
      { path: 'scoreboard', element: <SuperAdminScoreboardPage /> },
    ],
  },
  // Admin Routes
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'quizzes', element: <AdminQuizzesPage /> },
      { path: 'quizzes/:quizId/questions', element: <AdminQuestionsPage /> },
      { path: 'teams', element: <AdminTeamsPage /> },
      { path: 'scoreboard', element: <AdminScoreboardPage /> },
      { path: 'host', element: <AdminHostPage /> },
    ],
  },
]);

export default router;
