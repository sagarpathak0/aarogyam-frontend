import React, { JSX, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Geist, Geist_Mono } from 'next/font/google';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function HomePage(): JSX.Element {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  // Redirect authenticated users to their appropriate dashboard
  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, user, router]);

  return (
    <div
      data-theme="myapple"
      className="min-h-screen bg-white flex flex-col items-center justify-between p-8 gap-8 font-sans"
    >
      <Navbar />
  
      <main className="flex flex-col pt-16 items-center w-full max-w-4xl gap-8">
        {/* Landing page content for non-authenticated users */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-black mb-4">Welcome to MyHealthApp</h1>
          <p className="text-xl text-gray-600 mb-8">
            Your comprehensive healthcare management solution
          </p>
  
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => router.push('/signup')}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium text-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Get Started
            </button>
  
            <button 
              onClick={() => router.push('/signin')}
              className="border border-gray-300 px-8 py-3 rounded-lg font-medium text-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>
  
        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-3">Find Hospitals</h3>
            <p className="text-gray-600">
              Easily locate and connect with healthcare providers near you
            </p>
          </div>
  
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-3">Manage Records</h3>
            <p className="text-gray-600">
              Access and maintain your health records securely
            </p>
          </div>
  
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-3">Book Appointments</h3>
            <p className="text-gray-600">
              Schedule and manage your medical appointments efficiently
            </p>
          </div>
        </div>
      </main>
  
      <footer className="w-full border-t border-gray-200 py-4 text-center text-gray-600">
        <p>&copy; 2025 MyHealthApp. All rights reserved.</p>
      </footer>
    </div>
  );
  
}
