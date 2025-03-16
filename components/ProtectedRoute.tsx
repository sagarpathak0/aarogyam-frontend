import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Not authenticated - redirect to login
    if (!isAuthenticated) {
      router.push('/signin');
      return;
    }
    
    // Route requires admin but user is not admin
    if (adminOnly && user?.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [isAuthenticated, user, adminOnly, router]);

  // Don't render children until authentication is confirmed
  if (!isAuthenticated || (adminOnly && user?.role !== 'admin')) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return <>{children}</>;
}
