import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';

export default function ReportDetails() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await API.get(`/reports/${id}`);
        setReport(res.data);
      } catch (err) {
        console.error('Error fetching report:', err);
        setError('Could not fetch report');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  if (loading) return <div>Loading report...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!report) return <div>No report found.</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Report Details</h1>
      <p><strong>Diagnosis:</strong> {report.diagnosis}</p>
      <p><strong>Risk Level:</strong> {report.riskLevel}</p>
      <p><strong>Recommended Tests:</strong> {report.recommendedTests}</p>
      <p><strong>Medications:</strong> {report.medications}</p>
      <p><strong>Lifestyle Advice:</strong> {report.lifestyleAdvice}</p>
    </div>
  );
}
