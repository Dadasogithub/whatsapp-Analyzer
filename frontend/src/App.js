import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';
import './App.css';
import { FaWhatsapp } from "react-icons/fa";
import { API_ENDPOINTS } from './context/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Please upload a WhatsApp chat file');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('chat', file);

    try {
       const res = await fetch(API_ENDPOINTS.UPLOAD_CHAT, {
        method: 'POST',
        body: formData
      });
      

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');

      setResult(data);
      console.log(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const chartData = result && {
    labels: result.dates,
    datasets: [
      {
        label: 'Active Users',
        data: result.active,
        backgroundColor: 'blue'
      },
      {
        label: 'New Users',
        data: result.joined,
        backgroundColor: 'orange'
      }
    ]
  };


  return (
  <div className="page">
    <div className="card">
      <h2 className="heading">
         <FaWhatsapp style={{ color: "#25D366", margin: "10px 10px 0px 10px" }} />
         WhatsApp Chat Analyzer
      </h2>

      <form className="form" onSubmit={handleSubmit}>
        <label className="upload-box">
          <input
            type="file"
            accept=".txt"
            onChange={(e) => setFile(e.target.files[0])}
            hidden
          />
          <span>
          📁 {file ? file.name : "Click to upload chat file"}
        </span>
        </label>

        <button className="analyze-btn" type="submit" disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze Chat'}
        </button>
      </form>

      {error && <div className="error-box">{error}</div>}

      {result && (
        <>
          <h3 className="subheading">Last 7 Days Activity</h3>

          <div className="chart-box">
            <Bar data={chartData} />
          </div>

          <h3 className="subheading">Users active at least 4 days</h3>
          <div className="user-grid">
            {result.activeUsersAtLeast4Days?.map(user => (
              <div className="user-chip" key={user}>
                {user}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  </div>


  );
}
