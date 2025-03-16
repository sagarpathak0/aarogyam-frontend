'use client';
import { registerHospital } from "@/utils/api";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaHospital, FaEnvelope, FaLock } from "react-icons/fa";
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

const SignupAdmin = () => {
  const [hospitalName, setHospitalName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { isAuthenticated, login } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!hospitalName || !email || !password) {
        alert("Please fill all fields");
        return;
      }

      const data = await registerHospital(
        "", // Token not needed for initial registration
        hospitalName,
        email,
        password
      );
      
      console.log("Hospital Registered:", data);
      
      // Check for token or success message in response
      if (data?.token) {
        login(data.token, { 
          email,
          name: hospitalName,
          role: 'admin' 
        });
        router.push('/admin/dashboard');
      } else if (data?.success || data?.message) {
        // If API returns success info but no token, show message and redirect to signin
        alert(data.message || "Registration successful. Please sign in.");
        router.push('/signinadmin');
      } else {
        // Generic success message if API response structure is unclear
        alert("Registration completed. Please sign in with your new credentials.");
        router.push('/signinadmin');
      }
    } catch (err) {
      console.error(err);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gray-950 p-8 rounded-2xl shadow-lg w-96 border border-purple-700"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Register Hospital Admin</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block text-gray-400">Hospital Name</label>
            <div className="relative">
              <FaHospital className="absolute left-3 top-3 text-gray-500" />
              <input
                type="text"
                className="w-full px-10 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                placeholder="Enter hospital name"
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-400">Admin Email</label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-gray-500" />
              <input
                type="email"
                className="w-full px-10 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                placeholder="Enter admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-400">Password</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-gray-500" />
              <input
                type="password"
                className="w-full px-10 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-all"
          >
            Register Hospital Admin
          </motion.button>
        </form>
        <p className="text-center text-gray-400 mt-4">
          Already have an admin account? <Link href="/signinadmin" className="text-purple-400 hover:underline">Sign in</Link>
        </p>
        <p className="text-center text-gray-400 mt-2">
          Not a hospital admin? <Link href="/signup" className="text-blue-400 hover:underline">User signup</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default SignupAdmin;
