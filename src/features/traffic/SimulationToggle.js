import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SimulationToggle() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8081/traffic/simulation/status')
      .then(res => setEnabled(res.data))
      .catch(err => console.error("❌ Failed to get status", err));
  }, []);

  const toggleSimulation = async () => {
    try {
      const endpoint = enabled ? '/off' : '/on';
      await axios.post(`http://localhost:8081/traffic/simulation${endpoint}`);
      setEnabled(!enabled);
    } catch (err) {
      console.error("❌ Failed to toggle simulation", err);
    }
  };

  return (
    <div className="my-3">
      <button className={`btn ${enabled ? 'btn-danger' : 'btn-success'}`} onClick={toggleSimulation}>
        {enabled ? '🛑 Pause Simulation' : '▶️ Resume Simulation'}
      </button>
    </div>
  );
}

export default SimulationToggle;
