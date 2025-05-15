import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

const ReportForm = ({ patientId, doctorId, appointmentId }) => {
  const [diagnosis, setDiagnosis] = useState('');
  const [riskLevel, setRiskLevel] = useState('LOW');
  const [recommendedTests, setRecommendedTests] = useState('');
  const [medications, setMedications] = useState('');
  const [lifestyleAdvice, setLifestyleAdvice] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // First, update the appointment status to COMPLETED
      await API.put(`/api/appointments/${appointmentId}/status?status=COMPLETED`);
      
      // Then create the report
      await API.post('/api/reports', {
        appointmentId,
        diagnosis,
        riskLevel,
        recommendedTests,
        medications,
        lifestyleAdvice,
      });
      
      setSubmitted(true);
      setTimeout(() => navigate('/doctor/dashboard'), 2000);
    } catch (err) {
      console.error('Error submitting report:', err);
      setError(err.response?.data?.message || 'Error submitting report');
    }
  };

  if (submitted) {
    return (
      <div className="text-center mt-6">
        <p className="text-green-600 font-semibold text-lg">✅ Report submitted successfully!</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto mt-6 bg-white border border-gray-300 rounded-lg shadow p-6 space-y-5"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">📝 Submit Patient Report</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative" role="alert">
          <p>{error}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Final Diagnosis</label>
        <textarea
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={3}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Risk Level</label>
        <select
          value={riskLevel}
          onChange={(e) => setRiskLevel(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="LOW">Low</option>
          <option value="MODERATE">Moderate</option>
          <option value="HIGH">High</option>
          <option value="CRITICAL">Critical</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Recommended Tests</label>
        <textarea
          value={recommendedTests}
          onChange={(e) => setRecommendedTests(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={2}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Medications Prescribed</label>
        <textarea
          value={medications}
          onChange={(e) => setMedications(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={2}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Lifestyle Advice</label>
        <textarea
          value={lifestyleAdvice}
          onChange={(e) => setLifestyleAdvice(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={2}
        />
      </div>

      <div className="text-center">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md shadow transition"
        >
          📤 Submit Report
        </button>
      </div>
    </form>
  );
};

export default ReportForm;
