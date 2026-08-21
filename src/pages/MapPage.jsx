import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function MapPage() {
  const dnhsCenter = [33.01447, -117.12146];
  const dnhsMaxBounds = [[33.0175, -117.1255], [33.0115, -117.1175]];
  const mapRef = useRef(null);

  // Stateful array tracking custom classroom asset markers
  const [classrooms, setClassrooms] = useState([]);

  // Fetch previously calibrated classrooms from browser memory disk space upon boot load
  useEffect(() => {
    const savedRooms = localStorage.getItem('dnhs_calibrated_classroom_nodes');
    if (savedRooms) {
      try {
        setClassrooms(JSON.parse(savedRooms));
      } catch (e) {
        console.error("Error reading browser memory cache ledger", e);
      }
    }
  }, []);

  const saveClassroomsToDisk = (updatedRooms) => {
    setClassrooms(updatedRooms);
    localStorage.setItem('dnhs_calibrated_classroom_nodes', JSON.stringify(updatedRooms));
  };

  // ➕ Plus Operation Handler: Spawns a classroom node at the current map view center
  const handleAddNewClassroom = () => {
    let spawnLat = 33.01447;
    let spawnLng = -117.12146;

    if (mapRef.current) {
      const currentMapCenter = mapRef.current.getCenter();
      spawnLat = currentMapCenter.lat;
      spawnLng = currentMapCenter.lng;
    }

    const uniqueId = String(Date.now().toString().slice(-4));
    const newRoom = {
      id: uniqueId,
      name: `Room_${uniqueId}`,
      lat: spawnLat,
      lng: spawnLng
    };

    const updated = [...classrooms, newRoom];
    saveClassroomsToDisk(updated);
  };

  const handleUpdatePosition = (id, newLatLng) => {
    const updated = classrooms.map(r => r.id === id ? { ...r, lat: newLatLng.lat, lng: newLatLng.lng } : r);
    saveClassroomsToDisk(updated);
  };

  const handleUpdateName = (id, newName) => {
    const updated = classrooms.map(r => r.id === id ? { ...r, name: newName } : r);
    saveClassroomsToDisk(updated);
  };

  const handleDeleteClassroom = (id) => {
    const updated = classrooms.filter(r => r.id !== id);
    saveClassroomsToDisk(updated);
  };

  const handleClearEverything = () => {
    if (window.confirm("Are you sure you want to wipe out your entire calibrated classroom database?")) {
      saveClassroomsToDisk([]);
    }
  };

  // Compiles individual classroom entries into a pristine dictionary string block
  const generateExportTextString = () => {
    if (classrooms.length === 0) return '// No custom classroom nodes mapped across your campus canvas yet.';
    
    let blockString = 'export const classroomLookup = {\n';
    classrooms.forEach((r, idx) => {
      const isLast = idx === classrooms.length - 1;
      blockString += `  "${r.name}": [${r.lat.toFixed(5)}, ${r.lng.toFixed(5)}]${isLast ? '' : ',\n'}`;
    });
    blockString += '\n};';
    return blockString;
  };

  return (
    <div style={{ padding: '20px', boxSizing: 'border-box', width: '100%', minHeight: '100vh', fontFamily: 'sans-serif', backgroundColor: '#f8f9fa' }}>
      
      {/* Structural Workspace Header */}
      <div style={{ background: '#0070f3', color: 'white', padding: '15px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', boxShadow: '0 4px 6px rgba(0,70,243,0.15)' }}>
        <div>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>🛠️ Visual Classroom Asset Mapping IDE</h3>
          <p style={{ margin: 0, fontSize: '12px', color: '#e0ecff' }}>Drop nodes at center, drag onto real classroom doorways, and assign room names natively.</p>
        </div>
        <button onClick={handleClearEverything} style={{ padding: '8px 14px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
          Wipe Database Reset
        </button>
      </div>

      {/* Map Viewport Container */}
      <div style={{ width: '100%', height: '55vh', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: '1px solid #ddd', marginBottom: '15px' }}>
        <MapContainer ref={mapRef} center={dnhsCenter} zoom={18} minZoom={17} maxZoom={18} maxBounds={dnhsMaxBounds} maxBoundsViscosity={1.0} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Render draggable classroom vector dots natively across the grid */}
          {classrooms.map((room) => (
            <CircleMarker
              key={room.id}
              center={[room.lat, room.lng]}
              radius={7}
              pathOptions={{ color: '#0070f3', fillColor: '#fff', fillOpacity: 1.0, weight: 3 }}
              draggable={true}
              eventHandlers={{
                mouseover: () => {
                  if (mapRef.current) mapRef.current.dragging.disable();
                },
                mouseout: () => {
                  if (mapRef.current) mapRef.current.dragging.enable();
                },
                mousedown: (e) => {
                  if (!mapRef.current) return;
                  const mapInstance = mapRef.current;
                  const handleMapMouseMove = (moveEvent) => {
                    handleUpdatePosition(room.id, moveEvent.latlng);
                  };
                  const handleMapMouseUp = () => {
                    mapInstance.off('mousemove', handleMapMouseMove);
                    mapInstance.off('mouseup', handleMapMouseUp);
                    mapInstance.dragging.enable();
                  };
                  mapInstance.on('mousemove', handleMapMouseMove);
                  mapInstance.on('mouseup', handleMapMouseUp);
                }
              }}
            >
              <Popup>
                <div style={{ padding: '5px', minWidth: '160px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#333' }}>Edit Classroom Label</div>
                  
                  <input 
                    type="text" 
                    value={room.name} 
                    onChange={(e) => handleUpdateName(room.id, e.target.value)}
                    style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '12px', width: '100%', boxSizing: 'border-box' }} 
                  />
                  
                  <button 
                    onClick={() => handleDeleteClassroom(room.id)} 
                    style={{ padding: '6px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold', width: '100%' }}
                  >
                    Delete Classroom Dot
                  </button>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {/* Control Action Buttons & Code Generator Output Panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <button 
          onClick={handleAddNewClassroom} 
          style={{ width: '100%', padding: '14px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 6px rgba(40,167,69,0.2)' }}
        >
          ➕ Drop New Classroom Dot Node at Center of View
        </button>

        <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '12px', border: '1px solid #ddd', boxSizing: 'border-box', width: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <h4 style={{ margin: '0 0 5px 0', color: '#28a745' }}>📋 Real-Time Compiled Classroom Code Manifest</h4>
          <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#666' }}>Your rooms parse dynamically into a hard data dictionary below. Click the text to auto-select and copy.</p>
          <textarea
            readOnly
            value={generateExportTextString()}
            style={{ width: '100%', height: '150px', background: '#272822', color: '#f8f8f2', padding: '12px', borderRadius: '8px', fontSize: '12px', fontFamily: 'monospace', resize: 'vertical', boxSizing: 'border-box' }}
            onClick={(e) => e.target.select()}
          />
        </div>
      </div>

    </div>
  );
}

export default MapPage;
