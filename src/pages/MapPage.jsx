import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Polyline } from 'react-leaflet';
import { dnhsRoutingGrid, dnhsPaths } from '../campusData';
import { classroomLookup } from '../roomDatabase';
import 'leaflet/dist/leaflet.css';

function calculateDistance(coord1, coord2) {
  const lat1 = coord1[0];
  const lon1 = coord1[1];
  const lat2 = coord2[0];
  const lon2 = coord2[1];
  const R = 6371000; // Radius of Earth in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function findShortestPath(startKey, endKey, gpsCoords = null) {
  const masterGraph = Object.assign({}, dnhsRoutingGrid, classroomLookup);
  const dynamicPaths = Object.assign({}, dnhsPaths);

  if (startKey === 'USER_GPS_START' && gpsCoords) {
    masterGraph['USER_GPS_START'] = gpsCoords;
    let closestNode = null;
    let shortestDist = Infinity;

    Object.keys(dnhsRoutingGrid).forEach((nodeId) => {
      const d = calculateDistance(gpsCoords, dnhsRoutingGrid[nodeId]);
      if (d < shortestDist) {
        shortestDist = d;
        closestNode = nodeId;
      }
    });

    if (closestNode) {
      dynamicPaths['USER_GPS_START'] = [closestNode];
      if (!dynamicPaths[closestNode]) dynamicPaths[closestNode] = [];
      dynamicPaths[closestNode].push('USER_GPS_START');
    }
  }

  const distances = {};
  const previous = {};
  let queue = [];

  Object.keys(masterGraph).forEach((id) => {
    distances[id] = id === startKey ? 0 : Infinity;
    queue.push({ id: id, dist: distances[id] });
    previous[id] = null;
  });

  while (queue.length > 0) {
    queue.sort((a, b) => a.dist - b.dist);
    const u = queue.shift().id;

    if (u === endKey) {
      const pathCoords = [];
      let temp = endKey;
      while (temp !== null) {
        pathCoords.unshift(masterGraph[temp]);
        temp = previous[temp];
      }
      return pathCoords;
    }

    if (distances[u] === Infinity) break;

    const neighbors = dynamicPaths[u] || [];
    neighbors.forEach((neighborId) => {
      const isNeighborClassroom = classroomLookup.hasOwnProperty(neighborId);
      if (isNeighborClassroom && neighborId !== endKey) return;

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

  const [startInput, setStartInput] = useState('');
  const [endInput, setEndInput] = useState('');
  const [activeRoute, setActiveRoute] = useState(null);

  const [showStartBox, setShowStartBox] = useState(false);
  const [showEndBox, setShowEndBox] = useState(false);
  const [gpsCoords, setGpsCoords] = useState(null);

  const [routeStartPos, setRouteStartPos] = useState(null);
  const [routeEndPos, setRouteEndPos] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setGpsCoords([pos.coords.latitude, pos.coords.longitude]);
      },
      (err) => console.error(err),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const cleanEndInput = endInput.trim().toUpperCase();
    const finalEndKey = Object.keys(classroomLookup).find(k => k.toUpperCase() === cleanEndInput);

    let finalStartKey = null;
    const isStartFieldEmpty = startInput.trim() === '';

    if (isStartFieldEmpty) {
      if (!gpsCoords) {
        alert('Calibrating hardware satellite telemetry. Please verify device location permissions are active.');
        return;
      }
      finalStartKey = 'USER_GPS_START';
      setRouteStartPos(gpsCoords);
    } else {
      const cleanStartInput = startInput.trim().toUpperCase();
      finalStartKey = Object.keys(classroomLookup).find(k => k.toUpperCase() === cleanStartInput);
      if (finalStartKey) setRouteStartPos(classroomLookup[finalStartKey]);
    }

    if (finalStartKey && finalEndKey) {
      setRouteEndPos(classroomLookup[finalEndKey]);
      const calculatedPoints = findShortestPath(finalStartKey, finalEndKey, gpsCoords);
      setActiveRoute(calculatedPoints);
    } else {
      alert('Spelling error. Please select options directly from the auto-complete dropdown panels.');
    }
  };

  const getFilteredOptions = (currentText) => {
    const allOptions = Object.keys(classroomLookup);
    if (!currentText) return allOptions;
    const cleanText = currentText.trim().toUpperCase();
    return allOptions.filter(name => name.toUpperCase().indexOf(cleanText) !== -1);
  };

  return (
    <div style={{ padding: '15px', boxSizing: 'border-box', width: '100%', minHeight: '100vh', fontFamily: 'sans-serif', backgroundColor: '#f8f9fa' }}>
      
      <div style={{ background: '#343a40', color: 'white', padding: '12px', borderRadius: '8px', marginBottom: '12px' }}>
        <h3 style={{ margin: '0 0 2px 0', fontSize: '14px' }}>🧭 Del Norte Navigator: Production Build</h3>
        <p style={{ margin: 0, fontSize: '11px', color: '#bbb' }}>Type a start room or leave it completely blank to route dynamically from your real-time position.</p>
      </div>

      <div style={{ width: '100%', height: '50vh', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: '1px solid #ddd', marginBottom: '12px' }}>
        <MapContainer ref={mapRef} center={dnhsCenter} zoom={18} minZoom={17} maxZoom={18} maxBounds={dnhsMaxBounds} style={{ height: '100%', width: '100%' }}>
          <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {gpsCoords && (
            <CircleMarker center={gpsCoords} radius={5} pathOptions={{ color: '#fff', fillColor: '#28a745', fillOpacity: 1.0, weight: 2 }} />
          )}

          {activeRoute && (
            <Polyline positions={activeRoute} pathOptions={{ color: '#0070f3', weight: 6, opacity: 0.9, lineCap: 'round', interactive: false }} />
          )}

          {activeRoute && routeStartPos && (
            <CircleMarker center={routeStartPos} radius={7} pathOptions={{ color: '#fff', fillColor: '#0070f3', fillOpacity: 1.0, weight: 2.5 }} />
          )}
          {activeRoute && routeEndPos && (
            <CircleMarker center={routeEndPos} radius={7} pathOptions={{ color: '#fff', fillColor: '#dc3545', fillOpacity: 1.0, weight: 2.5 }} />
          )}
        </MapContainer>
      </div>

      <form onSubmit={handleFormSubmit} style={{ backgroundColor: 'white', padding: '15px', borderRadius: '12px', border: '1px solid #eee', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        
        {/* Optional Starting Classroom Input */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#555' }}>
            Starting Classroom <span style={{ color: '#999', fontWeight: 'normal' }}>(Optional - Leave blank for Current Location)</span>
          </label>
          <input 
            type="text"
            placeholder="Type room number or leave blank..."
            value={startInput}
            onFocus={() => { setStartInput(''); setShowStartBox(true); }}
            onChange={(e) => setStartInput(e.target.value)}
            onBlur={() => setTimeout(() => setShowStartBox(false), 250)}
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '16px', width: '100%', boxSizing: 'border-box' }}
          />
          {showStartBox && (
            <div style={{ position: 'absolute', top: '62px', left: 0, right: 0, zIndex: 1000, maxHeight: '150px', overflowY: 'auto', backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '6px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
              {getFilteredOptions(startInput).map(name => (
                <div key={name} onMouseDown={() => { setStartInput(name); setShowStartBox(false); }} style={{ padding: '8px 12px', fontSize: '14px', cursor: 'pointer', borderBottom: '1px solid #f0f0f0' }}>{name}</div>
              ))}
            </div>
          )}
        </div>

        {/* Target Destination Classroom Input */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#555' }}>Target Classroom Destination</label>
          <input 
            type="text"
            placeholder="Type target destination (e.g. b125)..."
            value={endInput}
            onFocus={() => { setEndInput(''); setShowEndBox(true); }}
            onChange={(e) => setEndInput(e.target.value)}
            onBlur={() => setTimeout(() => setShowEndBox(false), 250)}
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '16px', width: '100%', boxSizing: 'border-box' }}
          />
          {showEndBox && (
            <div style={{ position: 'absolute', top: '62px', left: 0, right: 0, zIndex: 1000, maxHeight: '150px', overflowY: 'auto', backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '6px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
              {getFilteredOptions(endInput).map(name => (
                <div key={name} onMouseDown={() => { setEndInput(name); setShowEndBox(false); }} style={{ padding: '8px 12px', fontSize: '14px', cursor: 'pointer', borderBottom: '1px solid #f0f0f0' }}>{name}</div>
              ))}
            </div>
          )}
        </div>

        <button type="submit" disabled={!endInput} style={{ padding: '12px', backgroundColor: !endInput ? '#ccc' : '#0070f3', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>
          Compute Optimized Campus Route
        </button>
      </form>

    </div>
  );
}
