import React, { useState, FormEvent, useEffect } from 'react';
import { signIn } from '../utils/api';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

export default function SigninPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { isAuthenticated, login } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const data = await signIn(email, password);
      console.log('Sign In:', data);
      
      if (data?.token) {
        login(data.token, { 
          email, 
          name: data.name || 'User',
          role: 'user' 
        });
        router.push('/');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-600 via-blue-400 to-green-600">
        <Navbar/>
     <div className="flex flex-row w-2/3 h-2/3 mx-auto my-auto">
       {/* Left Column */}
       <div className="ml-auto p-8 px-25 pr-60 flex bg-black rounded-l-xl flex-col">
        {/* Top Navigation */}
        

        {/* Main Content */}
        <div className="flex-grow flex flex-col justify-center">
          {/* Headline and Subtext */}
          <h2 className="text-5xl font-bold text-white mb-2">
          𝕃𝕆𝔾𝕀ℕ
          </h2>
          <p className="text-white mb-6">
            Welcome back! Please login to your account.
          </p>

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="max-w-sm space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block mb-1 text-white font-medium"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="hakeem@digital.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 text-gray-200 rounded-md 
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-1 text-white font-medium"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 text-gray-200 rounded-md 
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Buttons */}
            <div className="flex items-end space-x-4">
              <button
                type="submit"
                className="bg-blue-600 cursor-pointer text-white px-6 py-2 rounded-md 
                           hover:bg-blue-700 transition-colors"
              >
                Login
              </button>
              <Link href="/signup">
              <button
                type="button"
                className="border cursor-pointer border-blue-600 text-blue-600 px-6 py-2 rounded-md 
                           hover:bg-blue-50 transition-colors"
              >
                Sign Up
              </button>
              </Link>
              
            </div>
            <Link href='/signinadmin' className='text-blue-600 hover:text-white'>Are you an admin</Link>
          </form>
        </div>
      </div>

      {/* Right Column (Illustration) */}
      <div className="bg-black mr-auto flex rounded-r-xl items-center justify-center">
        {/* Replace with your own image or SVG */}
        <img
          src="/login.jpg"
          alt="Person riding a bicycle"
          className="max-w-2xl rounded-r-xl"
        />
      </div>
     </div>
    </div>
  );
}
