import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GoogleMap, LoadScript, HeatmapLayer } from '@react-google-maps/api';

const center = { lat: 39.0997, lng: -94.5786 }; // Kansas City, MO

const containerStyle = {
  width: '100%',
  height: '500px'
};

function TrafficHeatmap() {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [heatmapData, setHeatmapData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8081/traffic/incidents/heatmap')
      .then(response => {
       const points = response.data.map(p => ({
  location: new window.google.maps.LatLng(p.lat, p.lng),
  weight: p.intensity || 1
}));
        setHeatmapData(points);
      })
      .catch(err => {
        console.error('🔥 Failed to load heatmap data:', err);
      });
  }, []);

  return (
    <div className="container mt-4">
      <h2>🗺️ Traffic Heatmap - Kansas City, MO</h2>
      <LoadScript
        googleMapsApiKey="AIzaSyA3vhXoveNBu2Xuw3QYkrmes2CPOEI2-cQ"
        libraries={['visualization']}
        onLoad={() => setMapLoaded(true)}
      >
        {mapLoaded && window.google && (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={15}
          >
            {heatmapData.length > 0 && (
             <HeatmapLayer
  		data={heatmapData}
  		options={{
   		radius: 40,       // reduce to 30 for tighter blobs
    		opacity: 0.8,     // Increase for more vivid display
   		dissipating: true // Keeps the glow radius consistent across zoom levels
  }}
/>
            )}
          </GoogleMap>
        )}
      </LoadScript>
    </div>
  );
}

export default TrafficHeatmap;
