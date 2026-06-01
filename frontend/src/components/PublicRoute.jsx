import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function PublicRoute({ children }) {
  const { currentUser, loading, userEmail } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  const isAuthenticated = !!currentUser || !!userEmail;

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return children;
}
