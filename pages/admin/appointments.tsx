import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../contexts/AuthContext';
import { getAllAppointments, cancelAppointment, rescheduleAppointment } from '../../utils/api';

export default function AdminAppointmentsPage() {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState<any>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  
  // Filter state
  const [filterText, setFilterText] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  
  useEffect(() => {
    if (token) {
      fetchAppointments();
    }
  }, [token]);
  
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      
      try {
        const data = await getAllAppointments(token!);
        
        // Handle error responses
        if (!Array.isArray(data) && data.error) {
          console.error('API returned an error:', !Array.isArray(data) && data.message ? data.message : 'Unknown error');
          setAppointments([]);
          showMessage(!Array.isArray(data) && data.message ? data.message : 'Failed to load appointments', 'error');
          return;
        }
        
        setAppointments(Array.isArray(data) ? data : []);
        setMessage({ text: '', type: '' });
      } catch (apiError) {
        console.error('API Error:', apiError);
        setAppointments([]);
        showMessage('Could not connect to appointment service. Please try again later.', 'error');
      }
    } catch (error) {
      console.error('Error in fetchAppointments:', error);
      showMessage('Failed to load appointments', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };
  
  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }
    
    try {
      setLoading(true);
      await cancelAppointment(token!, id);
      showMessage('Appointment cancelled successfully!', 'success');
      
      // Remove from UI
      setAppointments(appointments.filter((appointment: any) => appointment.id !== id));
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      showMessage('Failed to cancel appointment', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  const handleEditStart = (appointment: any) => {
    setCurrentAppointment(appointment);
    setNewDate(appointment.date);
    setNewTime(appointment.time);
    setIsEditing(true);
  };
  
  const handleEditCancel = () => {
    setCurrentAppointment(null);
    setNewDate('');
    setNewTime('');
    setIsEditing(false);
  };
  
  const handleReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentAppointment || !newDate || !newTime) {
      showMessage('Please fill all required fields', 'error');
      return;
    }
    
    try {
      setLoading(true);
      await rescheduleAppointment(token!, currentAppointment.id, newDate, newTime);
      showMessage('Appointment rescheduled successfully!', 'success');
      
      // Update in the UI
      setAppointments(appointments.map((apt: any) => {
        if (apt.id === currentAppointment.id) {
          return { ...apt, date: newDate, time: newTime };
        }
        return apt;
      }));
      
      // Clear edit mode
      handleEditCancel();
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      showMessage('Failed to reschedule appointment', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  const filteredAppointments = appointments.filter((appointment: any) => {
    if (!filterText) return true;
    
    const searchTerm = filterText.toLowerCase();
    const matches = (value: any) => value && value.toString().toLowerCase().includes(searchTerm);
    
    switch (filterBy) {
      case 'id':
        return matches(appointment.id);
      case 'patient':
        return matches(appointment.user_id) || matches(appointment.user_name) || matches(appointment.patient_name);
      case 'provider':
        return matches(appointment.provider_id) || matches(appointment.provider_name);
      case 'date':
        return matches(appointment.date);
      default:
        // 'all' - search in all fields
        return matches(appointment.id) || 
               matches(appointment.user_id) || 
               matches(appointment.user_name) || 
               matches(appointment.patient_name) ||
               matches(appointment.provider_id) ||
               matches(appointment.provider_name) ||
               matches(appointment.date) ||
               matches(appointment.time);
    }
  });
  
  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto pt-24 px-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Appointment Management</h1>
          <p className="text-gray-600 mb-8">View and manage all appointments in the system</p>
          
          {/* Status message */}
          {message.text && (
            <div className={`mb-6 p-4 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message.text}
            </div>
          )}
          
          {/* Filter Controls */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-grow flex gap-3 w-full">
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-gray-700"
                >
                  <option value="all">All Fields</option>
                  <option value="id">Appointment ID</option>
                  <option value="patient">Patient</option>
                  <option value="provider">Provider</option>
                  <option value="date">Date</option>
                </select>
                
                <input
                  type="text"
                  placeholder="Filter appointments..."
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              
              <button
                onClick={fetchAppointments}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                Refresh Appointments
              </button>
            </div>
          </div>
          
          {/* Edit Modal */}
          {isEditing && currentAppointment && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                <h3 className="text-xl font-semibold mb-4">Reschedule Appointment</h3>
                <p className="mb-4 text-gray-700">
                  <span className="font-medium">Patient:</span> {currentAppointment.user_name || currentAppointment.user_id}<br />
                  <span className="font-medium">Provider:</span> {currentAppointment.provider_name || currentAppointment.provider_id}<br />
                  <span className="font-medium">Current Date/Time:</span> {currentAppointment.date} at {currentAppointment.time}
                </p>
                
                <form onSubmit={handleReschedule} className="space-y-4">
                  <div>
                    <label className="block text-gray-700">New Date</label>
                    <input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">New Time</label>
                    <input
                      type="time"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={handleEditCancel}
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          
          {/* Appointments List */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      Loading appointments...
                    </td>
                  </tr>
                ) : filteredAppointments.length > 0 ? (
                  filteredAppointments.map((appointment: any) => (
                    <tr key={appointment.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {appointment.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {appointment.user_name || appointment.user_id || 'Unknown Patient'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {appointment.provider_name || appointment.provider_id || 'Unknown Provider'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEditStart(appointment)}
                          className="text-blue-600 hover:text-blue-800 mr-4"
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={() => handleCancel(appointment.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      No appointments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
