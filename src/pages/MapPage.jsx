import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Polyline } from 'react-leaflet';
import { dnhsRoutingGrid, dnhsPaths } from '../campusData';
import { classroomLookup } from '../roomDatabase';
import 'leaflet/dist/leaflet.css';
import '../styles/MapPage.css';

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
  /* Set initial center coordinates and maximum bounding borders for Del Norte High School */
  const dnhsCenter = [33.01447, -117.12146];
  const dnhsMaxBounds = [[33.0175, -117.1255], [33.0115, -117.1175]];
  const mapRef = useRef(null);

  /* Form and route tracking state hooks */
  const [startInput, setStartInput] = useState('');
  const [endInput, setEndInput] = useState('');
  const [activeRoute, setActiveRoute] = useState(null);

  /* Dropdown panel visibility states for mobile compatibility */
  const [showStartBox, setShowStartBox] = useState(false);
  const [showEndBox, setShowEndBox] = useState(false);
  const [gpsCoords, setGpsCoords] = useState(null);

  /* Terminal anchor state values for starting and ending dots */
  const [routeStartPos, setRouteStartPos] = useState(null);
  const [routeEndPos, setRouteEndPos] = useState(null);

  /* Developer toggle state controlling visibility of the background grid network mesh */
  const [showDevNetwork, setShowDevNetwork] = useState(false);

  /* Set up native hardware location watch listener upon component mount */
  useEffect(function() {
    if (!navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(
      function(pos) {
        setGpsCoords([pos.coords.latitude, pos.coords.longitude]);
      },
      function(err) { console.error(err); },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
    return function() { navigator.geolocation.clearWatch(watchId); };
  }, []);

  /* Form submission handler that processes coordinates and calculates paths */
  const handleFormSubmit = function(e) {
    e.preventDefault();

    /* Normalize target destination endpoint inputs to case-insensitive uppercase keys */
    const cleanEndInput = endInput.trim().toUpperCase();
    const finalEndKey = Object.keys(classroomLookup).find(function(k) {
      return k.toUpperCase() === cleanEndInput;
    });

    let finalStartKey = null;
    const isStartFieldEmpty = startInput.trim() === '';

    /* Route dynamically from GPS if start input field is left completely blank */
    if (isStartFieldEmpty) {
      if (!gpsCoords) {
        alert('Calibrating hardware satellite telemetry. Please verify device location permissions are active.');
        return;
      }
      finalStartKey = 'USER_GPS_START';
      setRouteStartPos(gpsCoords);
    } else {
      const cleanStartInput = startInput.trim().toUpperCase();
      finalStartKey = Object.keys(classroomLookup).find(function(k) {
        return k.toUpperCase() === cleanStartInput;
      });
      if (finalStartKey) setRouteStartPos(classroomLookup[finalStartKey]);
    }

    /* Execute graph path search if valid target elements are found */
    if (finalStartKey && finalEndKey) {
      setRouteEndPos(classroomLookup[finalEndKey]);
      const calculatedPoints = findShortestPath(finalStartKey, finalEndKey, gpsCoords);
      setActiveRoute(calculatedPoints);
    } else {
      alert('Spelling error. Please select options directly from the auto-complete dropdown panels.');
    }
  };

  /* Filter matching classroom results instantly from the user text buffer inputs */
  const getFilteredOptions = function(currentText) {
    const allOptions = Object.keys(classroomLookup);
    if (!currentText) return allOptions;
    const cleanText = currentText.trim().toUpperCase();
    return allOptions.filter(function(name) {
      return name.toUpperCase().indexOf(cleanText) !== -1;
    });
  };

  return (
    <div className="navigator-container">
      
      {/* Brand Header Banner Component Box */}
      <div className="brand-header-card">
        <h3>Del Norte Navigator</h3>
        <p>Choose a start room or leave it blank to use your real-time position.</p>
      </div>

      {/* Map Element Interactive Viewport Frame Area */}
      <div className="map-viewport-frame">
        <MapContainer ref={mapRef} center={dnhsCenter} zoom={18} minZoom={17} maxZoom={18} maxBounds={dnhsMaxBounds} style={{ height: '100%', width: '100%' }}>
          <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* Layer Stacking Order Rule 1: Developer network elements render first in background */}
          {showDevNetwork && Object.keys(dnhsPaths).map(function(nodeId) {
            const registry = Object.assign({}, dnhsRoutingGrid, classroomLookup);
            const posA = registry[nodeId];
            if (!posA) return null;

            return (
              <React.Fragment key={nodeId}>
                {/* Paint translucent connection path tracking wire lines */}
                {(dnhsPaths[nodeId] || []).map(function(neighborId) {
                  const posB = registry[neighborId];
                  if (!posB || nodeId > neighborId) return null; 
                  return <Polyline key={nodeId + '-' + neighborId} positions={[posA, posB]} pathOptions={{ color: '#0070f3', weight: 1.5, opacity: 0.4, interactive: false }} />;
                })}
                
                {/* Paint background sidewalk junctions as green circle rings */}
                {dnhsRoutingGrid.hasOwnProperty(nodeId) && (
                  <CircleMarker center={posA} radius={4} pathOptions={{ color: '#28a745', fillColor: '#28a745', fillOpacity: 0.3, weight: 1, interactive: false }} />
                )}

                {/* Paint interior classroom doorstep coordinates as blue circle rings */}
                {classroomLookup.hasOwnProperty(nodeId) && (
                  <CircleMarker center={posA} radius={4} pathOptions={{ color: '#0070f3', fillColor: '#0070f3', fillOpacity: 0.3, weight: 1, interactive: false }} />
                )}
              </React.Fragment>
            );
          })}

          {/* Layer Stacking Order Rule 2: Active user beacons and paths paint last to stay cleanly on top */}
          {gpsCoords && (
            <CircleMarker center={gpsCoords} radius={5} pathOptions={{ color: '#fff', fillColor: '#28a745', fillOpacity: 1.0, weight: 2 }} />
          )}

          {activeRoute && (
            <Polyline positions={activeRoute} pathOptions={{ color: '#0070f3', weight: 6, opacity: 0.9, lineCap: 'round', interactive: false }} />
          )}

          {/* Dynamic high-contrast waypoint terminal markers wrapping route ends */}
          {activeRoute && routeStartPos && (
            <CircleMarker center={routeStartPos} radius={7} pathOptions={{ color: '#fff', fillColor: '#0070f3', fillOpacity: 1.0, weight: 2.5 }} />
          )}
          {activeRoute && routeEndPos && (
            <CircleMarker center={routeEndPos} radius={7} pathOptions={{ color: '#fff', fillColor: '#1e4620', fillOpacity: 1.0, weight: 2.5 }} />
          )}
        </MapContainer>
      </div>

      {/* Control Input Selector Dashboard Form Capsule Container */}
      <form onSubmit={handleFormSubmit} className="control-dashboard-box">
        <h4>Search Dashboard</h4>
        
        {/* Optional Starting Classroom Input Element */}
        <div className="input-field-group">
          <label>
            Starting Classroom <span>(Optional - Leave blank for Current Location)</span>
          </label>
          <input 
            type="text"
            placeholder="Type room number or leave blank..."
            value={startInput}
            onFocus={function() { setStartInput(''); setShowStartBox(true); }}
            onChange={function(e) { setStartInput(e.target.value); }}
            onBlur={function() { setTimeout(function() { setShowStartBox(false); }, 250); }}
            className="navigator-text-input"
          />
          {showStartBox && (
            <div className="autocomplete-overlay-dropdown">
              {getFilteredOptions(startInput).map(function(name) {
                return <div key={name} onMouseDown={function() { setStartInput(name); setShowStartBox(false); }} className="dropdown-item-row">{name}</div>;
              })}
            </div>
          )}
        </div>

        {/* Target Destination Classroom Input Element */}
        <div style={{ position: 'relative' }} className="input-field-group">
          <label>Target Classroom Destination</label>
          <input 
            type="text"
            placeholder="Type target destination (e.g. b125)..."
            value={endInput}
            onFocus={function() { setEndInput(''); setShowEndBox(true); }}
            onChange={function(e) { setEndInput(e.target.value); }}
            onBlur={function() { setTimeout(function() { setShowEndBox(false); }, 250); }}
            className="navigator-text-input"
          />
          {showEndBox && (
            <div className="autocomplete-overlay-dropdown">
              {getFilteredOptions(endInput).map(function(name) {
                return <div key={name} onMouseDown={function() { setEndInput(name); setShowEndBox(false); }} className="dropdown-item-row">{name}</div>;
              })}
            </div>
          )}
        </div>

        {/* Interactive Checkbox Control Row triggering Developer Layer visibility */}
        <div className="toggle-panel-row">
          <span className="toggle-label-text">Show Routing Network Graph Layer</span>
          <input 
            type="checkbox" 
            checked={showDevNetwork} 
            onChange={function(e) { setShowDevNetwork(e.target.checked); }} 
            className="toggle-input-switch"
          />
        </div>

        {/* Form Execution Routing Activation Button */}
        <button type="submit" disabled={!endInput} className="compute-route-button">
          Find Route
        </button>
      </form>

    </div>
  );
}
