import React, { FormEvent, useState } from 'react';

interface Props {
  token: string | null;
}

// Import baseUrl directly from our api file instead of trying to get it from context
import { baseUrl } from '../utils/api';

export default function Resources({ token }: Props) {
  const [resourceType, setResourceType] = useState('');
  const [resourceId, setResourceId] = useState('');
  const [recordData, setRecordData] = useState('');
  const [filterField, setFilterField] = useState('');
  const [filterValue, setFilterValue] = useState('');
  
  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) {
      alert('Please sign in first.');
      return;
    }
    try {
      const resourcePayload = JSON.parse(recordData || '{}');
      const response = await fetch(`${baseUrl}/add_resource`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        },
        body: JSON.stringify(resourcePayload)
      });
      const data = await response.json();
      console.log('Add Resource:', data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGetId = async () => {
    if (!token || !resourceType || !resourceId) {
      alert('Please sign in and provide resourceType/resourceId.');
      return;
    }
    try {
      const response = await fetch(`${baseUrl}/get_resource/${resourceType}/${resourceId}`, {
        headers: { 'x-access-token': token }
      });
      const data = await response.json();
      console.log('Get Resource:', data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGetAll = async () => {
    if (!token || !resourceType) {
      alert('Please sign in and provide resourceType.');
      return;
    }
    try {
      const response = await fetch(`${baseUrl}/get_resources/${resourceType}`, {
        headers: { 'x-access-token': token }
      });
      const data = await response.json();
      console.log('Get Resources:', data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFilter = async () => {
    if (!token || !resourceType || !filterField || !filterValue) {
      alert('Please sign in and provide resourceType/field/value.');
      return;
    }
    try {
      const response = await fetch(`${baseUrl}/filter_resources/${resourceType}?field=${filterField}&value=${filterValue}`, {
        headers: { 'x-access-token': token }
      });
      const data = await response.json();
      console.log('Filter Resources:', data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full bg-white p-6 border border-gray-200 rounded-lg shadow-sm space-y-6">
      <h3 className="text-2xl font-semibold text-gray-800">FHIR Resources</h3>
      
      <form onSubmit={handleAdd} className="space-y-4">
        <textarea
          placeholder="Resource Object (JSON)"
          value={recordData}
          onChange={(e) => setRecordData(e.target.value)}
          className="w-full px-4 py-2 text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-400"
        />
        <button
          type="submit"
          className="w-full py-2 cursor-pointer bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          Add Resource
        </button>
      </form>
  
      {/* Get by ID */}
      <div className="space-y-4">
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Resource Type"
            value={resourceType}
            onChange={(e) => setResourceType(e.target.value)}
            className="flex-1 px-4 py-2 text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-400"
          />
          <input
            type="text"
            placeholder="Resource ID"
            value={resourceId}
            onChange={(e) => setResourceId(e.target.value)}
            className="flex-1 px-4 py-2 border text-gray-800 border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-400"
          />
          <button
            onClick={handleGetId}
            className="py-2 px-4 cursor-pointer bg-gray-800 text-white font-medium rounded-md hover:bg-gray-900 transition-colors"
          >
            Get Resource
          </button>
        </div>
        <button
          onClick={handleGetAll}
          className="w-fit py-2 px-4 cursor-pointer bg-gray-800 text-white font-medium rounded-md hover:bg-gray-900 transition-colors"
        >
          Get Resources by Type
        </button>
      </div>
  
      {/* Filter */}
      <div className="space-y-4">
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Filter Field"
            value={filterField}
            onChange={(e) => setFilterField(e.target.value)}
            className="flex-1 px-4 py-2 border text-gray-800 border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-400"
          />
          <input
            type="text"
            placeholder="Filter Value"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            className="flex-1 px-4 py-2 border text-gray-800 border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-400"
          />
        </div>
        <button
          onClick={handleFilter}
          className="w-full py-2 bg-green-600 cursor-pointer text-white font-medium rounded-md hover:bg-green-700 transition-colors"
        >
          Filter Resources
        </button>
      </div>
    </div>
  );
  
}