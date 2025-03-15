import React, { FormEvent, useState } from 'react';
import { registerHospital, getHospitals } from '../utils/api';

interface Props {
  token: string | null;
}

export default function Hospitals({ token }: Props) {
  const [name, setName] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return alert('Please sign in first.');
    const data = await registerHospital(token, name, lat, lng);
    console.log('Register Hospital:', data);
  };

  const handleGetAll = async () => {
    if (!token) return alert('Please sign in first.');
    const data = await getHospitals(token);
    console.log('All Hospitals:', data);
  };

  return (
    <div className="w-full bg-white p-6 border border-gray-200 rounded-lg shadow-sm space-y-6">
      <h3 className="text-2xl font-semibold text-gray-800">Hospitals</h3>
      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 text-gray-800 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-400"
        />
        <input
          type="text"
          placeholder="Latitude"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          className="w-full px-4 text-gray-800  py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-400"
        />
        <input
          type="text"
          placeholder="Longitude"
          value={lng}
          onChange={(e) => setLng(e.target.value)}
          className="w-full px-4 text-gray-800 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-400"
        />
        <button
          type="submit"
          className="w-full py-2 cursor-pointer bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          Register Hospital
        </button>
      </form>
      <button
        onClick={handleGetAll}
        className="py-2 px-4 cursor-pointer bg-gray-800 text-white font-medium rounded-md hover:bg-gray-900 transition-colors"
      >
        Get All Hospitals
      </button>
    </div>
  );
  
}
