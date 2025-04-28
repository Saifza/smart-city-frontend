import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, PieChart, Pie, Tooltip, Cell } from 'recharts';
import { format, parseISO } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';

function EnergyList() {
  const [energyData, setEnergyData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 5;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  const chartRef = useRef();

  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:8083/energy/usage');
      setEnergyData(res.data);
      setFilteredData(res.data);
    } catch (err) {
      console.error('Failed to fetch data', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const applyFilters = () => {
    let filtered = [...energyData];

    if (startDate) {
      filtered = filtered.filter(d => new Date(d.timestamp) >= new Date(startDate));
    }

    if (endDate) {
      filtered = filtered.filter(d => new Date(d.timestamp) <= new Date(endDate));
    }

    if (statusFilter) {
      filtered = filtered.filter(d => d.status.toLowerCase() === statusFilter.toLowerCase());
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(d =>
        d.id.toString().includes(searchTerm.toLowerCase()) ||
        d.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setCurrentPage(1); // Reset to page 1 after filtering
    setFilteredData(filtered);
  };

  const exportToCSV = () => {
    const csvRows = [
      ['ID', 'Consumption (kWh)', 'Timestamp', 'Status'],
      ...filteredData.map(row => [
        row.id,
        row.consumptionKwh,
        row.timestamp,
        row.status,
      ]),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'energy_usage.csv');
    document.body.appendChild(link);
    link.click();
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Energy Usage Report', 14, 10);
    autoTable(doc, {
      head: [['ID', 'Consumption (kWh)', 'Timestamp', 'Status']],
      body: filteredData.map(item => [
        item.id,
        item.consumptionKwh,
        item.timestamp,
        item.status
      ]),
    });
    doc.save('energy_usage.pdf');
  };

  const downloadChartImage = () => {
    html2canvas(chartRef.current).then(canvas => {
      const link = document.createElement('a');
      link.download = 'chart.png';
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  // Pagination logic
  const indexOfLast = currentPage * entriesPerPage;
  const indexOfFirst = indexOfLast - entriesPerPage;
  const currentData = filteredData.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);

  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <div className="container mt-4">
      <h2>Energy Usage List</h2>

      {/* Filters */}
      <div className="row mb-3">
        <div className="col-md-3">
          <label>Start Date</label>
          <input type="date" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div className="col-md-3">
          <label>End Date</label>
          <input type="date" className="form-control" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
        <div className="col-md-3">
          <label>Status</label>
          <select className="form-control" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All</option>
            <option value="Normal">Normal</option>
            <option value="High">High</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <div className="col-md-3 d-flex align-items-end">
          <button className="btn btn-primary w-100" onClick={applyFilters}>Apply Filters</button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-3 row">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search by ID or Status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <button className="btn btn-secondary w-100" onClick={applyFilters}>Search</button>
        </div>
      </div>

      {/* Table */}
      <table className="table table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>ID</th>
            <th>Consumption (kWh)</th>
            <th>Timestamp</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((usage) => (
            <tr key={usage.id}>
              <td>{usage.id}</td>
              <td>{usage.consumptionKwh}</td>
              <td>{format(parseISO(usage.timestamp), 'yyyy-MM-dd HH:mm')}</td>
              <td>{usage.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <nav>
        <ul className="pagination">
          {[...Array(totalPages).keys()].map((_, i) => (
            <li
              key={i}
              className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}
              onClick={() => handlePageChange(i + 1)}
              style={{ cursor: 'pointer' }}
            >
              <span className="page-link">{i + 1}</span>
            </li>
          ))}
        </ul>
      </nav>

      {/* Export Buttons */}
      <div className="mb-3">
        <button className="btn btn-outline-primary me-2" onClick={exportToCSV}>Export CSV</button>
        <button className="btn btn-outline-success me-2" onClick={exportToPDF}>Export PDF</button>
        <button className="btn btn-outline-warning" onClick={downloadChartImage}>Download Chart</button>
      </div>

      {/* Chart */}
      <h4 className="mt-5">Energy Usage Chart</h4>
      <div ref={chartRef}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={filteredData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="id" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="consumptionKwh" fill="#007bff" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <h4 className="mt-4">Usage Distribution (Pie Chart)</h4>
      <PieChart width={300} height={300}>
        <Pie
          data={filteredData}
          dataKey="consumptionKwh"
          nameKey="status"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          label
        >
          {filteredData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
  );
}

export default EnergyList;
