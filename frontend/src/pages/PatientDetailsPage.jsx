import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

const PatientDetailsPage = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [reports, setReports] = useState([]);
  const doctorId = localStorage.getItem('doctorId');
  const token = localStorage.getItem('token');
  
    useEffect(()=>{
      if(!token){
        navigate("/")
      }
      else{
        if(!doctorId){
          navigate("/patient/dashboard");
        }
      }
    }, [token, doctorId, navigate])
  useEffect(() => {
    API.get(`/doctor/patient/${patientId}/history`)
      .then(res => {
        setPatient(res.data.patient);
        setReports(res.data.reports);
      })
      .catch(err => console.error('Error loading patient details:', err));
  }, [patientId]);

  return (
    <div className="p-6 complete-padding">
      <h2 className="text-xl font-bold mb-4">Patient Details</h2>
      {patient ? (
        <>
          <p><strong>Name:</strong> {patient.name}</p>
          <p><strong>Email:</strong> {patient.email}</p>

          <h4 className="mt-4 font-semibold">Reports</h4>
          <ul className="list-disc ml-6">
            {reports.map(report => (
              <li key={report._id}>
                <strong>Diagnosis:</strong> {report.diagnosis} | <strong>Risk:</strong> {report.riskLevel}
              </li>
            ))}
          </ul>

          <div className="mt-6 space-x-4">
            <button
              onClick={() => navigate(`/doctor/patient/${patientId}/analyze`)}
              className="bg-green-600 text-black px-4 py-2 rounded"
            >
              Run Heart Attack Analyzer
            </button>
            <button
              onClick={() => navigate(`/doctor/patient/${patientId}/report`)}
              className="bg-blue-600 text-black px-4 py-2 rounded"
            >
              Create Report
            </button>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PatientDetailsPage;
