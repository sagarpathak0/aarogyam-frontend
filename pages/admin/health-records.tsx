import React, { useState, FormEvent } from 'react';
import Navbar from '../../components/Navbar';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../contexts/AuthContext';
import { addHealthRec, getHealthRec, updateHealthRec, deleteHealthRec } from '../../utils/api';

export default function AdminHealthRecordsPage() {
  const { token } = useAuth();
  const [email, setEmail] = useState('');
  const [recordId, setRecordId] = useState('');
  const [recordData, setRecordData] = useState('');
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;
    
    try {
      setIsLoading(true);
      let parsedData;
      try {
        parsedData = JSON.parse(recordData || '{}');
      } catch (error) {
        showMessage('Invalid JSON format. Please check your input.', 'error');
        return;
      }
      
      const data = await addHealthRec(token, email, parsedData);
      showMessage('Health record added successfully!', 'success');
      setRecordData('');
    } catch (error) {
      console.error('Error adding health record:', error);
      showMessage('Error adding health record.', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGet = async () => {
    if (!token || !email) {
      showMessage('Please enter an email address.', 'error');
      return;
    }
    
    try {
      setIsLoading(true);
      const data = await getHealthRec(token, email);
      setRecords(data);
      if (!data || data.length === 0) {
        showMessage('No records found for this user.', 'error');
      }
    } catch (error) {
      console.error('Error fetching health records:', error);
      showMessage('Error fetching health records.', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (!token || !email || !recordId) {
      showMessage('Please fill all required fields.', 'error');
      return;
    }
    
    try {
      setIsLoading(true);
      let parsedData;
      try {
        parsedData = JSON.parse(recordData || '{}');
      } catch (error) {
        showMessage('Invalid JSON format. Please check your input.', 'error');
        return;
      }
      
      await updateHealthRec(token, email, recordId, parsedData);
      showMessage('Health record updated successfully!', 'success');
      
      // Refresh records
      if (email) {
        const data = await getHealthRec(token, email);
        setRecords(data);
      }
    } catch (error) {
      console.error('Error updating health record:', error);
      showMessage('Error updating health record.', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDelete = async () => {
    if (!token || !email || !recordId) {
      showMessage('Please fill all required fields.', 'error');
      return;
    }
    
    if (!confirm("Are you sure you want to delete this record? This cannot be undone.")) {
      return;
    }
    
    try {
      setIsLoading(true);
      await deleteHealthRec(token, email, recordId);
      showMessage('Health record deleted successfully!', 'success');
      
      // Remove from UI
      setRecords(records.filter((record: any) => record.id !== recordId));
    } catch (error) {
      console.error('Error deleting health record:', error);
      showMessage('Error deleting health record.', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto pt-24 px-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Health Records Management</h1>
          <p className="text-gray-600 mb-8">Manage patient health records</p>
          
          {/* Status message */}
          {message.text && (
            <div className={`mb-6 p-4 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message.text}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Forms */}
            <div className="space-y-8">
              {/* Add Health Record */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Health Record</h2>
                <form onSubmit={handleAdd} className="space-y-4">
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 text-gray-600 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                    required
                  />
                  <textarea
                    placeholder="Record Data (JSON)"
                    value={recordData}
                    onChange={(e) => setRecordData(e.target.value)}
                    className="w-full px-4 py-3 text-gray-600 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 h-40"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? 'Processing...' : 'Add Health Record'}
                  </button>
                </form>
              </div>
              
              {/* Update Health Record */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Update Health Record</h2>
                <form onSubmit={handleUpdate} className="space-y-4">
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 text-gray-600 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Record ID"
                    value={recordId}
                    onChange={(e) => setRecordId(e.target.value)}
                    className="w-full px-4 py-3 text-gray-600 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                    required
                  />
                  <textarea
                    placeholder="Updated Record Data (JSON)"
                    value={recordData}
                    onChange={(e) => setRecordData(e.target.value)}
                    className="w-full px-4 py-3 text-gray-600 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 h-40"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? 'Processing...' : 'Update Health Record'}
                  </button>
                </form>
              </div>
              
              {/* Delete Health Record */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Delete Health Record</h2>
                <div className="space-y-4">
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 text-gray-600 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Record ID"
                    value={recordId}
                    onChange={(e) => setRecordId(e.target.value)}
                    className="w-full px-4 py-3 text-gray-600 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                    required
                  />
                  <button
                    onClick={handleDelete}
                    disabled={isLoading}
                    className="w-full py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? 'Processing...' : 'Delete Health Record'}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Right Column - View Records */}
            <div>
              <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">View Health Records</h2>
                <div className="flex gap-4 mb-6">
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-grow px-4 py-3 text-gray-600 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                  <button
                    onClick={handleGet}
                    disabled={isLoading}
                    className="px-6 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? 'Loading...' : 'View Records'}
                  </button>
                </div>
                
                {/* Records List */}
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {records && records.length > 0 ? (
                    records.map((record: any) => (
                      <div key={record.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between mb-2">
                          <h3 className="font-medium">Record ID: {record.id}</h3>
                          <div>
                            <button 
                              className="text-blue-600 hover:text-blue-800 mr-3"
                              onClick={() => {
                                setRecordId(record.id);
                                setRecordData(JSON.stringify(record, null, 2));
                              }}
                            >
                              Edit
                            </button>
                            <button 
                              className="text-red-600 hover:text-red-800"
                              onClick={() => {
                                setRecordId(record.id);
                                handleDelete();
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
                          {JSON.stringify(record, null, 2)}
                        </pre>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No records found. Search for a user to view their records.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
