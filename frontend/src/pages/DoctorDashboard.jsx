import React, { useEffect, useState } from 'react';
import API from '../services/api';
import AppointmentList from '../components/AppointmentList';
import PatientDetails from '../components/PatientDetails';
import CompletedAppointments from '../components/CompletedAppointments';
import Navbar from '../components/Navbar';
import '../App.css'
import { useNavigate } from 'react-router-dom';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const doctorId = localStorage.getItem('doctorId');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if(!token) {
      navigate("/")
    } else if(!doctorId) {
      navigate("/patient/dashboard");
    }
  }, [token, doctorId, navigate]);

  useEffect(() => {
    if (!showCompleted && doctorId) {
      API.get(`/api/appointments/doctor/${doctorId}`)
        .then(res => {
          console.log('Appointments response:', res.data);
          setAppointments(res.data);
        })
        .catch(err => {
          console.error('Error fetching appointments:', err);
          if (err.response?.status === 403) {
            console.error('Authorization error - doctorId:', doctorId);
          }
        });
    }
  }, [showCompleted, doctorId]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-6">
      <Navbar
        showCompleted={showCompleted}
        toggleCompletedView={() => {
          setShowCompleted(!showCompleted);
          setSelectedPatient(null);
        }}
      />

      <div className="space-y-8 complete-padding">
        {!showCompleted ? (
          <>
            <AppointmentList appointments={appointments} onSelectPatient={setSelectedPatient} />
            {selectedPatient && (
              <div className="mt-10">
                <PatientDetails patientId={selectedPatient} doctorId={doctorId} />
              </div>
            )}
          </>
        ) : (
          <CompletedAppointments doctorId={doctorId} />
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
