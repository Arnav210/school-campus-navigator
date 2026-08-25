import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Polyline } from 'react-leaflet';
import { dnhsRoutingGrid, dnhsPaths } from '../campusData';
import { classroomLookup } from '../roomDatabase';
import 'leaflet/dist/leaflet.css';
import '../styles/MapPage.css'; // Professional CSS Style Architecture Import Link Pass

function calculateDistance(coord1, coord2) {
  const lat1 = coord1[0];
  const lon1 = coord1[1];
  const lat2 = coord2[0];
  const lon2 = coord2[1];
  const R = 6371000; // Earth footprint radius in meters
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
    <div className="navigator-container">
      
      {/* Del Norte Corporate Varsity Header Box */}
      <div className="brand-header-card">
        <h3>Del Norte Navigator</h3>
        <p>Type your classroom target endpoints or leave the first field completely blank to route straight from your live footprints.</p>
      </div>

      {/* Forest Green Map Canvas Border Layer Viewport */}
      <div className="map-viewport-frame">
        <MapContainer ref={mapRef} center={dnhsCenter} zoom={18} minZoom={17} maxZoom={18} maxBounds={dnhsMaxBounds} style={{ height: '100%', width: '100%' }}>
          <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {gpsCoords && (
            <CircleMarker center={gpsCoords} radius={5} pathOptions={{ color: '#fff', fillColor: '#ffc72c', fillOpacity: 1.0, weight: 2 }} />
          )}

          {activeRoute && (
            <Polyline positions={activeRoute} pathOptions={{ color: '#0070f3', weight: 6, opacity: 0.95, lineCap: 'round', interactive: false }} />
          )}

          {activeRoute && routeStartPos && (
            <CircleMarker center={routeStartPos} radius={7} pathOptions={{ color: '#fff', fillColor: '#0070f3', fillOpacity: 1.0, weight: 2.5 }} />
          )}
          {activeRoute && routeEndPos && (
            <CircleMarker center={routeEndPos} radius={7} pathOptions={{ color: '#fff', fillColor: '#438046', fillOpacity: 1.0, weight: 2.5 }} />
          )}
        </MapContainer>
      </div>

      {/* Lighter Dark Blue Control Panel Card Container Box */}
      <form onSubmit={handleFormSubmit} className="control-dashboard-box">
        <h4>Search Dashboard</h4>
        
        {/* Starting Input Field Box */}
        <div className="input-field-group">
          <label>
            Starting Classroom <span>(Optional - Leave blank for Current Location)</span>
          </label>
          <input 
            type="text"
            placeholder="Type room number or leave blank..."
            value={startInput}
            onFocus={() => { setStartInput(''); setShowStartBox(true); }}
            onChange={(e) => setStartInput(e.target.value)}
            onBlur={() => setTimeout(() => setShowStartBox(false), 250)}
            className="navigator-text-input"
          />
          {showStartBox && (
            <div className="autocomplete-overlay-dropdown">
              {getFilteredOptions(startInput).map(name => (
                <div key={name} onMouseDown={() => { setStartInput(name); setShowStartBox(false); }} className="dropdown-item-row">{name}</div>
              ))}
            </div>
          )}
        </div>

        {/* Target Destination Input Field Box */}
        <div className="input-field-group">
          <label>Target Classroom Destination</label>
          <input 
            type="text"
            placeholder="Type target destination (e.g. b125)..."
            value={endInput}
            onFocus={() => { setEndInput(''); setShowEndBox(true); }}
            onChange={(e) => setEndInput(e.target.value)}
            onBlur={() => setTimeout(() => setShowEndBox(false), 250)}
            className="navigator-text-input"
          />
          {showEndBox && (
            <div className="autocomplete-overlay-dropdown">
              {getFilteredOptions(endInput).map(name => (
                <div key={name} onMouseDown={() => { setEndInput(name); setShowEndBox(false); }} className="dropdown-item-row">{name}</div>
              ))}
            </div>
          )}
        </div>

        {/* Forest Green Route Actions Activation Button */}
        <button type="submit" disabled={!endInput} className="compute-route-button">
          Find Campus Route
        </button>
      </form>

    </div>
  );
}
