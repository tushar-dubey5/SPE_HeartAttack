import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HeartAttackAnalyzerPage = () => {
  const doctorId = localStorage.getItem('doctorId');
    const token = localStorage.getItem('token');
    const navigate = useNavigate
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


  const [formData, setFormData] = useState({
    age: '',
    sex: '1',
    chol: '',
    restecg: '0',
    oldpeak: '',
    caa: '',
    exng: '0',
    cp: '0',
    fbs: '0',
    trtbps: '',
    thalachh: '',
    slp: '',
    thall: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting formData:', formData);
    // You can now send formData to your backend API here
  };

  return (
    <div className="min-h-screen complete-padding bg-gradient-to-tr from-red-50 to-red-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-6xl">
        <h2 className="text-4xl font-bold text-center text-red-600 mb-8">❤️ Heart Attack Analyzer</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Age</label>
              <input
                type="text"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Sex</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="sex"
                    value="1"
                    checked={formData.sex === '1'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Male
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="sex"
                    value="0"
                    checked={formData.sex === '0'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Female
                </label>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Cholesterol (mg/dl)</label>
              <input
                type="text"
                name="chol"
                value={formData.chol}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Resting ECG Result</label>
              <select
                name="restecg"
                value={formData.restecg}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400"
              >
                <option value="0">Normal</option>
                <option value="1">ST-T Wave Abnormality</option>
                <option value="2">Left Ventricular Hypertrophy</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Old Peak</label>
              <input
                type="text"
                name="oldpeak"
                value={formData.oldpeak}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Number of Major Vessels</label>
              <input
                type="text"
                name="caa"
                value={formData.caa}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Induced Angina</label>
              <select
                name="exng"
                value={formData.exng}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400"
              >
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Chest Pain Type</label>
              <select
                name="cp"
                value={formData.cp}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400"
              >
                <option value="0">Typical Angina</option>
                <option value="1">Atypical Angina</option>
                <option value="2">Non-Anginal Pain</option>
                <option value="3">Asymptomatic</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Fasting Blood Sugar 120mg/dl</label>
              <select
                name="fbs"
                value={formData.fbs}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400"
              >
                <option value="0">No</option>
                <option value="1">True</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Resting Blood Pressure (mm Hg)</label>
              <input
                type="text"
                name="trtbps"
                value={formData.trtbps}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Maximum Heart Rate</label>
              <input
                type="text"
                name="thalachh"
                value={formData.thalachh}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Slope</label>
              <input
                type="text"
                name="slp"
                value={formData.slp}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Thalium Stress Test (0-3)</label>
              <input
                type="text"
                name="thall"
                value={formData.thall}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="col-span-1 md:col-span-2 flex justify-center mt-6">
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-black font-bold py-3 px-10 rounded-lg shadow-lg transition duration-300"
            >
              Calculate Risk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HeartAttackAnalyzerPage;
