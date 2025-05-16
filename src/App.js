// App.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import EnergyList from './features/energy/EnergyList';
import TrafficList from './features/traffic/TrafficList';
import EmergencyView from './features/emergency/EmergencyView';

import WasteView from './features/waste/WasteView';
import TrafficHeatmap from './features/traffic/TrafficHeatmap';
import TrafficForm from './features/traffic/TrafficForm';



function App() {
  return (
    <Router>
      <div className="container mt-4">
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary rounded shadow-sm px-4 mb-4">
  <ul className="navbar-nav me-auto mb-2 mb-lg-0">
    <li className="nav-item">
       <NavLink
  to="/"
  className={({ isActive }) => 
    `nav-link fw-bold ${isActive ? 'text-warning' : 'text-white'}`
}
>
  ⚡ Energy
</NavLink>
    </li>
<li className="nav-item"> <NavLink to="/traffic"className={({ isActive }) => 
    `nav-link fw-bold ${isActive ? 'text-warning' : 'text-white'}`
}>  🚦 Traffic
</NavLink>
</li>
<li className="nav-item">
       <NavLink
  to="/emergency"
  className={({ isActive }) => 
    `nav-link fw-bold ${isActive ? 'text-warning' : 'text-white'}`
}
>
  🚨 Emergency
</NavLink>
 </li>
   <li className="nav-item">
       <NavLink
  to="/waste"
  className={({ isActive }) => 
    `nav-link fw-bold ${isActive ? 'text-warning' : 'text-white'}`
}
>
  🗑️ Waste
</NavLink>
 </li>

  </ul>
</nav>

        <Routes>
 		 <Route path="/" element={<EnergyList />} />
		  <Route path="/traffic" element={<TrafficList />} />
 		 <Route path="/traffic-heatmap" element={<TrafficHeatmap />} />
  		<Route path="/waste" element={<WasteView />} />
		<Route path="/emergency" element={<EmergencyView />} />
               
	</Routes>
      </div>
    </Router>
  );
}

export default App;
