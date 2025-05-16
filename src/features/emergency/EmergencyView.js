// src/features/emergency/EmergencyView.js
import React, { useState } from 'react';
import EmergencyIncidentForm from './EmergencyIncidentForm';
import EmergencyIncidentList from './EmergencyIncidentList';

function EmergencyView() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingIncident, setEditingIncident] = useState(null);

  const triggerRefresh = () => {
    setRefreshKey(prev => prev + 1);
    setEditingIncident(null);
  };

  return (
    <div className="container mt-4">
      <h2>🚨 Emergency Management</h2>
      <EmergencyIncidentForm
        onIncidentSaved={triggerRefresh}
        editingIncident={editingIncident}
        cancelEdit={() => setEditingIncident(null)}
      />
      <EmergencyIncidentList
        key={refreshKey}
        onEdit={setEditingIncident}
      />
    </div>
  );
}

export default EmergencyView;
