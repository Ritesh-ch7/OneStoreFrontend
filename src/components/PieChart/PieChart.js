// src/components/PieChart/PieChart.js
import React from 'react';
import { Pie } from 'react-chartjs-2';

const PieChart = ({ totalFiles, totalUploads, totalDownloads }) => {
  const data = {
    labels: ['Total Files', 'Total Uploads', 'Total Downloads'],
    datasets: [
      {
        label: 'Storage Metrics',
        data: [totalFiles, totalUploads, totalDownloads],
        backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return <Pie data={data} options={options} />;
};

export default PieChart;
