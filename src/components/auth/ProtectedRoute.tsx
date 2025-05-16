
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useEffect } from 'react';

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
  
  useEffect(() => {
    if (!isLoading && user) {
      console.log("Protected route accessed by:", user.email);
      console.log("User profile:", profile);
      console.log("Allowed roles:", allowedRoles);
    }
  }, [user, profile, isLoading, allowedRoles]);
  
  // Show a simple loading indicator while checking auth
  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        <p className="mt-4 text-lg">Carregando...</p>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    console.log("User not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }
  
  // If there are specific role requirements, check if the user has the necessary role
  if (allowedRoles.length > 0) {
    const userRole = profile?.tipo;
    
    if (!userRole || !allowedRoles.includes(userRole)) {
      console.log("User doesn't have required role. Current role:", userRole);
      console.log("Redirecting to appropriate dashboard...");
      
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
          console.log("No valid role found, redirecting to general dashboard");
          return <Navigate to="/dashboard" replace />;
      }
    }
  }
  
  // All checks passed, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
