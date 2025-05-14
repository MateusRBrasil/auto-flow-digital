
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = [] 
}) => {
  const { user, profile, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="h-screen w-full flex items-center justify-center">Carregando...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // If specific roles are required, check if user has the necessary role
  if (allowedRoles.length > 0) {
    const userRole = profile?.tipo || 'cliente';
    
    if (!allowedRoles.includes(userRole)) {
      // Redirect to appropriate dashboard based on role
      switch (userRole) {
        case 'admin':
          return <Navigate to="/admin/dashboard" replace />;
        case 'vendedor':
          return <Navigate to="/dashboard/vendedor" replace />;
        default:
          return <Navigate to="/dashboard" replace />;
      }
    }
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
