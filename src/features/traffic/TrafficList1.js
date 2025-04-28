import React, { useEffect, useState, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import TrafficForm from './TrafficForm';
import * as htmlToImage from 'html-to-image';
import download from 'downloadjs';
import { handleWebSocketIncident, handleWebSocketDelete } from './WebSocketUtils';
import { CustomToast } from './CustomToast'

let stompClient = null;

function TrafficList() {
  const chartRef = useRef();
  const [incidents, setIncidents] = useState([]);
  const [filteredIncidents, setFilteredIncidents] = useState([]);
  const [locationFilter, setLocationFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  const [isEditing, setIsEditing] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  // helper to show a toast
 // const showToast = (msg) => {
  //  toast.info(msg, {
  //    position: "bottom-right",
   //   autoClose: 3000,
   //   pauseOnHover: true,
   //   draggable: true
   // });
 // };

const showToast = (message, severity) => {
  toast(<CustomToast message={message} severity={severity} />, {
    position: "bottom-right",
    autoClose: 3000,
    toastId: `${message}-${severity}`
  });
};




  useEffect(() => {
    fetchIncidents();
    connectWebSocket();
  }, []);

  function connectWebSocket() {
    const socket = new SockJS('http://localhost:8081/traffic-websocket');
    stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log("📡 WebSocket connected");
        stompClient.subscribe("/topic/traffic", (message) => {
          const incident = JSON.parse(message.body);
          handleWebSocketIncident(incident, setIncidents, setFilteredIncidents, showToast);
        });
        stompClient.subscribe("/topic/traffic-delete", (message) => {
          const deletedId = JSON.parse(message.body);
          handleWebSocketDelete(deletedId, setIncidents, setFilteredIncidents, showToast);
        });
      },
      onStompError: frame => {
        console.error('Broker error:', frame.headers['message']);
        console.error('Details:', frame.body);
      }
    });
    stompClient.activate();
  }

  async function fetchIncidents() {
    try {
      const { data } = await axios.get('http://localhost:8081/traffic/incidents');
      setIncidents(data);
      setFilteredIncidents(data);
    } catch (err) {
      console.error('Failed to fetch incidents', err);
    }
  }

  async function handleFormSubmit(formData) {
    try {
      if (isEditing && editTarget) {
        await axios.put(
          `http://localhost:8081/traffic/incidents/${editTarget.id}`,
          formData
        );
      } else {
        await axios.post(
          'http://localhost:8081/traffic/incidents',
          formData
        );
      }
      setIsEditing(false);
      setEditTarget(null);
      // WebSocket will push the live update—no fetch needed
    } catch (err) {
      console.error('Failed to submit form', err);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this incident?")) return;
    try {
      await axios.delete(`http://localhost:8081/traffic/incidents/${id}`);
      // WebSocket will remove it for us
    } catch (err) {
      console.error("Failed to delete", err);
    }
  }

  function handleEdit(incident) {
    setIsEditing(true);
    setEditTarget(incident);
  }
  function cancelEdit() {
    setIsEditing(false);
    setEditTarget(null);
  }

  function applyFilters() {
    let f = [...incidents];
    if (startDate) f = f.filter(i => new Date(i.timestamp) >= new Date(startDate));
    if (endDate)   f = f.filter(i => new Date(i.timestamp) <= new Date(endDate));
    if (severityFilter)
      f = f.filter(i => i.severity.toLowerCase() === severityFilter.toLowerCase());
    if (locationFilter)
      f = f.filter(i =>
        i.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    if (searchQuery)
      f = f.filter(i =>
        i.id.toString().includes(searchQuery.trim()) ||
        i.severity.toLowerCase().includes(searchQuery.toLowerCase())
      );
    setFilteredIncidents(f);
  }

  function resetFilters() {
    setLocationFilter('');
    setSeverityFilter('');
    setStartDate('');
    setEndDate('');
    setSearchQuery('');
    setFilteredIncidents(incidents);
  }

  function exportToCSV() {
    const rows = [
      ['ID','Location','Severity','Description','Timestamp'],
      ...filteredIncidents.map(i => [
        i.id,
        `${i.location.latitude.toFixed(4)}, ${i.location.longitude.toFixed(4)}`,
        i.severity,
        i.description,
        i.timestamp
      ])
    ];
    const csv = 'data:text/csv;charset=utf-8,' + rows.map(r => r.join(',')).join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csv);
    link.download = 'traffic_incidents.csv';
    document.body.appendChild(link);
    link.click();
  }

  function exportToPDF() {
    const doc = new jsPDF();
    doc.text('Traffic Incident Report', 14, 10);
    autoTable(doc, {
      head: [['ID','Location','Severity','Description','Timestamp']],
      body: filteredIncidents.map(i => [
        i.id,
        `${i.location.latitude.toFixed(4)}, ${i.location.longitude.toFixed(4)}`,
        i.severity,
        i.description,
        i.timestamp
      ])
    });
    doc.save('traffic_incidents.pdf');
  }

  function getSeverityData() {
    const counts = { LOW:0, MEDIUM:0, HIGH:0 };
    filteredIncidents.forEach(i => {
      const sev = i.severity.toUpperCase();
      if (counts[sev] != null) counts[sev]++;
    });
    return Object.entries(counts).map(([severity,value]) => ({ severity, value }));
  }

  function downloadChart() {
    if (!chartRef.current) return;
    htmlToImage.toPng(chartRef.current)
      .then(dataUrl => download(dataUrl, 'traffic-severity-chart.png'))
      .catch(err => console.error('❌ Failed to download chart', err));
  }

  function downloadChartAsJPEG() {
    if (!chartRef.current) return;
    htmlToImage.toJpeg(chartRef.current, { quality: 0.95 })
      .then(dataUrl => download(dataUrl, 'traffic-severity-chart.jpeg'))
      .catch(err => console.error('❌ Failed to download JPEG', err));
  }

  function downloadChartAsPDF() {
    if (!chartRef.current) return;
    htmlToImage.toPng(chartRef.current)
      .then(dataUrl => {
        const pdf = new jsPDF();
        pdf.text('Traffic Severity Chart', 10, 10);
        pdf.addImage(dataUrl, 'PNG', 10, 20, 180, 100);
        pdf.save('traffic-severity-chart.pdf');
      })
      .catch(err => console.error('❌ Failed to download chart as PDF', err));
  }

  return (
    <div className="container mt-4">
      <ToastContainer />
      <TrafficForm
        onSubmit={handleFormSubmit}
        isEditing={isEditing}
        initialData={editTarget}
        cancelEdit={cancelEdit}
      />

      <h2>🚦 Traffic Incidents</h2>

      {/* -- Filters -- */}
      <div className="row mb-3">…</div>
      <div className="row mb-3">…</div>

      {/* -- Table -- */}
      <table className="table table-bordered table-striped">
        <thead>…</thead>
        <tbody>
          {filteredIncidents.map(incident =>
            <tr key={incident.id}>
              <td>{incident.id}</td>
              <td>
                Lat: {incident.location.latitude.toFixed(4)},<br/>
                Lng: {incident.location.longitude.toFixed(4)}
              </td>
              <td>{incident.description}</td>
              <td>{incident.severity}</td>
              <td>{format(parseISO(incident.timestamp),'yyyy-MM-dd HH:mm')}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEdit(incident)}
                >✏️ Edit</button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(incident.id)}
                >🗑️ Delete</button>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* -- Export Buttons & Chart -- */}
      <div className="mb-4">
        <button className="btn btn-outline-primary me-2" onClick={exportToCSV}>Export CSV</button>
        <button className="btn btn-outline-success" onClick={exportToPDF}>Export PDF</button>
      </div>

      <h4 className="mt-5">Severity Distribution</h4>
      <div ref={chartRef}>
        <PieChart width={300} height={300}>
          <Pie
            data={getSeverityData()}
            dataKey="value"
            nameKey="severity"
            cx="50%" cy="50%" outerRadius={100}
            fill="#8884d8"
            label
          >
            {getSeverityData().map((entry, idx) =>
              <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
            )}
          </Pie>
          <Tooltip/>
        </PieChart>
      </div>
      <div className="d-flex gap-2 mt-2">
        <button className="btn btn-outline-info" onClick={downloadChart}>📊 PNG</button>
        <button className="btn btn-outline-secondary" onClick={downloadChartAsJPEG}>🖼️ JPEG</button>
        <button className="btn btn-outline-danger" onClick={downloadChartAsPDF}>📄 PDF</button>
      </div>
    </div>
  );
}

export default TrafficList;
