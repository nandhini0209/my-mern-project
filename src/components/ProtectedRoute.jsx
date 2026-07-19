import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner message="Authenticating..." />;

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  if (adminOnly && user.role !== 'Admin') return <Navigate to="/" replace />;

  return children;
}
