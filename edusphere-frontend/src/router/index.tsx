import { createBrowserRouter, Navigate } from 'react-router-dom';

// Authentication components
import { UserRoute, ModeratorRoute, AdminRoute } from '../components/ProtectedRoute';
import GuestRoute from '../components/GuestRoute';
import HomeRedirect from '../components/HomeRedirect';

// Landing pages
import Home from '../landing/home/home';
import About from '../landing/about/about';
import Contact from '../landing/contact/contact';
import Login from '../landing/login/login';
import Signup from '../landing/signup/signup';

// App components
import Dashboard from '../app/dashboard/dashboard';
import Profile from '../app/profile/profile';
import Rooms from '../app/rooms/rooms';
import ChatRoom from '../app/chatRoom/chatRoom';
import AiAssistant from '../app/aiAssistant/asAssistant';

// Manage components (Room Admin level)
import ManageDashboard from '../app/manage/manageDashboard';
import ManageRooms from '../app/manage/manageRooms';
import ManageStudents from '../app/manage/manageStudents';

// Admin components (Admin level)
import AdminDashboard from '../app/admin/adminDashboard';
import UserManagement from '../app/admin/userManagement';
import SystemSettings from '../app/admin/systemSettings';

// Layout components
import LandingLayout from '../layouts/LandingLayout';
import AppLayout from '../layouts/AppLayout';

/**
 * Main router configuration for the EduSphere application
 * Implements role-based routing with proper protection levels:
 * - Public routes (accessible without authentication)
 * - Guest routes (only accessible to non-authenticated users)
 * - User routes (requires USER role or higher)
 * - Room Admin routes (requires MODERATOR role or higher)
 * - Admin routes (requires ADMIN role)
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingLayout />,
    children: [
      {
        index: true,
        element: (
          <HomeRedirect>
            <Home />
          </HomeRedirect>
        )
      },
      {
        path: 'about',
        element: <About />
      },
      {
        path: 'contact',
        element: <Contact />
      },
      {
        path: 'login',
        element: (
          <GuestRoute>
            <Login />
          </GuestRoute>
        )
      },
      {
        path: 'signup',
        element: (
          <GuestRoute>
            <Signup />
          </GuestRoute>
        )
      }
    ]
  },
  {
    path: '/app',
    element: (
      <UserRoute>
        <AppLayout />
      </UserRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/app/dashboard" replace />
      },
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'profile',
        element: <Profile />
      },
      {
        path: 'rooms',
        element: <Rooms />
      },
      {
        path: 'rooms/:roomId',
        element: <ChatRoom />
      },
      {
        path: 'ai-assistant',
        element: <AiAssistant />
      },
      // Room Admin routes - accessible by MODERATOR and ADMIN roles
      {
        path: 'manage',
        element: <ModeratorRoute><ManageDashboard /></ModeratorRoute>
      },
      {
        path: 'manage/rooms',
        element: <ModeratorRoute><ManageRooms /></ModeratorRoute>
      },
      {
        path: 'manage/students',
        element: <ModeratorRoute><ManageStudents /></ModeratorRoute>
      },
      // Admin-only routes
      {
        path: 'admin',
        element: <AdminRoute><AdminDashboard /></AdminRoute>
      },
      {
        path: 'admin/users',
        element: <AdminRoute><UserManagement /></AdminRoute>
      },
      {
        path: 'admin/settings',
        element: <AdminRoute><SystemSettings /></AdminRoute>
      }
    ]
  },
  // Legacy routes for backward compatibility
  {
    path: '/dashboard',
    element: <Navigate to="/app/dashboard" replace />
  },
  {
    path: '/profile',
    element: <Navigate to="/app/profile" replace />
  },
  {
    path: '/rooms',
    element: <Navigate to="/app/rooms" replace />
  },
  // Catch-all route for 404 pages
  {
    path: '*',
    element: (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900">404</h1>
          <p className="text-xl text-gray-600 mt-4">Page not found</p>
          <a
            href="/"
            className="mt-6 inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    )
  }
]);

export default router;
