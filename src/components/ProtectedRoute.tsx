
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';

type ProfileTipo = "admin" | "vendedor" | "avulso" | "despachante";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ProfileTipo[];
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
  
  // If there are specific role requirements, check if the user has the necessary role
  if (allowedRoles.length > 0) {
    const userRole = profile?.tipo;
    
    if (!userRole || !allowedRoles.includes(userRole)) {
      // Redirect to the dashboard appropriate for their role
      switch (userRole) {
        case 'admin':
          return <Navigate to="/admin/dashboard" replace />;
        case 'vendedor':
          return <Navigate to="/vendedor/dashboard" replace />;
        case 'avulso':
        case 'despachante':
          return <Navigate to="/cliente/dashboard" replace />;
        default:
          return <Navigate to="/dashboard" replace />;
      }
    }
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
