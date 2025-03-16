import React, { FormEvent, useState } from "react";
import {
  addHealthRec,
  getHealthRec,
  updateHealthRec,
  deleteHealthRec,
} from "../utils/api";

interface Props {
  token: string | null;
}

export default function HealthRecords({ token }: Props) {
  const [email, setEmail] = useState(""); // Changed from userId to email
  const [recordId, setRecordId] = useState("");
  const [recordData, setRecordData] = useState("");

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) {
      alert("Please sign in first.");
      return;
    }
    try {
      let parsedData;
      try {
        parsedData = JSON.parse(recordData || "{}");
      } catch (parseError) {
        alert("Invalid JSON format. Please check your input.");
        return;
      }
      const data = await addHealthRec(token, email, parsedData); // Changed from userId to email
      console.log("Add Health Record:", data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGet = async () => {
    if (!token) {
      alert("Please sign in first.");
      return;
    }
    if (!email) { // Changed from userId to email
      alert("Provide email address"); // Updated message
      return;
    }
    try {
      const data = await getHealthRec(token, email); // Changed from userId to email
      console.log("Get Health Record:", data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) {
      alert("Please sign in first.");
      return;
    }
    try {
      let parsedData;
      try {
        parsedData = JSON.parse(recordData || "{}");
      } catch (parseError) {
        alert("Invalid JSON format. Please check your input.");
        return;
      }
      const data = await updateHealthRec(token, email, recordId, parsedData); // Changed from userId to email
      console.log("Update Health Rec:", data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!token) {
      alert("Please sign in first.");
      return;
    }
    if (!email || !recordId) { // Changed from userId to email
      alert("Provide email and recordId"); // Updated message
      return;
    }
    try {
      const data = await deleteHealthRec(token, email, recordId); // Changed from userId to email
      console.log("Delete Health Rec:", data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full bg-white p-6 border border-gray-100 rounded-lg shadow-sm">
      <h3 className="text-2xl font-semibold text-gray-900 mb-6">Health Records</h3>
  
      {/* Add Health Record Form */}
      <form onSubmit={handleAdd} className="space-y-6 mb-6">
        <input
          type="email" // Changed to email type
          placeholder="Email Address" // Updated placeholder
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 text-gray-600 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-150"
        />
        <textarea
          placeholder="Record Data (JSON)"
          value={recordData}
          onChange={(e) => setRecordData(e.target.value)}
          className="w-full px-4 py-3 text-gray-600 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-150 h-24"
        />
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Add Health Record
        </button>
      </form>
  
      {/* Get Health Record Button */}
      <button
        onClick={handleGet}
        className="w-fit py-2 px-5 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors cursor-pointer mb-6"
      >
        Get Health Record
      </button>
  
      {/* Update Health Record Form */}
      <form onSubmit={handleUpdate} className="space-y-6 mb-6">
        <input
          type="email" // Changed to email type
          placeholder="Email Address" // Updated placeholder
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 text-gray-600 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-150"
        />
        <input
          type="text"
          placeholder="Record ID"
          value={recordId}
          onChange={(e) => setRecordId(e.target.value)}
          className="w-full px-4 py-3 text-gray-600 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-150"
        />
        <textarea
          placeholder="Updated Record Data (JSON)"
          value={recordData}
          onChange={(e) => setRecordData(e.target.value)}
          className="w-full px-4 py-3 text-gray-600 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-150 h-24"
        />
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Update Health Record
        </button>
      </form>
  
      {/* Delete Health Record */}
      <div className="flex gap-4">
        <input
          type="email" // Changed to email type
          placeholder="Email Address" // Updated placeholder
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-4 py-3 text-gray-600 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-150"
        />
        <input
          type="text"
          placeholder="Record ID"
          value={recordId}
          onChange={(e) => setRecordId(e.target.value)}
          className="flex-1 px-4 py-3 text-gray-600 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-150"
        />
        <button
          onClick={handleDelete}
          className="py-3 px-5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors cursor-pointer"
        >
          Delete Health Rec
        </button>
      </div>
    </div>
  );
}
