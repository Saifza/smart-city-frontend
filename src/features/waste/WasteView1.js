// src/components/WasteView.js
import React, { useState } from 'react';
import WasteIncidentList from './WasteIncidentList';
import WasteIncidentForm from './WasteIncidentForm';

function WasteView() {
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => setRefreshKey(prev => prev + 1);

  return (
    <div className="container mt-4">
      <h2>🗑 Waste Management</h2>
      <WasteIncidentForm onIncidentAdded={triggerRefresh} />
      <WasteIncidentList refreshKey={refreshKey} />
    </div>
  );
}

export default WasteView;
