import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';

const HeartAttackAnalyzerPage = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState({
    age: '',
    sex: '1',
    cp: '0',
    trtbps: '',
    chol: '',
    fbs: '0',
    restecg: '0',
    thalachh: '',
    exng: '0',
    oldpeak: '',
    slp: '0',
    caa: '0',
    thall: '3'
  });

  const doctorId = localStorage.getItem('doctorId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate("/")
    } else if (!doctorId) {
      navigate("/patient/dashboard");
    }
  }, [token, doctorId, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await API.post('/predict/heart-attack-risk', {
        ...formData,
        age: parseInt(formData.age),
        sex: parseInt(formData.sex),
        cp: parseInt(formData.cp),
        trtbps: parseInt(formData.trtbps),
        chol: parseInt(formData.chol),
        fbs: parseInt(formData.fbs),
        restecg: parseInt(formData.restecg),
        thalachh: parseInt(formData.thalachh),
        exng: parseInt(formData.exng),
        oldpeak: parseFloat(formData.oldpeak),
        slp: parseInt(formData.slp),
        caa: parseInt(formData.caa),
        thall: parseInt(formData.thall)
      });
      
      setResult(response.data);
    } catch (err) {
      console.error('Error predicting heart attack risk:', err);
      setError(err.response?.data?.message || 'Error analyzing heart attack risk');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReport = async () => {
    if (result) {
      try {
        // Fetch the next scheduled appointment for this patient
        const response = await API.get(`/appointments/patient/${patientId}/next`);
        const nextAppointmentId = response.data.id;
        
        if (!nextAppointmentId) {
          setError('No upcoming appointments found for this patient. Please schedule an appointment first.');
          return;
        }

        navigate(`/doctor/appointment/${nextAppointmentId}/report`, {
          state: {
            diagnosis: result.diagnosis,
            riskLevel: result.riskLevel
          }
        });
      } catch (err) {
        console.error('Error fetching next appointment:', err);
        setError('Failed to create report. Please ensure the patient has an upcoming appointment.');
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-6 complete-padding max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">❤️ Heart Attack Risk Analyzer</h2>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative">
              <p>{error}</p>
            </div>
          )}

          {result && (
            <div className="mb-6 p-4 border rounded-lg bg-blue-50">
              <h3 className="text-xl font-semibold mb-2">Analysis Results</h3>
              <p><strong>Risk Level:</strong> {result.riskLevel}</p>
              <p><strong>Risk Score:</strong> {(result.riskScore * 100).toFixed(2)}%</p>
              <p><strong>Diagnosis:</strong> {result.diagnosis}</p>
              <button
                onClick={handleCreateReport}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Create Report with These Results
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Sex</label>
                <select
                  name="sex"
                  value={formData.sex}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="1">Male</option>
                  <option value="0">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Chest Pain Type</label>
                <select
                  name="cp"
                  value={formData.cp}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="0">Typical Angina</option>
                  <option value="1">Atypical Angina</option>
                  <option value="2">Non-anginal Pain</option>
                  <option value="3">Asymptomatic</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Resting Blood Pressure</label>
                <input
                  type="number"
                  name="trtbps"
                  value={formData.trtbps}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Serum Cholesterol</label>
                <input
                  type="number"
                  name="chol"
                  value={formData.chol}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Fasting Blood Sugar</label>
                <select
                  name="fbs"
                  value={formData.fbs}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="0">≤ 120 mg/dl</option>
                  <option value="1">&gt; 120 mg/dl</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Resting ECG Results</label>
                <select
                  name="restecg"
                  value={formData.restecg}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="0">Normal</option>
                  <option value="1">ST-T Wave Abnormality</option>
                  <option value="2">Left Ventricular Hypertrophy</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Maximum Heart Rate</label>
                <input
                  type="number"
                  name="thalachh"
                  value={formData.thalachh}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Exercise Induced Angina</label>
                <select
                  name="exng"
                  value={formData.exng}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">ST Depression</label>
                <input
                  type="number"
                  step="0.1"
                  name="oldpeak"
                  value={formData.oldpeak}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Slope of Peak Exercise ST Segment</label>
                <select
                  name="slp"
                  value={formData.slp}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="0">Upsloping</option>
                  <option value="1">Flat</option>
                  <option value="2">Downsloping</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Number of Major Vessels</label>
                <select
                  name="caa"
                  value={formData.caa}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Thalassemia</label>
                <select
                  name="thall"
                  value={formData.thall}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="3">Normal</option>
                  <option value="6">Fixed Defect</option>
                  <option value="7">Reversible Defect</option>
                </select>
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <button
                type="submit"
                disabled={loading}
                className={`bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Analyzing...' : 'Analyze Risk'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default HeartAttackAnalyzerPage;
