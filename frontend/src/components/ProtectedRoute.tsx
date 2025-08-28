
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

interface ProtectedRouteProps {
  children: ReactNode;
  requiresAuth: boolean;
}

const ProtectedRoute = ({ children, requiresAuth }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: any) => state.user);

  useEffect(() => {
    // If route requires auth but user is not authenticated, redirect to login
    if (requiresAuth && !isAuthenticated) {
      navigate("/login");
    }
    
    // If user is authenticated but tries to access login/signup pages
    if (!requiresAuth && isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate, requiresAuth]);

  // Return children only when conditions are met
  if (requiresAuth && !isAuthenticated) return null;
  if (!requiresAuth && isAuthenticated) return null;
  
  return <>{children}</>;
};

export default ProtectedRoute;
