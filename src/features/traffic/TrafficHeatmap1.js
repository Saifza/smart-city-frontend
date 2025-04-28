import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, HeatmapLayer } from '@react-google-maps/api';
import SimulationToggle from './SimulationToggle';
import axios from 'axios';

const cityConfigs = {
  'Kansas City': { lat: 39.0997, lng: -94.5786, zoom: 13 },
  'Madison': { lat: 43.0731, lng: -89.4012, zoom: 13 },
  'Boulder': { lat: 40.0150, lng: -105.2705, zoom: 13 },
  'Charlottesville': { lat: 38.0293, lng: -78.4767, zoom: 13 }
};

const containerStyle = {
  width: '100%',
  height: '500px'
};

const severityToWeight = (severity) => {
  switch (severity) {
    case 'LOW': return 1;
    case 'MEDIUM': return 3;
    case 'HIGH': return 5;
    default: return 2;
  }
};

function TrafficHeatmap() {
  const [heatmapData, setHeatmapData] = useState([]);
  const [selectedCity, setSelectedCity] = useState('Kansas City');

  useEffect(() => {
    const fetchHeatmapData = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/traffic/incidents/city/${selectedCity}`);
        const data = response.data.map(point => ({
          location: new window.google.maps.LatLng(
            point.location.latitude,
            point.location.longitude
          ),
          weight: severityToWeight(point.severity)
        }));
        setHeatmapData(data);
      } catch (error) {
        console.error('🔥 Failed to fetch heatmap data', error);
      }
    };

    fetchHeatmapData();
  }, [selectedCity]);

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  const mapCenter = cityConfigs[selectedCity];

  return (
    <div className="container mt-4">
      <h2>🗺️ Traffic Heatmap - {selectedCity}</h2>

      <div className="mb-3">
        <label>Select City:</label>
        <select className="form-control w-50" value={selectedCity} onChange={handleCityChange}>
          {Object.keys(cityConfigs).map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      <LoadScript
        googleMapsApiKey="AIzaSyA3vhXoveNBu2Xuw3QYkrmes2CPOEI2-cQ"
        libraries={['visualization']}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={mapCenter.zoom}
        >
          {heatmapData.length > 0 && (
            <HeatmapLayer
              data={heatmapData}
              options={{
                radius: 40,
                opacity: 0.7
              }}
            />
          )}
        </GoogleMap>
      </LoadScript>

      <SimulationToggle />
    </div>
  );
}

export default TrafficHeatmap;
