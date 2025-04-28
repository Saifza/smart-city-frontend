import React, { useState, useEffect } from 'react';

function TrafficForm({ onSubmit, isEditing, initialData, cancelEdit }) {
  const [formData, setFormData] = useState({
    location: { latitude: '', longitude: '' },
    severity: '',
    description: '',
    city: ''
  });

  useEffect(() => {
    if (isEditing && initialData) {
      const normalized = {
        location: {
          latitude: initialData.location?.latitude ?? initialData.latitude ?? '',
          longitude: initialData.location?.longitude ?? initialData.longitude ?? ''
        },
        severity: initialData.severity ?? '',
        description: initialData.description ?? '',
        city: initialData.city ?? ''
      };
      console.log("Populating form for edit:", initialData);
      setFormData(normalized);
    }
  }, [isEditing, initialData]);

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
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      location: {
        latitude: parseFloat(formData.location.latitude),
        longitude: parseFloat(formData.location.longitude)
      },
      severity: formData.severity,
      description: formData.description,
      city: formData.city,
      timestamp: isEditing && initialData?.timestamp
        ? initialData.timestamp
        : new Date().toISOString()
    };

    console.log("Submitting:", payload);
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="row">
        <div className="col">
          <label>Latitude</label>
          <input
            type="number"
            name="latitude"
            className="form-control"
            value={formData.location.latitude}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col">
          <label>Longitude</label>
          <input
            type="number"
            name="longitude"
            className="form-control"
            value={formData.location.longitude}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col">
          <label>Severity</label>
          <select
            name="severity"
            className="form-control"
            value={formData.severity}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
        <div className="col">
          <label>City</label>
          <select
            name="city"
            className="form-control"
            value={formData.city}
            onChange={handleChange}
            required
          >
            <option value="">Select City</option>
            <option value="Madison, WI">Madison, WI</option>
            <option value="Boulder, CO">Boulder, CO</option>
            <option value="Charlottesville, VA">Charlottesville, VA</option>
            <option value="Los Angeles, CA">Los Angeles, CA</option>
            <option value="New York, NY">New York, NY</option>

          </select>
        </div>
        <div className="col">
          <label>Description</label>
          <input
            type="text"
            name="description"
            className="form-control"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="mt-3 d-flex gap-2">
        <button type="submit" className="btn btn-primary">
          {isEditing ? 'Update Incident' : 'Add Incident'}
        </button>
        {isEditing && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={cancelEdit}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default TrafficForm;
