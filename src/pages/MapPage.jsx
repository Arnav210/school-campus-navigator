import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { dnhsNodes } from '../campusData';
import 'leaflet/dist/leaflet.css';

// Fix system to re-route missing default marker asset paths inside modern Vite bundlers
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const parsedIconSize = '25,41'.split(',').map(Number);
const parsedIconAnchor = '12,41'.split(',').map(Number);

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: parsedIconSize,
  iconAnchor: parsedIconAnchor
});
L.Marker.prototype.options.icon = DefaultIcon;

function MapPage() {
  const dnhsCenter = [33.01447, -117.12146];
  const dnhsMaxBounds = [[33.0175, -117.1255], [33.0115, -117.1175]];

  // Reactive state hooks capturing dropdown room/building selections
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  
  // State tracking array holding the current path coordinates to paint on screen
  const [activeRoutePath, setActiveRoutePath] = useState(null);

  const handleGenerateRoute = (e) => {
    e.preventDefault();

    // Look up the exact coordinate pairs for both selected locations from our database file
    const startCoordinates = dnhsNodes[startLocation];
    const endCoordinates = dnhsNodes[endLocation];

    if (startCoordinates && endCoordinates) {
      // Create a clean path array directly connecting the two point nodes
      const routeLineMatrix = [startCoordinates, endCoordinates];
      
      // Update tracking state to instantly draw the straight vector path line on the map canvas
      setActiveRoutePath(routeLineMatrix);
    }
  };

  return (
    <div style={{ padding: '20px', boxSizing: 'border-box', width: '100%', minHeight: '100vh', fontFamily: 'sans-serif', backgroundColor: '#f8f9fa' }}>
      
      {/* Map Viewport Box Container */}
      <div style={{ width: '100%', height: '70vh', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: '1px solid #ddd', marginBottom: '20px' }}>
        <MapContainer 
          center={dnhsCenter} 
          zoom={18} 
          minZoom={17} 
          maxZoom={18}
          maxBounds={dnhsMaxBounds} 
          maxBoundsViscosity={1.0} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Render your permanently calibrated, hand-positioned building landmark markers */}
          {Object.keys(dnhsNodes).map((nodeName, index) => (
            <Marker key={index} position={dnhsNodes[nodeName]} draggable={false}>
              <Popup>
                <strong style={{ color: '#0070f3' }}>{nodeName}</strong><br />
                Campus routing destination.
              </Popup>
            </Marker>
          ))}

          {/* Live Path Routing Vector Line */}
          {activeRoutePath && (
            <Polyline 
              positions={activeRoutePath} 
              pathOptions={{ color: '#0070f3', weight: 5, opacity: 0.9, lineCap: 'round', dashArray: '5, 10' }} 
            />
          )}

        </MapContainer>
      </div>

      {/* Manual Route Selection Control Panel */}
      <form onSubmit={handleGenerateRoute} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', border: '1px solid #eee', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <h4 style={{ margin: '0 0 5px 0', color: '#0070f3' }}>🧭 Route Planning Interface</h4>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
          
          {/* Start Point Dropdown Menu */}
          <div style={{ flex: '1', minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>Starting Location / Building</label>
            <select value={startLocation} onChange={(e) => setStartLocation(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc', backgroundColor: 'white', fontSize: '14px' }}>
              <option value="">-- Select Start Point --</option>
              {Object.keys(dnhsNodes).map((roomName) => (
                <option key={roomName} value={roomName}>{roomName}</option>
              ))}
            </select>
          </div>

          {/* End Point Dropdown Menu */}
          <div style={{ flex: '1', minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>Target Destination / Building</label>
            <select value={endLocation} onChange={(e) => setEndLocation(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc', backgroundColor: 'white', fontSize: '14px' }}>
              <option value="">-- Select Destination --</option>
              {Object.keys(dnhsNodes).map((roomName) => (
                <option key={roomName} value={roomName}>{roomName}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Action Ingestion Trigger Button */}
        <button type="submit" disabled={!startLocation || !endLocation} style={{ padding: '12px', backgroundColor: (!startLocation || !endLocation) ? '#ccc' : '#0070f3', color: 'white', border: 'none', borderRadius: '6px', fontSize: '15px', fontWeight: 'bold', cursor: (!startLocation || !endLocation) ? 'not-allowed' : 'pointer' }}>
          Find Shortest Walking Route
        </button>
      </form>

    </div>
  );
}

export default MapPage;
