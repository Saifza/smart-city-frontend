// src/features/emergency/EmergencyIncidentList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function EmergencyIncidentList({ onEdit }) {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8084/emergency/incidents')
      .then(response => setIncidents(response.data))
      .catch(err => console.error("Failed to fetch emergency incidents", err));
  }, []);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8084/emergency/incidents/${id}`)
      .then(() => setIncidents(incidents.filter(incident => incident.id !== id)))
      .catch(err => console.error("Delete failed", err));
  };

  return (
    <div className="mt-4">
  console.log("onedit is:", onEdit);
      <h4>🚨 Emergency Incidents</h4>
      <ul className="list-group">
        {incidents.map(incident => (
          <li key={incident.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{incident.type}</strong> in {incident.city} at {new Date(incident.timestamp).toLocaleString()}
              <br />
              {incident.description} | Severity: {incident.severity} | Status: {incident.status}
            </div>
            <div>
              <button className="btn btn-sm btn-warning me-2" onClick={() => onEdit(incident)}>Edit</button>
              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(incident.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EmergencyIncidentList;
