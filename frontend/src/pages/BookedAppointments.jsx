// src/pages/BookedAppointments.js
import React, { useEffect, useState } from 'react';
import API from '../services/api';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const BookedAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const patientId = localStorage.getItem('patientId');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/")
    } else if (!patientId) {
      navigate("/doctor/dashboard");
    }
  }, [token, patientId, navigate]);

  useEffect(() => {
    if (patientId) {
      API.get(`/appointments/patient/${patientId}`)
        .then(res => {
          // Filter pending appointments on the frontend if needed
          const pendingAppointments = res.data.filter(app => app.status === 'SCHEDULED' || app.status === 'CONFIRMED');
          setAppointments(pendingAppointments);
        })
        .catch(err => console.error('Error fetching appointments:', err));
    }
  }, [patientId]);

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 complete-padding">
        <h2 className="text-2xl font-bold mb-6 text-center">📋 Your Pending Appointments</h2>
        {appointments.length === 0 ? (
          <p className="text-center text-gray-600">No pending appointments found.</p>
        ) : (
          <ul className="space-y-4">
            {appointments.map(app => (
              <li key={app.id} className="border rounded p-4 shadow-sm">
                <p><strong>Doctor:</strong> {app.doctorName || 'N/A'}</p>
                <p><strong>Specialization:</strong> {app.doctorSpecialization || 'N/A'}</p>
                <p><strong>Date:</strong> {new Date(app.date).toLocaleString()}</p>
                <p><strong>Status:</strong> {app.status}</p>
                <p><strong>Reason:</strong> {app.reason}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default BookedAppointments;
