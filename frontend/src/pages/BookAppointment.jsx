import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const BookAppointment = () => {
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState('');
  const [reason, setReason] = useState('');
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();
  const patientId = localStorage.getItem("patientId");
  const token = localStorage.getItem('token'); 
  console.log("pati", patientId)
  useEffect(() => {
    if (!token) {
      navigate('/');
    } else if (!patientId) {
      navigate('/doctor/dashboard');
    }
  }, [token, patientId, navigate]);
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await API.get('/doctor/all');
        setDoctors(res.data);
      } catch (err) {
        console.error('Error fetching doctors:', err);
      }
    };
    fetchDoctors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/patient/create/appointment', {
        patientId,
        doctorId,
        date,
        reason,
      });
      navigate('/patient/dashboard');
    } catch (err) {
      console.error('Error booking appointment:', err);
    }
  };

  return (
    <>
    <Navbar/>
    <div className="min-h-screen complete-padding bg-gradient-to-tr from-blue-50 to-blue-100 flex items-center justify-center px-4 py-12">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-3xl">
        <h2 className="text-4xl font-extrabold text-center text-blue-700 mb-8">📅 Book an Appointment</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Doctor Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Doctor</label>
            <br/>
            <select
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">-- Choose a Doctor --</option>

              {doctors.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  {doc.name} ({doc.email})
                </option>
              ))}
            </select>
          </div>

          {/* Date Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Date & Time</label>
            <br/>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Reason TextArea */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Appointment</label>
            <br/>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Briefly describe your symptoms or reason for visit..."
              required
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-black font-semibold py-3 rounded-lg transition duration-300 shadow-md"
            >
              Confirm Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
};

export default BookAppointment;
