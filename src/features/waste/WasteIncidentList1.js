// src/components/WasteIncidentList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function WasteIncidentList({ refreshKey }) {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8082/waste/incidents')
      .then(response => {
        setIncidents(response.data);
      })
      .catch(error => {
        console.error('🧹 Failed to fetch waste incidents:', error);
      });
  }, [refreshKey]);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8082/waste/incidents/${id}`)
      .then(() => {
        setIncidents(prev => prev.filter(incident => incident.id !== id));
      })
      .catch(error => {
        console.error(`❌ Failed to delete incident ${id}:`, error);
      });
  };

  return (
    <div className="container mt-4">
      <h2>🗑️ Waste Incident List</h2>
      <ul className="list-group">
        {incidents.map((incident) => (
          <li key={incident.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{incident.type}</strong> in {incident.city} at {new Date(incident.timestamp).toLocaleString()}
              <br />
              Status: {incident.status} — {incident.description}
            </div>
            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(incident.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default WasteIncidentList;
