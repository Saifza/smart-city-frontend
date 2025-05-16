// WasteIncidentForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function WasteIncidentForm({ onIncidentSaved, editingIncident, cancelEdit }) {
  const [formData, setFormData] = useState({
    id: null,
    type: '',
    status: '',
    city: '',
    description: '',
    latitude: '',
    longitude: '',
    timestamp: ''
  });

  useEffect(() => {
    if (editingIncident) {
      setFormData(editingIncident);
    }
  }, [editingIncident]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude)
    };

    const method = formData.id ? 'put' : 'post';
    const url = formData.id
      ? `http://localhost:8082/waste/incidents/${formData.id}`
      : 'http://localhost:8082/waste/incidents';

    axios[method](url, payload)
      .then(() => {
        onIncidentSaved();
        setFormData({
          id: null,
          type: '',
          status: '',
          city: '',
          description: '',
          latitude: '',
          longitude: '',
          timestamp: ''
        });
      })
      .catch(err => console.error('🧹 Failed to submit incident:', err));
  };

  return (
    <div className="container mt-4 mb-4 p-4 border rounded bg-light shadow-sm">
      <h4 className="mb-3">{formData.id ? '✏️ Edit Waste Incident' : '➕ Report Waste Incident'}</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Type</label>
          <input type="text" className="form-control" name="type" value={formData.type} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Status</label>
          <input type="text" className="form-control" name="status" value={formData.status} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">City</label>
          <input type="text" className="form-control" name="city" value={formData.city} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea className="form-control" name="description" value={formData.description} onChange={handleChange} required />
        </div>
        <div className="row mb-3">
          <div className="col">
            <label className="form-label">Latitude</label>
            <input type="number" step="any" className="form-control" name="latitude" value={formData.latitude} onChange={handleChange} required />
          </div>
          <div className="col">
            <label className="form-label">Longitude</label>
            <input type="number" step="any" className="form-control" name="longitude" value={formData.longitude} onChange={handleChange} required />
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Timestamp</label>
          <input type="datetime-local" className="form-control" name="timestamp" value={formData.timestamp} onChange={handleChange} />
        </div>

        <div className="d-flex">
          <button type="submit" className="btn btn-primary me-2">
            {formData.id ? 'Update' : 'Submit'}
          </button>
          {formData.id && (
            <button type="button" className="btn btn-secondary" onClick={cancelEdit}>Cancel</button>
          )}
        </div>
      </form>
    </div>
  );
}

export default WasteIncidentForm;
