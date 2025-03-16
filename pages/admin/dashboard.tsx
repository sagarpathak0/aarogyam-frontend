import React from 'react';
import Navbar from '../../components/Navbar';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();
  
  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto pt-24 px-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 mb-8">Manage system data and user information</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-600">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Hospital Management</h2>
              <p className="text-gray-600 mb-4">Add, update or remove hospitals from the system</p>
              <a href="/admin/hospitals" className="text-blue-600 hover:underline">Manage Hospitals</a>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-600">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Health Records</h2>
              <p className="text-gray-600 mb-4">Administer patient health records and data</p>
              <a href="/admin/health-records" className="text-green-600 hover:underline">Manage Records</a>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-600">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Resources</h2>
              <p className="text-gray-600 mb-4">Add or update FHIR resources in the system</p>
              <a href="/admin/resources" className="text-purple-600 hover:underline">Manage Resources</a>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-600">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Appointment Management</h2>
              <p className="text-gray-600 mb-4">Oversee all appointment scheduling and cancellations</p>
              <a href="/admin/appointments" className="text-yellow-700 hover:underline">Manage Appointments</a>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
