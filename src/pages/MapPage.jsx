import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Polyline } from 'react-leaflet';
import { dnhsRoutingGrid } from '../campusData';
import 'leaflet/dist/leaflet.css';

function MapPage() {
  const dnhsCenter = [33.01447, -117.12146];
  const dnhsMaxBounds = [[33.0175, -117.1255], [33.0115, -117.1175]];
  const mapRef = useRef(null);

  const [selectedNodeA, setSelectedNodeA] = useState(null);
  const [selectedNodeB, setSelectedNodeB] = useState(null);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    const savedEdges = localStorage.getItem('dnhs_calibrated_sidewalk_edges');
    if (savedEdges) {
      try {
        setEdges(JSON.parse(savedEdges));
      } catch (e) {
        console.error("Error reading edges from localStorage", e);
      }
    }
  }, []);

  const saveEdgesToDisk = (updatedEdges) => {
    setEdges(updatedEdges);
    localStorage.setItem('dnhs_calibrated_sidewalk_edges', JSON.stringify(updatedEdges));
  };

  const handleNodeClick = (nodeId) => {
    if (!selectedNodeA) {
      setSelectedNodeA(nodeId);
    } else if (selectedNodeA === nodeId) {
      setSelectedNodeA(null);
    } else if (!selectedNodeB) {
      setSelectedNodeB(nodeId);
    } else if (selectedNodeB === nodeId) {
      setSelectedNodeB(null);
    }
  };

  const handleConnectNodes = () => {
    if (!selectedNodeA || !selectedNodeB) return;

    const edgeKey = selectedNodeA < selectedNodeB 
      ? `${selectedNodeA}---${selectedNodeB}` 
      : `${selectedNodeB}---${selectedNodeA}`;

    if (!edges.includes(edgeKey)) {
      const updated = [...edges, edgeKey];
      saveEdgesToDisk(updated);
    }

    setSelectedNodeA(null);
    setSelectedNodeB(null);
  };

  const handleDeleteEdge = (edgeKey) => {
    const updated = edges.filter(e => e !== edgeKey);
    saveEdgesToDisk(updated);
  };

  const handleClearEverything = () => {
    if (window.confirm("Wipe out all drawn sidewalk path lines completely?")) {
      saveEdgesToDisk([]);
      setSelectedNodeA(null);
      setSelectedNodeB(null);
    }
  };

  const generateExportTextString = () => {
    if (edges.length === 0) return '// No connected path sidewalk tracks established yet.';
    
    const adjacencyObject = {};
    Object.keys(dnhsRoutingGrid).forEach(id => {
      adjacencyObject[id] = [];
    });

    edges.forEach(edgeKey => {
      const parts = edgeKey.split('---');
      const nodeA = parts[0];
      const nodeB = parts[1];
      if (adjacencyObject[nodeA] && !adjacencyObject[nodeA].includes(nodeB)) adjacencyObject[nodeA].push(nodeB);
      if (adjacencyObject[nodeB] && !adjacencyObject[nodeB].includes(nodeA)) adjacencyObject[nodeB].push(nodeA);
    });

    return Object.keys(adjacencyObject)
      .map(key => `  "${key}": ${JSON.stringify(adjacencyObject[key])},`)
      .join('\n');
  };

  return (
    <div style={{ padding: '20px', boxSizing: 'border-box', width: '100%', minHeight: '100vh', fontFamily: 'sans-serif', backgroundColor: '#f8f9fa' }}>
      
      <div style={{ background: '#343a40', color: 'white', padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <div>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '15px' }}>🔗 Rapid-Fire Sidewalk Path Connection IDE</h3>
          <p style={{ margin: 0, fontSize: '12px', color: '#bbb' }}>
            Click Node 1, click Node 2, then hit the green button to draw an open walkway path segment between them.
          </p>
        </div>
        <button onClick={handleClearEverything} style={{ padding: '6px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
          Wipe All Lines
        </button>
      </div>

      <div style={{ width: '100%', height: '55vh', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: '1px solid #ddd', marginBottom: '15px' }}>
        <MapContainer ref={mapRef} center={dnhsCenter} zoom={18} minZoom={17} maxZoom={18} maxBounds={dnhsMaxBounds} maxBoundsViscosity={1.0} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {edges.map((edgeKey) => {
            const parts = edgeKey.split('---');
            const posA = dnhsRoutingGrid[parts[0]];
            const posB = dnhsRoutingGrid[parts[1]];
            if (!posA || !posB) return null;

            return (
              <Polyline
                key={edgeKey}
                positions={[posA, posB]}
                pathOptions={{ color: '#0070f3', weight: 4, opacity: 0.85 }}
                eventHandlers={{
                  click: () => {
                    if (window.confirm(`Delete this sidewalk connection line?`)) {
                      handleDeleteEdge(edgeKey);
                    }
                  }
                }}
              />
            );
          })}

          {Object.keys(dnhsRoutingGrid).map((nodeId) => {
            const isSelectedA = selectedNodeA === nodeId;
            const isSelectedB = selectedNodeB === nodeId;
            
            let dotColor = '#28a745'; 
            if (isSelectedA) dotColor = '#ffc107'; 
            if (isSelectedB) dotColor = '#fd7e14'; 

            return (
              <CircleMarker
                key={nodeId}
                center={dnhsRoutingGrid[nodeId]}
                radius={7}
                pathOptions={{ color: dotColor, fillColor: dotColor, fillOpacity: 0.9, weight: 2 }}
                eventHandlers={{
                  click: () => handleNodeClick(nodeId)
                }}
              />
            );
          })}
        </MapContainer>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', background: 'white', padding: '12px', borderRadius: '8px', border: '1px solid #eee' }}>
          <div style={{ flex: 1, fontSize: '13px', color: '#555' }}>
            <strong>Point A:</strong> {selectedNodeA || 'None'} | <strong>Point B:</strong> {selectedNodeB || 'None'}
          </div>
          <button
            onClick={handleConnectNodes}
            disabled={!selectedNodeA || !selectedNodeB}
            style={{ padding: '10px 20px', backgroundColor: (!selectedNodeA || !selectedNodeB) ? '#ccc' : '#28a745', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            🔗 Connect Selected Nodes
          </button>
        </div>

        <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '12px', border: '1px solid #ddd', boxSizing: 'border-box', width: '100%' }}>
          <h4 style={{ margin: '0 0 5px 0', color: '#28a745' }}>📋 Real-Time Compiled Adjacency Matrix Manifest</h4>
          <textarea
            readOnly
            value={generateExportTextString()}
            style={{ width: '100%', height: '150px', background: '#272822', color: '#f8f8f2', padding: '12px', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace', resize: 'vertical', boxSizing: 'border-box' }}
            onClick={(e) => e.target.select()}
          />
        </div>
      </div>

    </div>
  );
}

export default MapPage;
