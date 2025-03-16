import React from 'react';
import Navbar from '../components/Navbar';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto pt-24 px-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Welcome to Your Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Nearby Hospitals</h2>
              <p className="text-gray-600 mb-4">Find healthcare facilities in your area</p>
              <a href="/hospitals" className="text-blue-600 hover:underline">View Hospitals</a>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Health Records</h2>
              <p className="text-gray-600 mb-4">Access your medical history and documents</p>
              <a href="/health-records" className="text-blue-600 hover:underline">View Records</a>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Appointments</h2>
              <p className="text-gray-600 mb-4">Schedule, view, or cancel appointments</p>
              <a href="/appointments" className="text-blue-600 hover:underline">Manage Appointments</a>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
