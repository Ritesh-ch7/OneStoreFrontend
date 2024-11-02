import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import './Dashboard.css';

// Register chart elements and plugins
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth0();
  const [metrics, setMetrics] = useState({
    total_files: 0,
    total_uploads: 0,
    total_downloads: 0, // Add this to hold total downloads
    file_download_data: [] // This will hold the file metadata
  });
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMetrics();
    }
  }, [isAuthenticated]);

  const fetchMetrics = async () => {
    try {
      // Fetch metrics
      const metricsResponse = await fetch('http://localhost:8000/dashboard/');
      const metricsData = await metricsResponse.json();

      // Fetch files metadata
      const filesResponse = await fetch('http://localhost:8000/files/files');
      const filesData = await filesResponse.json();

      // Transform the file data to match the expected format
      const transformedFilesData = filesData.map(file => ({
        file_name: file.name,
        upload_date: file.upload_time,
        file_size: file.size,
        count: file.count 
      }));

      // Set the combined metrics and files data
      setMetrics({
        ...metricsData,
        file_download_data: transformedFilesData
      });
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://localhost:8000/files/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json(); // Use the response data
      alert(data.message || "File uploaded successfully!");
      setSelectedFile(null); // Clear the input after upload
      fetchMetrics(); // Refresh metrics after upload
    } catch (error) {
      console.error('Error uploading file:', error);
      alert("File upload failed.");
    }
  };

  const handleDownload = async (fileName) => {
    try {
      const response = await fetch(`http://localhost:8000/files/download/${fileName}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();

      // Fetch metrics again to update the pie chart and table after downloading
      fetchMetrics(); // Call fetchMetrics here to update the chart and table
    } catch (error) {
      console.error('Error downloading file:', error);
      alert("Download failed.");
    }
  };

  // Data for the pie chart
  const pieData = {
    labels: ['Total Files', 'Total Uploads', 'Total Downloads'],
    datasets: [
      {
        label: 'OneStore Dashboard Metrics',
        data: [metrics.total_files, metrics.total_uploads, metrics.total_downloads], // Use total_downloads
        backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB90', '#FFCE5690', '#FF638490']
      }
    ]
  };

  // Options for the pie chart, including data labels
  const pieOptions = {
    plugins: {
      legend: {
        position: 'top'
      },
      datalabels: {
        color: '#ffffff', // White text for contrast
        font: {
          size: 14,
          weight: 'bold'
        },
        formatter: (value, context) => {
          return `${context.chart.data.labels[context.dataIndex]}: ${value}`;
        }
      }
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>OneStore</h1>
        <p>Hi, {user?.name}!</p>
      </header>
      <div className="metrics">
        <h2>OneStore Dashboard Metrics</h2>
        <div className="chart-container">
          <div className="pie-chart-wrapper">
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>
      </div>

      {/* Upload New File Section */}
      <div className="upload-section">
        <h2>Upload New File</h2>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload} className="upload-button">Upload</button>
      </div>

      <div className="download-data">
        <h2>File Repository</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>File Name</th>
              <th>Download Count</th>
              <th>Upload Timestamp</th>
              <th>File Size (MB)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {metrics.file_download_data.map((file) => (
              <tr key={file.file_name}>
                <td>{file.file_name}</td>
                <td>{file.count}</td>
                <td>{new Date(file.upload_date).toLocaleString()}</td>
                <td>{(file.file_size / (1024 * 1024)).toFixed(2)}</td>
                <td>
                  <button onClick={() => handleDownload(file.file_name)} className="download-button">Download</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
