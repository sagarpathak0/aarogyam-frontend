import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <nav className="fixed top-0 w-full h-16 bg-white flex items-center justify-between px-6 border-b border-gray-200 z-10">
      <Link href="/">
        <span className="text-xl font-semibold text-gray-900 cursor-pointer">MyHealthApp</span>
      </Link>
      
      {isAuthenticated && (
        <div className="flex items-center space-x-6">
          {isAdmin ? (
            // Admin Navigation Links
            <>
              <Link href="/admin/dashboard">
                <span className="text-gray-600 hover:text-gray-900 cursor-pointer">Dashboard</span>
              </Link>
              <Link href="/admin/hospitals">
                <span className="text-gray-600 hover:text-gray-900 cursor-pointer">Manage Practitioners</span>
              </Link>
              <Link href="/admin/health-records">
                <span className="text-gray-600 hover:text-gray-900 cursor-pointer">Manage Records</span>
              </Link>
              <Link href="/admin/resources">
                <span className="text-gray-600 hover:text-gray-900 cursor-pointer">Manage Resources</span>
              </Link>
              <Link href="/admin/appointments">
                <span className="text-gray-600 hover:text-gray-900 cursor-pointer">Manage Appointments</span>
              </Link>
            </>
          ) : (
            // Regular User Navigation Links
            <>
              <Link href="/dashboard">
                <span className="text-gray-600 hover:text-gray-900 cursor-pointer">Dashboard</span>
              </Link>
              <Link href="/hospitals">
                <span className="text-gray-600 hover:text-gray-900 cursor-pointer">Hospitals</span>
              </Link>
              <Link href="/health-records">
                <span className="text-gray-600 hover:text-gray-900 cursor-pointer">My Records</span>
              </Link>
              <Link href="/appointments">
                <span className="text-gray-600 hover:text-gray-900 cursor-pointer">Appointments</span>
              </Link>
            </>
          )}
        </div>
      )}
      
      <div className="flex items-center space-x-6">
        {isAuthenticated ? (
          <>
            <span className="text-gray-600">
              Welcome, {isAdmin ? 'Admin' : ''} {user?.name}
            </span>
            <button 
              onClick={handleLogout}
              className="bg-red-600 text-white cursor-pointer rounded-md px-4 py-2 hover:bg-red-700 transition-colors duration-200"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/signin">
              <button className="text-gray-600 cursor-pointer hover:text-gray-900 transition-colors duration-200">
                Sign In
              </button>
            </Link>
            <Link href="/signup">
              <button className="bg-blue-600 text-white cursor-pointer rounded-md px-4 py-2 hover:bg-blue-700 transition-colors duration-200">
                Sign Up
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
