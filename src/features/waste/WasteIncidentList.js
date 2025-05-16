// WasteIncidentList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function WasteIncidentList({ onEdit }) {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8082/waste/incidents')
      .then(response => setIncidents(response.data))
      .catch(error => console.error('🧹 Failed to fetch waste incidents:', error));
  }, []);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8082/waste/incidents/${id}`)
      .then(() => {
        setIncidents(incidents.filter(incident => incident.id !== id));
      })
      .catch(err => console.error("❌ Delete failed", err));
  };

  return (
    <div className="container mt-4">
      <h2>🗑️ Waste Incident List</h2>
      <ul className="list-group">
        {incidents.map((incident, index) => (
          <li key={index} className="list-group-item">
            <strong>{incident.type}</strong> in {incident.city}<br />
            {new Date(incident.timestamp).toLocaleString()}<br />
            Status: {incident.status}<br />
            Description: {incident.description}
            <div className="mt-2">
              <button className="btn btn-sm btn-danger me-2" onClick={() => handleDelete(incident.id)}>Delete</button>
              <button className="btn btn-sm btn-warning" onClick={() => onEdit(incident)}>Edit</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default WasteIncidentList;
