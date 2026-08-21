import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { dnhsLandmarks, dnhsRoutingGrid, dnhsPaths } from '../campusData';
import { classroomLookup } from '../roomDatabase';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const createModernMapPin = () => {
  return L.divIcon({
    html: `<svg width="24" height="34" viewBox="0 0 24 34" fill="none" xmlns="http://w3.org" style="filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.3));"><path d="M12 0C5.37 0 0 5.37 0 12C0 21 12 34 12 34C12 34 24 21 24 12C24 5.37 18.63 0 12 0Z" fill="#0070f3"/><circle cx="12" cy="12" r="4" fill="white"/></svg>`,
    className: 'dnhs-vector-pin',
    iconSize: '24,34'.split(',').map(Number),
    iconAnchor: '12,34'.split(',').map(Number),
    popupAnchor: '0,-30'.split(',').map(Number)
  });
};

function calculateDistance(coord1, coord2) {
  const [lat1, lon1] = coord1;
  const [lat2, lon2] = coord2;
  const R = 6371000; 
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function findShortestPath(startNodeId, targetNodeId) {
  const distances = {};
  const previous = {};
  let queue = [];

  Object.keys(dnhsRoutingGrid).forEach((nodeId) => {
    if (nodeId === startNodeId) {
      distances[nodeId] = 0;
      queue.push({ id: nodeId, dist: 0 });
    } else {
      distances[nodeId] = Infinity;
      queue.push({ id: nodeId, dist: Infinity });
    }
    previous[nodeId] = null;
  });

  while (queue.length > 0) {
    queue.sort((a, b) => a.dist - b.dist);
    const current = queue.shift();
    const u = current.id;

    if (u === targetNodeId) {
      const pathCoordinates = [];
      let temp = targetNodeId;
      while (temp !== null) {
        pathCoordinates.unshift(dnhsRoutingGrid[temp]);
        temp = previous[temp];
      }
      return pathCoordinates;
    }

    if (distances[u] === Infinity) break;

    const neighbors = dnhsPaths[u] || [];
    neighbors.forEach((neighborId) => {
      const edgeWeight = calculateDistance(dnhsRoutingGrid[u], dnhsRoutingGrid[neighborId]);
      const alt = distances[u] + edgeWeight;
      
      if (alt < distances[neighborId]) {
        distances[neighborId] = alt;
        previous[neighborId] = u;
        queue = queue.map(q => q.id === neighborId ? { ...q, dist: alt } : q);
      }
    });
  }
  return null;
}

function MapPage() {
  const dnhsCenter = [33.01447, -117.12146];
  const dnhsMaxBounds = [[33.0175, -117.1255], [33.0115, -117.1175]];
  const mapRef = useRef(null);

  // Search input state bindings
  const [startRoomInput, setStartRoomInput] = useState('');
  const [endRoomInput, setEndRoomInput] = useState('');
  const [activeRoutePath, setActiveRoutePath] = useState(null);

  const handleGenerateRoute = (e) => {
    e.preventDefault();

    // Map the selected input text directly to its parent network node
    const startNodeId = classroomLookup[startRoomInput];
    const endNodeId = classroomLookup[endRoomInput];

    if (startNodeId && endNodeId) {
      const computedPathPoints = findShortestPath(startNodeId, endNodeId);
      setActiveRoutePath(computedPathPoints);
    } else {
      alert("Please select valid classroom options directly from the searchable lists.");
    }
  };

  return (
    <div style={{ padding: '20px', boxSizing: 'border-box', width: '100%', minHeight: '100vh', fontFamily: 'sans-serif', backgroundColor: '#f8f9fa' }}>
      
      <div style={{ background: '#343a40', color: 'white', padding: '12px', borderRadius: '8px', marginBottom: '15px' }}>
        <h3 style={{ margin: '0 0 4px 0', fontSize: '15px' }}>🧭 Del Norte Navigator: Classroom Finder</h3>
        <p style={{ margin: 0, fontSize: '12px', color: '#bbb' }}>Type your room numbers or click the arrows to filter and select your custom walking path track.</p>
      </div>

      <div style={{ width: '100%', height: '55vh', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: '1px solid #ddd', marginBottom: '15px' }}>
        <MapContainer ref={mapRef} center={dnhsCenter} zoom={18} minZoom={17} maxZoom={18} maxBounds={dnhsMaxBounds} maxBoundsViscosity={1.0} style={{ height: '100%', width: '100%' }}>
          <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {Object.keys(dnhsLandmarks).map((nodeName, index) => (
            <Marker key={index} position={dnhsLandmarks[nodeName]} icon={createModernMapPin()} draggable={false}>
              <Popup><strong>{nodeName}</strong></Popup>
            </Marker>
          ))}

          {activeRoutePath && (
            <Polyline positions={activeRoutePath} pathOptions={{ color: '#0070f3', weight: 5, opacity: 0.9, lineCap: 'round' }} />
          )}
        </MapContainer>
      </div>

      {/* Modern Searchable Input Control Form Dashboard */}
      <form onSubmit={handleGenerateRoute} style={{ backgroundColor: 'white', padding: '15px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #eee', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h4 style={{ margin: '0', color: '#0070f3' }}>🧭 Searchable Classroom Router</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          
          {/* Searchable Starting Location Input Element */}
          <div style={{ flex: '1', minWidth: '150px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#555' }}>Starting Classroom</label>
            <input 
              list="startRoomsList" 
              placeholder="Type to search room..." 
              value={startRoomInput} 
              onChange={(e) => setStartRoomInput(e.target.value)}
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '13px' }}
            />
            <datalist id="startRoomsList">
              {Object.keys(classroomLookup).map((roomName) => (
                <option key={roomName} value={roomName} />
              ))}
            </datalist>
          </div>

          {/* Searchable Destination Location Input Element */}
          <div style={{ flex: '1', minWidth: '150px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#555' }}>Target Destination</label>
            <input 
              list="endRoomsList" 
              placeholder="Type to search room..." 
              value={endRoomInput} 
              onChange={(e) => setEndRoomInput(e.target.value)}
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '13px' }}
            />
            <datalist id="endRoomsList">
              {Object.keys(classroomLookup).map((roomName) => (
                <option key={roomName} value={roomName} />
              ))}
            </datalist>
          </div>

        </div>
        
        <button type="submit" disabled={!startRoomInput || !endRoomInput} style={{ padding: '12px', backgroundColor: (!startRoomInput || !endRoomInput) ? '#ccc' : '#0070f3', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>
          Compute Smart Classroom Route
        </button>
      </form>

    </div>
  );
}

export default MapPage;
