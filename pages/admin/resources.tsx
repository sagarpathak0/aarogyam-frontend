import React, { useState, useEffect, FormEvent } from 'react';
import Navbar from '../../components/Navbar';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminResourcesPage() {
  const { token } = useAuth();
  const [resourceType, setResourceType] = useState('');
  const [resourceId, setResourceId] = useState('');
  const [recordData, setRecordData] = useState('');
  const [filterField, setFilterField] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const baseUrl = 'https://d3d7-2401-4900-8847-90de-912-8fd4-1b1a-8f42.ngrok-free.app';
  
  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;
    
    try {
      setIsLoading(true);
      let resourcePayload;
      try {
        resourcePayload = JSON.parse(recordData || '{}');
      } catch (error) {
        showMessage('Invalid JSON format. Please check your input.', 'error');
        return;
      }
      
      const response = await fetch(`${baseUrl}/add_resource`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        },
        body: JSON.stringify(resourcePayload)
      });
      const data = await response.json();
      showMessage('Resource added successfully!', 'success');
      setRecordData('');
      
      // Refresh resources if we're currently viewing this type
      if (resourcePayload.resourceType === resourceType) {
        handleGetAll();
      }
    } catch (err) {
      console.error(err);
      showMessage('Error adding resource.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetId = async () => {
    if (!token || !resourceType || !resourceId) {
      showMessage('Please provide Resource Type and ID.', 'error');
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await fetch(`${baseUrl}/get_resource/${resourceType}/${resourceId}`, {
        headers: { 'x-access-token': token || '' }
      });
      const data = await response.json();
      
      if (data) {
        // If successful, populate the form with this resource for editing
        setRecordData(JSON.stringify(data, null, 2));
        showMessage('Resource retrieved successfully.', 'success');
      } else {
        showMessage('Resource not found.', 'error');
      }
    } catch (err) {
      console.error(err);
      showMessage('Error retrieving resource.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetAll = async () => {
    if (!token || !resourceType) {
      showMessage('Please provide a Resource Type.', 'error');
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await fetch(`${baseUrl}/get_resources/${resourceType}`, {
        headers: { 'x-access-token': token }
      });
      const data = await response.json();
      setResources(data);
      
      if (!data || data.length === 0) {
        showMessage('No resources found for this type.', 'error');
      } else {
        showMessage(`Found ${data.length} resources.`, 'success');
      }
    } catch (err) {
      console.error(err);
      showMessage('Error retrieving resources.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilter = async () => {
    if (!token || !resourceType || !filterField || !filterValue) {
      showMessage('Please provide Type, Field, and Value for filtering.', 'error');
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await fetch(`${baseUrl}/filter_resources/${resourceType}?field=${filterField}&value=${filterValue}`, {
        headers: { 'x-access-token': token }
      });
      const data = await response.json();
      setResources(data);
      
      if (!data || data.length === 0) {
        showMessage('No resources match your filter criteria.', 'error');
      } else {
        showMessage(`Found ${data.length} matching resources.`, 'success');
      }
    } catch (err) {
      console.error(err);
      showMessage('Error filtering resources.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resource? This action cannot be undone.")) {
      return;
    }
    
    try {
      setIsLoading(true);
      // Fix the URL by including the id parameter
      const response = await fetch(`${baseUrl}/delete_resource/${resourceType}/${id}`, {
        method: 'DELETE',
        headers: { 'x-access-token': token || ""}
      });
      
      if (response.ok) {
        showMessage('Resource deleted successfully.', 'success');
        // Update UI by removing the deleted resource
        setResources(resources.filter((resource: any) => resource.id !== id));
      } else {
        showMessage('Failed to delete resource.', 'error');
      }
    } catch (err) {
      console.error(err);
      showMessage('Error deleting resource.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto pt-24 px-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">FHIR Resources Management</h1>
          <p className="text-gray-600 mb-8">View, add, update, and filter resources</p>
          
          {/* Status message */}
          {message.text && (
            <div className={`mb-6 p-4 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message.text}
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Forms */}
            <div className="space-y-8">
              {/* Add Resource */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Resource</h2>
                <form onSubmit={handleAdd} className="space-y-4">
                  <textarea
                    placeholder="Resource Object (JSON)"
                    value={recordData}
                    onChange={(e) => setRecordData(e.target.value)}
                    className="w-full px-4 py-3 text-gray-600 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 h-60"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? 'Processing...' : 'Add Resource'}
                  </button>
                </form>
              </div>

              {/* Resource Type Controls */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Resource Controls</h2>
                
                {/* Get Resource by ID */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-700 mb-2">Get Resource by ID</h3>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      placeholder="Resource Type"
                      value={resourceType}
                      onChange={(e) => setResourceType(e.target.value)}
                      className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                    <input
                      type="text"
                      placeholder="Resource ID"
                      value={resourceId}
                      onChange={(e) => setResourceId(e.target.value)}
                      className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                    <button
                      onClick={handleGetId}
                      disabled={isLoading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      Get
                    </button>
                  </div>
                </div>
                
                {/* Get All Resources of Type */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-700 mb-2">Get All Resources of Type</h3>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      placeholder="Resource Type"
                      value={resourceType}
                      onChange={(e) => setResourceType(e.target.value)}
                      className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                    <button
                      onClick={handleGetAll}
                      disabled={isLoading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      Get All
                    </button>
                  </div>
                </div>
                
                {/* Filter Resources */}
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Filter Resources</h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Resource Type"
                      value={resourceType}
                      onChange={(e) => setResourceType(e.target.value)}
                      className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                    <div className="flex gap-4">
                      <input
                        type="text"
                        placeholder="Field"
                        value={filterField}
                        onChange={(e) => setFilterField(e.target.value)}
                        className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                      <input
                        type="text"
                        placeholder="Value"
                        value={filterValue}
                        onChange={(e) => setFilterValue(e.target.value)}
                        className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>
                    <button
                      onClick={handleFilter}
                      disabled={isLoading}
                      className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      Filter Resources
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Results */}
            <div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Resources</h2>
                {isLoading ? (
                  <div className="text-center py-10">
                    <p className="text-gray-600">Loading resources...</p>
                  </div>
                ) : resources && resources.length > 0 ? (
                  <div className="space-y-4 max-h-[700px] overflow-y-auto">
                    {resources.map((resource: any) => (
                      <div key={resource.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <h3 className="font-medium">{resource.resourceType || 'Resource'}</h3>
                            <p className="text-sm text-gray-500">ID: {resource.id}</p>
                          </div>
                          <div>
                            <button 
                              onClick={() => {
                                setResourceId(resource.id);
                                setRecordData(JSON.stringify(resource, null, 2));
                              }}
                              className="text-blue-600 hover:text-blue-800 mr-3"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDelete(resource.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
                          {JSON.stringify(resource, null, 2)}
                        </pre>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-gray-500">No resources found.</p>
                    <p className="text-gray-500 text-sm mt-2">Try searching for a type or retrieving a specific resource.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
