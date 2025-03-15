import React, { JSX, useState } from 'react';
import Image from 'next/image';
import { Geist, Geist_Mono } from 'next/font/google';
// import Auth from '../components/Auth';
import Hospitals from '../components/Hospitals';
import HealthRecords from '../components/HealthRecords';
import Resources from '../components/Resources';
import Appointments from '../components/Appointments';
import Navbar from '../components/Navbar';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function HomePage(): JSX.Element {
  const [token, setToken] = useState<string | null>(null);

  return (
    <div
      data-theme="myapple"
      className="min-h-screen bg-white flex flex-col items-center justify-between p-8 gap-8 font-sans"
    >
      <Navbar />
  
      <main className="flex flex-col pt-16 items-center w-full max-w-4xl gap-8">
        {/* Sign Up & Sign In (Auth) */}
        {/* <Auth token={token} setToken={setToken} /> */}
  
        {/* Hospitals */}
        <Hospitals token={token} />
  
        {/* Health Records */}
        <HealthRecords token={token} />
  
        {/* Resources */}
        <Resources token={token} />
  
        {/* Appointments */}
        <Appointments token={token} />
      </main>
  
      <footer className="w-full border-t border-gray-200 py-4 text-center text-gray-600">
        <p>&copy; 2021 MyHealthApp. All rights reserved.</p>
      </footer>
    </div>
  );
  
}
