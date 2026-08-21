import React, { useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { dnhsRoutingGrid } from '../campusData';
import 'leaflet/dist/leaflet.css';

function MapPage() {
  const dnhsCenter = [33.01447, -117.12146];
  const dnhsMaxBounds = [[33.0175, -117.1255], [33.0115, -117.1175]];
  const mapRef = useRef(null);

  return (
    <div style={{ padding: '20px', boxSizing: 'border-box', width: '100%', minHeight: '100vh', fontFamily: 'sans-serif', backgroundColor: '#f8f9fa' }}>
      
      {/* Structural Workspace Header */}
      <div style={{ background: '#343a40', color: 'white', padding: '12px', borderRadius: '8px', marginBottom: '15px', boxShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>
        <h3 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>🛠️ Sidewalk Routing Network Calibration Canvas</h3>
        <p style={{ margin: 0, fontSize: '12px', color: '#bbb' }}>Displaying 48 file-based graph intersection nodes natively over the campus walkway infrastructure.</p>
      </div>

      {/* Map Viewport Container */}
      <div style={{ width: '100%', height: '75vh', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: '1px solid #ddd' }}>
        <MapContainer 
          ref={mapRef} 
          center={dnhsCenter} 
          zoom={18} 
          minZoom={17} 
          maxZoom={18} 
          maxBounds={dnhsMaxBounds} 
          maxBoundsViscosity={1.0} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Render all 48 calibrated intersection grid dots natively right from your data file variable */}
          {Object.keys(dnhsRoutingGrid).map((nodeId) => (
            <CircleMarker
              key={nodeId}
              center={dnhsRoutingGrid[nodeId]}
              radius={6}
              pathOptions={{ color: '#28a745', fillColor: '#28a745', fillOpacity: 0.85, weight: 2 }}
            >
              <Popup>
                <div style={{ fontSize: '12px', fontFamily: 'monospace', textAlign: 'center' }}>
                  <strong>ID:</strong> {nodeId}
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

    </div>
  );
}

export default MapPage;
