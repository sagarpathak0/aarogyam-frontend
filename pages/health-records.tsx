import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';
import { getHealthRec } from '../utils/api';

export default function HealthRecordsPage() {
  const { token, user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchRecords() {
      if (token && user?.email) { // Changed from user?.id to user?.email
        try {
          const data = await getHealthRec(token, user.email); // Changed from user.id to user.email
          setRecords(data);
        } catch (error) {
          console.error('Error fetching health records:', error);
        } finally {
          setLoading(false);
        }
      }
    }
    
    fetchRecords();
  }, [token, user]);
  
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto pt-24 px-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Health Records</h1>
          
          {loading ? (
            <p>Loading health records...</p>
          ) : records && records.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {records.map((record: any) => (
                <div key={record.id} className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Record ID: {record.id}</h2>
                  <pre className="bg-gray-100 p-4 rounded overflow-auto">
                    {JSON.stringify(record, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No health records found.</p>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
