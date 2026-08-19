import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { dnhsNodes } from '../campusData';
import 'leaflet/dist/leaflet.css';

// Fix system to re-route missing default marker asset paths inside modern Vite bundlers
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const parsedIconSize = '25,41'.split(',').map(Number);
const parsedIconAnchor = '12,41'.split(',').map(Number);

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: parsedIconSize,
  iconAnchor: parsedIconAnchor
});
L.Marker.prototype.options.icon = DefaultIcon;

function MapPage() {
  // Center map layout cleanly on your hand-calibrated Hawk Central Quad anchor coordinates
  const dnhsCenter = [33.01447, -117.12146];

  return (
    <div style={{ padding: '20px', boxSizing: 'border-box', width: '100%', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      <div style={{ width: '100%', height: '85vh', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: '1px solid #ddd' }}>
        <MapContainer center={dnhsCenter} zoom={18} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Render your permanently calibrated, locked location points across the map grid */}
          {Object.keys(dnhsNodes).map((nodeName, index) => (
            <Marker key={index} position={dnhsNodes[nodeName]} draggable={false}>
              <Popup>
                <strong style={{ color: '#0070f3' }}>{nodeName}</strong><br />
                Main Entrance Corridor.
              </Popup>
            </Marker>
          ))}

        </MapContainer>
      </div>

    </div>
  );
}

export default MapPage;
