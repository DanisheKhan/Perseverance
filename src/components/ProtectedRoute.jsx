import { Navigate } from 'react-router-dom';
import { useHabits } from '../context/HabitContext';

const ProtectedRoute = ({ children, requireAuth = false }) => {
  const { isAuthenticated, isLoading } = useHabits();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // If route requires authentication and user is not authenticated, redirect to login
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If user is authenticated and tries to access login/register, redirect to dashboard
  if (isAuthenticated && (window.location.pathname === '/login' || window.location.pathname === '/register')) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
