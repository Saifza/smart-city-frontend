// src/components/WasteIncidentForm.js
import React, { useState } from 'react';
import axios from 'axios';

function WasteIncidentForm({ onIncidentAdded }) {
  const [formData, setFormData] = useState({
    type: '',
    status: '',
    city: '',
    description: '',
    latitude: '',
    longitude: ''
  });

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

    axios.post('http://localhost:8082/waste/incidents', payload)
      .then(() => {
        setFormData({
          type: '',
          status: '',
          city: '',
          description: '',
          latitude: '',
          longitude: ''
        });
        if (onIncidentAdded) onIncidentAdded();
      })
      .catch(err => {
        console.error('🧹 Failed to submit incident:', err);
      });
  };

  return (
    <div className="container mt-4 mb-5 p-4 border rounded bg-light shadow-sm">
          <h5>Form Loaded</h5>

      <h4 className="mb-3">➕ Report Waste Incident</h4>
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
       {/*   <div className="col">
            <label className="form-label">Latitude</label>
            <input type="number" step="any" className="form-control" name="latitude" value={formData.latitude} onChange={handleChange} required />
          </div>
          <div className="col">
            <label className="form-label">Longitude</label>
            <input type="number" step="any" className="form-control" name="longitude" value={formData.longitude} onChange={handleChange} required />
          </div> */}
          
        </div>

        <button type="submit" className="btn btn-success">Submit Incident</button>
      </form>
    </div>
  );
}

export default WasteIncidentForm;
