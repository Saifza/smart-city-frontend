// src/features/emergency/EmergencyIncidentForm.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function EmergencyIncidentForm({ onIncidentSaved, editingIncident, cancelEdit }) {
  const [formData, setFormData] = useState({
    type: '',
    severity: '',
    description: '',
    city: '',
    status: '',
    timestamp: '',
    location: {
      latitude: '',
      longitude: ''
    }
  });

  useEffect(() => {
    if (editingIncident) {
      setFormData(editingIncident);
    }
  }, [editingIncident]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'latitude' || name === 'longitude') {
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [name]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      location: {
        latitude: parseFloat(formData.location.latitude),
        longitude: parseFloat(formData.location.longitude)
      }
    };

    const request = editingIncident
      ? axios.put(`http://localhost:8084/emergency/incidents/${editingIncident.id}`, payload)
      : axios.post('http://localhost:8084/emergency/incidents', payload);

    request.then(() => {
      setFormData({
        type: '',
        severity: '',
        description: '',
        city: '',
        status: '',
        timestamp: '',
        location: {
          latitude: '',
          longitude: ''
        }
      });
      onIncidentSaved();
    }).catch(err => {
      console.error('Failed to save emergency incident:', err);
    });
  };

  return (
    <div className="container mt-4 mb-4 p-4 border rounded bg-light shadow-sm">
      console.log("🟢 EmergencyIncidentForm mounted");

      <h5>{editingIncident ? "✏️ Edit Emergency Incident" : "➕ Report Emergency Incident"}</h5>
      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col">
            <label>Type</label>
            <input name="type" className="form-control" value={formData.type} onChange={handleChange} required />
          </div>
          <div className="col">
            <label>Severity</label>
            <input name="severity" className="form-control" value={formData.severity} onChange={handleChange} required />
          </div>
        </div>

        <div className="mb-3">
          <label>Description</label>
          <textarea name="description" className="form-control" value={formData.description} onChange={handleChange} required />
        </div>

        <div className="row mb-3">
          <div className="col">
            <label>City</label>
            <input name="city" className="form-control" value={formData.city} onChange={handleChange} required />
          </div>
          <div className="col">
            <label>Status</label>
            <input name="status" className="form-control" value={formData.status} onChange={handleChange} required />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col">
            <label>Latitude</label>
            <input name="latitude" className="form-control" value={formData.location.latitude} onChange={handleChange} required />
          </div>
          <div className="col">
            <label>Longitude</label>
            <input name="longitude" className="form-control" value={formData.location.longitude} onChange={handleChange} required />
          </div>
        </div>

        <div className="mb-3">
          <label>Timestamp</label>
          <input type="datetime-local" name="timestamp" className="form-control"
            value={formData.timestamp ? formData.timestamp.substring(0, 16) : ''}
            onChange={handleChange}
            required />
        </div>

        <button className="btn btn-primary me-2" type="submit">{editingIncident ? "Update" : "Submit"}</button>
        {editingIncident && <button className="btn btn-secondary" onClick={cancelEdit}>Cancel</button>}
      </form>
    </div>
  );
}

export default EmergencyIncidentForm;
