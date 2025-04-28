import React, { useEffect, useState } from 'react';
import { addEnergyUsage, updateEnergyUsage } from '../../api/energyApi';

const EnergyForm = ({ editingItem, onSuccess }) => {
  const [formData, setFormData] = useState({
    consumptionKwh: '',
    status: '',
    timestamp: '',
  });

  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (editingItem) {
      setFormData({
        consumptionKwh: editingItem.consumptionKwh,
        status: editingItem.status,
        timestamp: editingItem.timestamp,
      });
    } else {
      setFormData({ consumptionKwh: '', status: '', timestamp: '' });
    }
  }, [editingItem]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    if (formData.consumptionKwh < 0 || !formData.status || !formData.timestamp) {
      setMessage('⚠️ All fields are required and consumption must be ≥ 0.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (editingItem) {
        await updateEnergyUsage(editingItem.id, formData);
        setMessage('✅ Updated successfully!');
      } else {
        await addEnergyUsage(formData);
        setMessage('✅ Added successfully!');
      }
      setFormData({ consumptionKwh: '', status: '', timestamp: '' });
      onSuccess();
    } catch {
      setMessage('❌ Failed to submit.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <h4>{editingItem ? 'Edit Usage' : 'Add Energy Usage'}</h4>
      {message && <div className="alert alert-info py-2">{message}</div>}
      <div className="mb-2">
        <input
          className="form-control"
          type="number"
          name="consumptionKwh"
          placeholder="Consumption in kWh"
          value={formData.consumptionKwh}
          onChange={handleChange}
          required
          min="0"
        />
      </div>
      <div className="mb-2">
        <input
          className="form-control"
          name="status"
          placeholder="Status"
          value={formData.status}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-2">
        <input
          className="form-control"
          type="datetime-local"
          name="timestamp"
          value={formData.timestamp}
          onChange={handleChange}
          required
        />
      </div>
      <button className="btn btn-primary">
        {editingItem ? 'Update' : 'Add'}
      </button>
    </form>
  );
};

export default EnergyForm;
