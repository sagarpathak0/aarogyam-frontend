import React, { FormEvent, useState } from 'react';
import { bookAppointment, rescheduleAppointment, cancelAppointment } from '../utils/api';

interface Props {
  token: string | null;
}

export default function Appointments({ token }: Props) {
  const [providerId, setProviderId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [appointmentId, setAppointmentId] = useState('');

  const handleBook = async (e: FormEvent) => {
    e.preventDefault();
    if (!token || !providerId || !date || !time) {
      alert('Sign in and fill all fields to book appointment.');
      return;
    }
    try {
      const data = await bookAppointment(token, providerId, date, time);
      console.log('Book Appointment:', data);
    } catch (err) {
      console.error(err);
      alert('Failed to book appointment. Please try again.');
    }
  };

  const handleReschedule = async (e: FormEvent) => {
    e.preventDefault();
    if (!token || !appointmentId || !date || !time) {
      alert('Sign in and fill all fields to reschedule.');
      return;
    }
    try {
      const data = await rescheduleAppointment(token, appointmentId, date, time);
      console.log('Reschedule:', data);
    } catch (err) {
      console.error(err);
      alert('Failed to reschedule appointment. Please try again.');
    }
  };

  const handleCancel = async (e: FormEvent) => {
    e.preventDefault();
    if (!token || !appointmentId) {
      alert('Sign in and provide appointmentId.');
      return;
    }
    try {
      const data = await cancelAppointment(token, appointmentId);
      console.log('Cancel Appointment:', data);
    } catch (err) {
      console.error(err);
      alert('Failed to cancel appointment. Please try again.');
    }
  };

  return (
    <div className="w-full bg-white p-6 border border-gray-200 rounded-lg shadow-sm space-y-6">
      <h3 className="text-2xl font-semibold text-gray-800">Appointments</h3>
      {/* Book */}
      <form onSubmit={handleBook} className="space-y-4">
        <input
          type="text"
          placeholder="Provider ID"
          value={providerId}
          onChange={(e) => setProviderId(e.target.value)}
          className="w-full px-4 py-2 border text-gray-800 border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-700"
        />
        <input
          type="text"
          placeholder="Date (YYYY-MM-DD)"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-4 py-2 border text-gray-800 border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-700"
        />
        <input
          type="text"
          placeholder="Time (HH:MM)"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full px-4 py-2 border text-gray-800 border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-700"
        />
        <button
          type="submit"
          className="w-full py-2 cursor-pointer bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          Book Appointment
        </button>
      </form>
      {/* Reschedule */}
      <form onSubmit={handleReschedule} className="space-y-4">
        <input
          type="text"
          placeholder="Appointment ID"
          value={appointmentId}
          onChange={(e) => setAppointmentId(e.target.value)}
          className="w-full px-4 py-2 text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-700"
        />
        <input
          type="text"
          placeholder="New Date (YYYY-MM-DD)"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-4 py-2 text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-700"
        />
        <input
          type="text"
          placeholder="New Time (HH:MM)"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full px-4 py-2 text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-700"
        />
        <button
          type="submit"
          className="w-full py-2 cursor-pointer bg-gray-800 text-white font-medium rounded-md hover:bg-gray-900 transition-colors"
        >
          Reschedule Appointment
        </button>
      </form>
      {/* Cancel */}
      <form onSubmit={handleCancel} className="flex space-x-4">
        <input
          type="text"
          placeholder="Appointment ID"
          value={appointmentId}
          onChange={(e) => setAppointmentId(e.target.value)}
          className="flex-1 px-4 py-2 text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-700"
        />
        <button
          type="submit"
          className="py-2 px-4 cursor-pointer bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors"
        >
          Cancel Appointment
        </button>
      </form>
    </div>
  );
}