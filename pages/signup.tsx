import React, { useState, FormEvent } from 'react';
import { signUp } from '../utils/api';
import Navbar from '../components/Navbar';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const data = await signUp(email, password, name);
    console.log('Sign Up:', data);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <div className="flex flex-col justify-center items-center flex-1 p-8 gap-4">
        <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-6 border border-gray-200 rounded-lg shadow-sm space-y-6">
          <h3 className="text-2xl font-semibold text-gray-800">Create an Account</h3>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-400"
          />
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-400"
          />
          <button className="w-full cursor-pointer py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">
            Sign Up
          </button>
          <button className="w-full cursor-pointer py-2 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 transition-colors">
            Sign Up with OAuth
          </button>
        </form>
      </div>
    </div>
  );
  
}