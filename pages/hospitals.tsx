import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';
import { getHospitals } from '../utils/api';

export default function HospitalsPage() {
  const { token } = useAuth();
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Remove the automatic fetch from useEffect
  
  const fetchHospitals = async () => {
    if (token) {
      try {
        setLoading(true);
        setError(null);
        
        try {
          const data = await getHospitals(token);
          
          if (data && data.error) {
            setError(data.message || 'Failed to fetch hospitals');
            setHospitals([]);
          } else {
            setHospitals(Array.isArray(data) ? data : []);
          }
        } catch (apiError) {
          console.error('API Error:', apiError);
          setHospitals([]);
          setError('Could not connect to hospital service. Please check your internet connection and try again.');
        }
      } catch (error) {
        console.error('Error fetching hospitals:', error);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    } else {
      setError('Authentication required');
    }
  };
  
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto pt-24 px-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Nearby Hospitals</h1>
            
            {/* Add fetch button */}
            <button 
              onClick={fetchHospitals}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Fetch Hospitals'}
            </button>
          </div>
          
          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 rounded-md bg-red-100 text-red-800">
              {error}
            </div>
          )}
          
          {loading ? (
            <p>Loading hospitals...</p>
          ) : hospitals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hospitals.map((hospital: any) => (
                <div key={hospital.id} className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">{hospital.name}</h2>
                  <p className="text-gray-600">{hospital.email}</p>
                  {/* Add more hospital details here */}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">{!error && 'Click "Fetch Hospitals" to load hospital data'}</p>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
