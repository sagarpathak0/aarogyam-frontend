import React, { useState, useEffect, FormEvent } from 'react';
import Navbar from '../components/Navbar';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';
import { bookAppointment, rescheduleAppointment, cancelAppointment, getUserAppointments } from '../utils/api';

export default function AppointmentsPage() {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [providerId, setProviderId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [appointmentId, setAppointmentId] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  
  // Fetch user's appointments on load
  useEffect(() => {
    if (token) {
      fetchAppointments();
    }
  }, [token]);
  
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await getUserAppointments(token!);
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      showMessage('Failed to load appointments', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };
  
  const handleBook = async (e: FormEvent) => {
    e.preventDefault();
    if (!providerId || !date || !time) {
      showMessage('Please fill all fields', 'error');
      return;
    }
    
    try {
      setLoading(true);
      await bookAppointment(token!, providerId, date, time);
      showMessage('Appointment booked successfully!', 'success');
      
      // Reset form & refresh
      setProviderId('');
      setDate('');
      setTime('');
      fetchAppointments();
    } catch (error) {
      console.error('Error booking appointment:', error);
      showMessage('Failed to book appointment', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  const handleReschedule = async (e: FormEvent) => {
    e.preventDefault();
    if (!appointmentId || !date || !time) {
      showMessage('Please fill all fields', 'error');
      return;
    }
    
    try {
      setLoading(true);
      await rescheduleAppointment(token!, appointmentId, date, time);
      showMessage('Appointment rescheduled successfully!', 'success');
      
      // Reset form & refresh
      setAppointmentId('');
      setDate('');
      setTime('');
      fetchAppointments();
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      showMessage('Failed to reschedule appointment', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }
    
    try {
      setLoading(true);
      await cancelAppointment(token!, id);
      showMessage('Appointment cancelled successfully!', 'success');
      
      // Refresh list
      fetchAppointments();
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      showMessage('Failed to cancel appointment', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto pt-24 px-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Appointments</h1>
          <p className="text-gray-600 mb-8">Book, reschedule, or cancel your appointments</p>
          
          {/* Status message */}
          {message.text && (
            <div className={`mb-6 p-4 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message.text}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Forms */}
            <div className="space-y-8">
              {/* Book Appointment */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Book New Appointment</h2>
                <form onSubmit={handleBook} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Provider ID"
                    value={providerId}
                    onChange={(e) => setProviderId(e.target.value)}
                    className="w-full px-4 py-3 text-gray-600 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                  <input
                    type="date"
                    placeholder="Date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 text-gray-600 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                  <input
                    type="time"
                    placeholder="Time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-4 py-3 text-gray-600 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Book Appointment'}
                  </button>
                </form>
              </div>
              
              {/* Reschedule Appointment */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Reschedule Appointment</h2>
                <form onSubmit={handleReschedule} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Appointment ID"
                    value={appointmentId}
                    onChange={(e) => setAppointmentId(e.target.value)}
                    className="w-full px-4 py-3 text-gray-600 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                  <input
                    type="date"
                    placeholder="New Date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 text-gray-600 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                  <input
                    type="time"
                    placeholder="New Time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-4 py-3 text-gray-600 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Reschedule Appointment'}
                  </button>
                </form>
              </div>
            </div>
            
            {/* Right Column - Appointments List */}
            <div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Appointments</h2>
                
                {loading ? (
                  <p className="text-center py-4">Loading your appointments...</p>
                ) : appointments && appointments.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {appointments.map((appointment: any) => (
                      <div key={appointment.id} className="py-4 first:pt-0 last:pb-0">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium">Provider: {appointment.provider_name || appointment.provider_id}</p>
                            <p className="text-gray-600 text-sm">
                              {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">ID: {appointment.id}</p>
                          </div>
                          <div>
                            <button
                              onClick={() => {
                                setAppointmentId(appointment.id);
                                setDate(appointment.date);
                                setTime(appointment.time);
                              }}
                              className="text-blue-600 hover:text-blue-800 mr-3 text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleCancel(appointment.id)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic text-center py-8">
                    You don't have any appointments yet.
                    <br />
                    Book a new appointment to get started.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
