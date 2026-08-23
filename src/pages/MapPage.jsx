import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { dnhsRoutingGrid, dnhsPaths } from '../campusData';
import { classroomLookup } from '../roomDatabase';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const createModernMapPin = () => {
  const sizeArr = '24,34'.split(',').map(Number);
  const anchorArr = '12,34'.split(',').map(Number);
  return L.divIcon({
    html: '<svg width="24" height="34" viewBox="0 0 24 34" fill="none" xmlns="http://w3.org"><path d="M12 0C5.37 0 0 5.37 0 12C0 21 12 34 12 34C12 34 24 21 24 12C24 5.37 18.63 0 12 0Z" fill="#0070f3"/><circle cx="12" cy="12" r="4" fill="white"/></svg>',
    className: 'dnhs-vector-pin',
    iconSize: sizeArr,
    iconAnchor: anchorArr,
    popupAnchor: [0, -30]
  });
};

function calculateDistance(coord1, coord2) {
  const lat1 = coord1[0];
  const lon1 = coord1[1];
  const lat2 = coord2[0];
  const lon2 = coord2[1];
  const R = 6371000; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function findShortestPath(startRoom, endRoom) {
  const masterGraph = Object.assign({}, dnhsRoutingGrid, classroomLookup);
  const distances = {};
  const previous = {};
  let queue = [];

  // Initialize weights for all coordinates across both datasets
  Object.keys(masterGraph).forEach((id) => {
    distances[id] = id === startRoom ? 0 : Infinity;
    queue.push({ id: id, dist: distances[id] });
    previous[id] = null;
  });

  while (queue.length > 0) {
    queue.sort((a, b) => a.dist - b.dist);
    const current = queue.shift();
    const u = current.id;

    if (u === endRoom) {
      const pathCoords = [];
      let temp = endRoom;
      while (temp !== null) {
        pathCoords.unshift(masterGraph[temp]);
        temp = previous[temp];
      }
      return pathCoords;
    }

    if (distances[u] === Infinity) break;

    const neighbors = dnhsPaths[u] || [];
    neighbors.forEach((neighborId) => {
      // 🛠️ CRUCIAL ROUTING CONSTRAINT FILTER
      // Skip this neighbor if it is a classroom node, UNLESS it is the target destination room
      const isNeighborAClassroom = classroomLookup.hasOwnProperty(neighborId);
      if (isNeighborAClassroom && neighborId !== endRoom) {
        return; 
      }

      const alt = distances[u] + calculateDistance(masterGraph[u], masterGraph[neighborId]);
      if (alt < distances[neighborId]) {
        distances[neighborId] = alt;
        previous[neighborId] = u;
        queue = queue.map((q) => q.id === neighborId ? Object.assign({}, q, { dist: alt }) : q);
      }
    });
  }
  return null;
}

export default function MapPage() {
  const dnhsCenter = [33.01447, -117.12146];
  const dnhsMaxBounds = [[33.0175, -117.1255], [33.0115, -117.1175]];
  const mapRef = useRef(null);

  const [startRoomInput, setStartRoomInput] = useState('');
  const [endRoomInput, setEndRoomInput] = useState('');
  const [activeRoutePath, setActiveRoutePath] = useState(null);

  const handleGenerateRoute = (e) => {
    e.preventDefault();
    if (classroomLookup[startRoomInput] && classroomLookup[endRoomInput]) {
      const computedPathPoints = findShortestPath(startRoomInput, endRoomInput);
      setActiveRoutePath(computedPathPoints);
    } else {
      alert("Please select valid classrooms from the lists.");
    }
  };

  return (
    <div style={{ padding: '20px', boxSizing: 'border-box', width: '100%', minHeight: '100vh', fontFamily: 'sans-serif', backgroundColor: '#f8f9fa' }}>
      
      <div style={{ background: '#343a40', color: 'white', padding: '12px', borderRadius: '8px', marginBottom: '15px' }}>
        <h3 style={{ margin: '0 0 4px 0', fontSize: '15px' }}>🧭 Del Norte Navigator: Production Routing Engine</h3>
        <p style={{ margin: 0, fontSize: '12px', color: '#bbb' }}>Type your room numbers or select options to map out your classroom-to-classroom sidewalk routes instantly.</p>
      </div>

      <div style={{ width: '100%', height: '55vh', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: '1px solid #ddd', marginBottom: '15px' }}>
        <MapContainer ref={mapRef} center={dnhsCenter} zoom={18} minZoom={17} maxZoom={18} maxBounds={dnhsMaxBounds} style={{ height: '100%', width: '100%' }}>
          <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {startRoomInput && classroomLookup[startRoomInput] && (
            <Marker position={classroomLookup[startRoomInput]} icon={createModernMapPin()}><Popup><strong>Start: {startRoomInput}</strong></Popup></Marker>
          )}
          {endRoomInput && classroomLookup[endRoomInput] && (
            <Marker position={classroomLookup[endRoomInput]} icon={createModernMapPin()}><Popup><strong>End: {endRoomInput}</strong></Popup></Marker>
          )}

          {activeRoutePath && (
            <Polyline positions={activeRoutePath} pathOptions={{ color: '#0070f3', weight: 6, opacity: 0.9, lineCap: 'round' }} />
          )}
        </MapContainer>
      </div>

      <form onSubmit={handleGenerateRoute} style={{ backgroundColor: 'white', padding: '15px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #eee', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h4 style={{ margin: '0', color: '#0070f3' }}>🧭 Searchable Classroom Router</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          
          <div style={{ flex: '1', minWidth: '150px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#555' }}>Starting Classroom</label>
            <input list="startRoomsList" placeholder="Type room (e.g. S101)..." value={startRoomInput} onChange={(e) => setStartRoomInput(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '13px' }} />
            <datalist id="startRoomsList">{Object.keys(classroomLookup).map(k => <option key={k} value={k} />)}</datalist>
          </div>

          <div style={{ flex: '1', minWidth: '150px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#555' }}>Target Destination</label>
            <input list="endRoomsList" placeholder="Type room (e.g. B125)..." value={endRoomInput} onChange={(e) => setEndRoomInput(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '13px' }} />
            <datalist id="endRoomsList">{Object.keys(classroomLookup).map(k => <option key={k} value={k} />)}</datalist>
          </div>

        </div>
        <button type="submit" disabled={!startRoomInput || !endRoomInput} style={{ padding: '12px', backgroundColor: (!startRoomInput || !endRoomInput) ? '#ccc' : '#0070f3', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>Compute Optimized Campus Route</button>
      </form>

    </div>
  );
}
