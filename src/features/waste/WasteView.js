import React, { useState } from 'react';
import WasteIncidentList from './WasteIncidentList';
import WasteIncidentForm from './WasteIncidentForm';

function WasteView() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingIncident, setEditingIncident] = useState(null);

  const triggerRefresh = () => {
    setRefreshKey(prev => prev + 1);
    setEditingIncident(null);
  };

  return (
    <div className="container mt-4">
      <h2>🗑 Waste Management</h2>
      <WasteIncidentForm
        onIncidentSaved={triggerRefresh}
        editingIncident={editingIncident}
        cancelEdit={() => setEditingIncident(null)}
      />
      <WasteIncidentList key={refreshKey} onEdit={setEditingIncident} />
    </div>
  );
}

export default WasteView;
