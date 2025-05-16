import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';

const PatientDetailsPage = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [reports, setReports] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const doctorId = localStorage.getItem('doctorId');
  const token = localStorage.getItem('token');
  
  useEffect(() => {
    if(!token) {
      navigate("/")
    } else if(!doctorId) {
      navigate("/patient/dashboard");
    }
  }, [token, doctorId, navigate]);

  useEffect(() => {
    if (patientId && doctorId) {
      setLoading(true);
      setError(null);
      
      // Get appointments for the doctor that involve this patient
      API.get(`/appointments/doctor/${doctorId}`)
        .then(response => {
          const patientAppointments = response.data.filter(
            appt => appt.patientId.toString() === patientId.toString()
          );
          
          if (patientAppointments.length > 0) {
            const latestAppointment = patientAppointments[0];
            setPatient({
              id: patientId,
              name: latestAppointment.patientName,
              email: latestAppointment.patientUsername,
            });
            setAppointments(patientAppointments);
            
            // Get reports for these appointments
            const appointmentIds = patientAppointments.map(appt => appt.id);
            return Promise.all(
              appointmentIds.map(appointmentId => 
                API.get(`/reports/appointment/${appointmentId}`)
                  .catch(err => {
                    // If no report exists for this appointment, return null
                    if (err.response?.status === 404) {
                      return { data: null };
                    }
                    throw err;
                  })
              )
            );
          } else {
            throw new Error('No appointments found for this patient');
          }
        })
        .then(reportsResponses => {
          const validReports = reportsResponses
            .filter(response => response.data)
            .map(response => response.data);
          setReports(validReports);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error loading patient details:', err);
          setError(err.response?.data?.message || err.message || 'Error loading patient details');
          setLoading(false);
        });
    }
  }, [patientId, doctorId]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="p-6 complete-padding flex items-center justify-center">
          <div className="text-xl font-semibold">Loading patient details...</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="p-6 complete-padding">
          <div className="text-red-600 text-center">
            <p className="text-xl font-semibold mb-2">Error</p>
            <p>{error}</p>
            <button
              onClick={() => navigate('/doctor/dashboard')}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="p-6 complete-padding max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Patient Details</h2>
            <button
              onClick={() => navigate('/doctor/dashboard')}
              className="bg-gray-100 text-gray-600 px-4 py-2 rounded hover:bg-gray-200"
            >
              Back to Dashboard
            </button>
          </div>

          {patient ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-gray-600"><strong>Name:</strong> {patient.name}</p>
                  <p className="text-gray-600"><strong>Email:</strong> {patient.email}</p>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Appointments History</h3>
                <div className="space-y-4">
                  {appointments.map(appointment => (
                    <div key={appointment.id} className="border rounded-lg p-4 bg-gray-50">
                      <p><strong>Date:</strong> {new Date(appointment.date).toLocaleString()}</p>
                      <p><strong>Status:</strong> {appointment.status}</p>
                      <p><strong>Reason:</strong> {appointment.reason}</p>
                      {appointment.status === 'SCHEDULED' && (
                        <button
                          onClick={() => navigate(`/doctor/appointment/${appointment.id}/report`)}
                          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Create Report
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Medical Reports</h3>
                {reports.length > 0 ? (
                  <div className="space-y-4">
                    {reports.map(report => (
                      <div key={report.id} className="border rounded-lg p-4 bg-gray-50">
                        <p><strong>Date:</strong> {new Date(report.createdAt).toLocaleString()}</p>
                        <p><strong>Diagnosis:</strong> {report.diagnosis}</p>
                        <p><strong>Risk Level:</strong> {report.riskLevel}</p>
                        {report.medications && (
                          <p><strong>Medications:</strong> {report.medications}</p>
                        )}
                        {report.recommendedTests && (
                          <p><strong>Recommended Tests:</strong> {report.recommendedTests}</p>
                        )}
                        {report.lifestyleAdvice && (
                          <p><strong>Lifestyle Advice:</strong> {report.lifestyleAdvice}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No medical reports available.</p>
                )}
              </div>

              <div className="mt-6 flex flex-wrap gap-4">
                <button
                  onClick={() => navigate(`/doctor/patient/${patientId}/analyze`)}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Run Heart Attack Analyzer
                </button>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500">No patient data available.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default PatientDetailsPage;
