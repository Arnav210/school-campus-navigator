import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function MapPage() {
  const dnhsCenter = '33.01447,-117.12146'.split(',').map(Number);
  const mapRef = useRef(null);

  const [isDevMode, setIsDevMode] = useState(true);
  const [customNodes, setCustomNodes] = useState([]);

  useEffect(() => {
    const savedNetwork = localStorage.getItem('dnhs_calibrated_network_dots');
    if (savedNetwork) {
      try {
        setCustomNodes(JSON.parse(savedNetwork));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const saveNodesToDisk = (updatedNodes) => {
    setCustomNodes(updatedNodes);
    localStorage.setItem('dnhs_calibrated_network_dots', JSON.stringify(updatedNodes));
  };

  const handleAddNewNodeToCenter = () => {
    let lat = 33.01447;
    let lng = -117.12146;
    if (mapRef.current) {
      const currentMapCenter = mapRef.current.getCenter();
      lat = currentMapCenter.lat;
      lng = currentMapCenter.lng;
    }
    const uniqueId = String(Math.floor(Math.random() * 9000) + 1000);
    const updated = [...customNodes, { id: uniqueId, lat: lat, lng: lng }];
    saveNodesToDisk(updated);
  };

  const handleUpdateNodePosition = (id, newLatLng) => {
    const updated = customNodes.map(n => n.id === id ? { ...n, lat: newLatLng.lat, lng: newLatLng.lng } : n);
    saveNodesToDisk(updated);
  };

  const handleDeleteNode = (id) => {
    const updated = customNodes.filter(n => n.id !== id);
    saveNodesToDisk(updated);
  };

  const generateExportTextString = () => {
    if (customNodes.length === 0) return '// No custom node dot vectors mapped yet.';
    return customNodes.map(n => '  "Node_' + n.id + '": [' + n.lat.toFixed(5) + ', ' + n.lng.toFixed(5) + '],').join('\n');
  };

  return (
    <div style={{ padding: '20px', boxSizing: 'border-box', width: '100%', minHeight: '100vh', fontFamily: 'sans-serif', backgroundColor: '#f8f9fa' }}>
      
      <div style={{ background: '#28a745', color: 'white', padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <span style={{ fontSize: '13px', fontWeight: 'bold' }}>
          🛠️ DEVELOPER MODE: Active (Use green button below map to add nodes)
        </span>
      </div>

      <div style={{ width: '100%', height: '55vh', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: '1px solid #ddd', marginBottom: '15px' }}>
        <MapContainer ref={mapRef} center={dnhsCenter} zoom={18} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {customNodes.map((node) => (
            <CircleMarker
              key={node.id}
              center={[node.lat, node.lng]}
              radius={6}
              pathOptions={{ color: '#28a745', fillColor: '#28a745', fillOpacity: 0.85, weight: 2 }}
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
                    handleUpdateNodePosition(node.id, moveEvent.latlng);
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
                <div style={{ fontSize: '11px', textAlign: 'center' }}>
                  <strong>Node ID:</strong> {node.id}<br />
                  <strong>Lat:</strong> {node.lat.toFixed(5)}<br />
                  <strong>Lng:</strong> {node.lng.toFixed(5)}<br /><br />
                  <button 
                    onClick={() => handleDeleteNode(node.id)} 
                    style={{ padding: '4px 8px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '10px' }}
                  >
                    Delete Node
                  </button>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <button 
          onClick={handleAddNewNodeToCenter} 
          style={{ width: '100%', padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Drop New Sidewalk Dot Node at Center of View
        </button>
        
        <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '12px', border: '1px solid #ddd', boxSizing: 'border-box', width: '100%' }}>
          <h4 style={{ margin: '0 0 5px 0', color: '#28a745' }}>📋 Real-Time Compiled Node Export Manifest</h4>
          <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666' }}>Your custom grid text parses directly below. Copy this entire block text into your data file when done mapping.</p>
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
