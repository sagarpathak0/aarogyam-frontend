import React from 'react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full h-16 bg-white flex items-center justify-between px-6 border-b border-gray-200">
      <Link href="/">
        <span className="text-xl font-semibold text-gray-900 cursor-pointer">MyHealthApp</span>
      </Link>
      <div className="flex items-center space-x-6">
        <Link href="/signin">
          <button className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
            Sign In
          </button>
        </Link>
        <Link href="/signup">
          <button className="bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 transition-colors duration-200">
            Sign Up
          </button>
        </Link>
      </div>
    </nav>
  );
}
