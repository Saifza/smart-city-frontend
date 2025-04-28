import React, { useRef } from 'react';
import {
  LineChart, Line, PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import html2canvas from 'html2canvas';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const EnergyCharts = ({ data }) => {
  const chartRef = useRef(null);

  const handleExport = () => {
    html2canvas(chartRef.current).then(canvas => {
      const link = document.createElement('a');
      link.download = 'energy-charts.png';
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  return (
    <div className="mt-4">
      <div ref={chartRef}>
        <h4>Energy Usage Over Time</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="consumptionKwh" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>

        <h4 className="mt-5">Energy Usage Distribution (Pie)</h4>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="consumptionKwh"
              nameKey="status"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        <h4 className="mt-5">Energy Usage (Bar Chart)</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="consumptionKwh" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3">
        <button className="btn btn-primary" onClick={handleExport}>
          📸 Export Chart as PNG
        </button>
      </div>
    </div>
  );
};

export default EnergyCharts;
