import React, { useEffect, useState, FormEvent } from 'react';
import Navbar from '../../components/Navbar';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../contexts/AuthContext';
import { addpract, fetchpract } from '../../utils/api';

export default function AdminPractitionersPage() {
  const { token } = useAuth();
  const [practitioners, setPractitioners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state for adding practitioners
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [speciality, setSpeciality] = useState('');
  
  useEffect(() => {
    if (token) {
      fetchPractitioners();
    }
  }, [token]);
  
  const fetchPractitioners = async () => {
    if (!token) {
      console.warn("No token available for fetchPractitioners");
      return;
    }
    
    try {
      setLoading(true);
      console.log("Starting practitioners fetch with token:", token.substring(0, 10) + "...");
      
      try {
        // Set a longer timeout since we have one in the fetch function too
        const fetchPromise = fetchpract(token);
        
        // Add a separate UI timeout for the loading state
        const uiTimeoutPromise = new Promise(resolve => {
          setTimeout(() => {
            resolve({ error: true, message: "Fetch is still processing, but taking longer than expected." });
          }, 20000);
        });
        
        // Create a race between the actual data and a UI message
        const result = await Promise.race([fetchPromise, uiTimeoutPromise]);
        
        if (result && (result as any).error) {
          console.error('API Error:', (result as any).message || 'Unknown error');
          
          // Don't disrupt the UI with alerts
          console.warn((result as any).message || 'Could not fetch practitioners data');
          
          // Still set empty data instead of failing
          setPractitioners([]);
          return;
        }
        
        const data = result as any[];
        setPractitioners(Array.isArray(data) ? data : []);
        
      } catch (apiError) {
        console.error('Error in API call:', apiError);
        setPractitioners([]);
      }
    } catch (error) {
      console.error('General error in fetchPractitioners:', error);
      setPractitioners([]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    if (!token || !name || !email || !speciality) {
      alert('Please fill all fields');
      return;
    }
    
    try {
      await addpract(token, name, email, speciality);
      // Clear form fields
      setName('');
      setEmail('');
      setSpeciality('');
      // Refresh practitioner list
      fetchPractitioners();
    } catch (error) {
      console.error('Error registering practitioner:', error);
      alert('Failed to register practitioner');
    }
  };
  
  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto pt-24 px-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Practitioner Management</h1>
          <p className="text-gray-600 mb-8">Add and manage healthcare practitioners in the system</p>
          
          {/* Add Practitioner Form */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Register New Practitioner</h2>
            
            <form onSubmit={handleRegister} className="space-y-4">
              <input
                type="text"
                placeholder="Practitioner Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 text-gray-800 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-400"
                required
              />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 text-gray-800 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-400"
                required
              />
              <input
                type="text"
                placeholder="Speciality"
                value={speciality}
                onChange={(e) => setSpeciality(e.target.value)}
                className="w-full px-4 text-gray-800 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-400"
                required
              />
              <button
                type="submit"
                className="w-full py-2 cursor-pointer bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                Register Practitioner
              </button>
            </form>
          </div>
          
          {/* Practitioners List */}
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Registered Practitioners</h2>
          
          {loading ? (
            <p>Loading practitioners...</p>
          ) : practitioners && practitioners.length > 0 ? (
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Speciality</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {practitioners.map((practitioner: any) => (
                    <tr key={practitioner.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{practitioner.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{practitioner.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{practitioner.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{practitioner.speciality}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                        <button className="text-red-600 hover:text-red-900">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600">No practitioners found.</p>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
