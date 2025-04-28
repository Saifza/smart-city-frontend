export const handleWebSocketIncident = (incident, setIncidents, setFilteredIncidents, showToast) => {
  setIncidents(prev => {
    const exists = prev.some(i => i.id === incident.id);
    return exists
      ? prev.map(i => i.id === incident.id ? incident : i)
      : [...prev, incident];
  });

  setFilteredIncidents(prev => {
    const exists = prev.some(i => i.id === incident.id);
    return exists
      ? prev.map(i => i.id === incident.id ? incident : i)
      : [...prev, incident];
  });

  // 🔍 TEMP DEBUG
  console.log("🔔 WebSocket received:", incident);
const emoji = {
  LOW: '🟢',
  MEDIUM: '🟠',
  HIGH: '🔴'
};

  const message = incident.description
  ? `${emoji[incident.severity] || '⚠️'} ${incident.severity}: ${incident.description}`
  : `📡 Incident ${incident.id} updated`;

    
 if (showToast) showToast(message, incident.severity);
};


export const handleWebSocketDelete = (deletedId, setIncidents, setFilteredIncidents, showToast) => {
  setIncidents(prev => prev.filter(i => i.id !== deletedId));
  setFilteredIncidents(prev => prev.filter(i => i.id !== deletedId));
  if (showToast) showToast(`🗑️ Incident ${deletedId} deleted`);
};


