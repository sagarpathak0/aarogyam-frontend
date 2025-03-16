import React, { useState, FormEvent, useEffect } from 'react';
import { signInAdmin } from '../utils/api';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

export default function SignInAdmin() {
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
      const data = await signInAdmin(email, password);
      console.log('Admin Sign In:', data);
      
      if (data?.token) {
        login(data.token, { 
          email, 
          name: data.name || 'Admin User',
          role: 'admin' // Mark as admin role
        });
        router.push('/');
      } else {
        alert('Admin login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error(err);
      alert('Error during admin login.');
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar/>
      <div className="flex flex-row w-2/3 h-2/3 mx-auto my-auto">
        {/* Left Column */}
        <div className="ml-auto p-8 px-25 pr-60 flex bg-black rounded-l-xl flex-col">
          <div className="flex-grow flex flex-col justify-center">
            <h2 className="text-5xl font-bold text-white mb-2">
              𝔸𝔻𝕄𝕀ℕ 𝕃𝕆𝔾𝕀ℕ
            </h2>
            <p className="text-white mb-6">
              Admin access only. Please enter your credentials.
            </p>

            <form onSubmit={handleSubmit} className="max-w-sm space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block mb-1 text-white font-medium"
                >
                  Admin Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-200 rounded-md 
                            focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                            focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-end space-x-4">
                <button
                  type="submit"
                  className="bg-purple-600 cursor-pointer text-white px-6 py-2 rounded-md 
                            hover:bg-purple-700 transition-colors"
                >
                  Admin Login
                </button>
              </div>
              <Link href='/signin' className='text-purple-400 hover:text-white'>
                Return to user login
              </Link>
            </form>
          </div>
        </div>

        {/* Right Column (Illustration) */}
        <div className="bg-black mr-auto flex rounded-r-xl items-center justify-center">
          <img
            src="/admin.jpg" 
            alt="Admin dashboard illustration"
            className="max-w-2xl rounded-r-xl"
            onError={(e) => {
              // Fallback if admin.jpg doesn't exist
              e.currentTarget.src = "/login.jpg";
            }}
          />
        </div>
      </div>
    </div>
  );
}
