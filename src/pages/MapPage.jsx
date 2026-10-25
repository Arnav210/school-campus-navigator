import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Polyline, useMapEvents } from 'react-leaflet';
import { dnhsRoutingGrid, dnhsPaths } from '../campusData';
import { classroomLookup } from '../roomDatabase';
import 'leaflet/dist/leaflet.css';
import '../styles/MapPage.css';
import { calculateDistance, findShortestPath, smoothRoute } from '../routing.js';

function MapFollowControl({ onPause }) {
  useMapEvents({ dragstart: onPause });
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
  const [routeRequest, setRouteRequest] = useState(null);

  /* Dropdown panel visibility states for mobile compatibility */
  const [showStartBox, setShowStartBox] = useState(false);
  const [showEndBox, setShowEndBox] = useState(false);
  const [gpsCoords, setGpsCoords] = useState(null);
  const [gpsAccuracy, setGpsAccuracy] = useState(Infinity);
  const [followPosition, setFollowPosition] = useState(false);

  // GPS routes recalculate as the watch reports movement; room-to-room routes stay fixed.
  const liveGpsRoute = routeRequest?.start === 'USER_GPS_START';
  const activeRoute = useMemo(() => {
    if (!routeRequest) return null;
    return findShortestPath(routeRequest.start, routeRequest.end, gpsCoords);
  }, [routeRequest, gpsCoords]);
  const displayedRoute = useMemo(() => smoothRoute(activeRoute), [activeRoute]);
  const routeStartPos = activeRoute?.[0];
  const routeEndPos = activeRoute?.[activeRoute.length - 1];
  const routeDistance = activeRoute?.reduce((total, point, index) => (
    index ? total + calculateDistance(activeRoute[index - 1], point) : total
  ), 0) ?? 0;
  // Arrival uses actual GPS proximity, not the snapped walkway position.
  const hasArrived = Boolean(liveGpsRoute && gpsCoords && routeEndPos
    && gpsAccuracy <= 20 && calculateDistance(gpsCoords, routeEndPos) <= 10);
  const walkingMinutes = Math.max(1, Math.ceil(routeDistance / (1.4 * 60)));
  const distanceLabel = routeDistance < 1000
    ? `${Math.round(routeDistance)} m`
    : `${(routeDistance / 1000).toFixed(1)} km`;

  useEffect(() => {
    if (followPosition && gpsCoords) {
      mapRef.current?.panTo(gpsCoords, { animate: true, duration: 0.5 });
    }
  }, [followPosition, gpsCoords]);

  const handleRecenter = () => {
    if (!gpsCoords) return;
    setFollowPosition(true);
    mapRef.current?.panTo(gpsCoords, { animate: true, duration: 0.5 });
  };

  /* Developer toggle state controlling visibility of the background grid network mesh */
  const [showDevNetwork, setShowDevNetwork] = useState(false);

  /* Set up native hardware location watch listener upon component mount */
  useEffect(function() {
    if (!navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(
      function(pos) {
        setGpsCoords([pos.coords.latitude, pos.coords.longitude]);
        setGpsAccuracy(pos.coords.accuracy);
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

    let finalStartKey;
    const isStartFieldEmpty = startInput.trim() === '';

    /* Route dynamically from GPS if start input field is left completely blank */
    if (isStartFieldEmpty) {
      if (!gpsCoords) {
        alert('Waiting for your location. Please enable location access, or choose a starting room.');
        return;
      }
      finalStartKey = 'USER_GPS_START';
    } else {
      const cleanStartInput = startInput.trim().toUpperCase();
      finalStartKey = Object.keys(classroomLookup).find(function(k) {
        return k.toUpperCase() === cleanStartInput;
      });
    }

    /* Execute graph path search if valid target elements are found */
    if (finalStartKey && finalEndKey) {
      const calculatedPoints = findShortestPath(finalStartKey, finalEndKey, gpsCoords);
      if (!calculatedPoints) {
        alert(finalStartKey === 'USER_GPS_START'
          ? 'GPS walking routes are available near campus only. Choose a starting room to preview a campus route from home.'
          : 'No walking route was found. Please try another starting room.');
        return;
      }
      setRouteRequest({ start: finalStartKey, end: finalEndKey });
      setFollowPosition(finalStartKey === 'USER_GPS_START');
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
          <MapFollowControl onPause={() => setFollowPosition(false)} />
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
                {Object.hasOwn(dnhsRoutingGrid, nodeId) && (
                  <CircleMarker center={posA} radius={4} pathOptions={{ color: '#28a745', fillColor: '#28a745', fillOpacity: 0.3, weight: 1, interactive: false }} />
                )}

                {/* Paint interior classroom doorstep coordinates as blue circle rings */}
                {Object.hasOwn(classroomLookup, nodeId) && (
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
            <Polyline positions={displayedRoute} smoothFactor={0} pathOptions={{ color: '#0070f3', weight: 6, opacity: 0.9, lineCap: 'round', interactive: false }} />
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

      <div className="location-controls-row">
        <span>{!gpsCoords ? 'Waiting for location' : followPosition ? 'Following your location' : 'Map following paused'}</span>
        <button type="button" className="recenter-button" disabled={!gpsCoords} onClick={handleRecenter}>
          Recenter
        </button>
      </div>

      {liveGpsRoute && !activeRoute && (
        <div className="route-summary-card" role="status">
          <p>GPS routing is paused. Your location is too far from the mapped campus walkways.</p>
          <p className="route-summary-note">Return near campus, or choose a starting room to preview a route.</p>
        </div>
      )}

      {activeRoute && (
        <div className={`route-summary-card${hasArrived ? ' route-summary-arrived' : ''}`}>
          <p className="route-summary-destination">To {routeRequest.end}</p>
          <p className="route-summary-metrics">
            {hasArrived ? 'You have arrived!' : routeDistance < 1 ? 'Start and destination are the same location' : `${distanceLabel}${liveGpsRoute ? ' remaining' : ' total'} · About ${walkingMinutes} min walking`}
          </p>
          <p className="route-summary-note" role="status">
            {hasArrived
              ? `You’re near ${routeRequest.end}. Check the room sign to confirm.`
              : liveGpsRoute ? 'Updates as you move. Arrival is detected near your destination.' : 'Route preview. Leave the starting room blank to navigate from your location.'}
          </p>
        </div>
      )}

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
