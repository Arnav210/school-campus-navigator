import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix system to re-route missing default marker asset paths inside modern Vite bundlers
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function MapPage() {
  // Exact global coordinate vector centering the Del Norte High School main campus buildings
  const dnhsCoordinates = [33.0144, -117.1222];

  return (
    <div style={{ padding: '20px', boxSizing: 'border-box', width: '100%', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* Dynamic Viewport Container: Scaled layout adjusts to phone or desktop monitors automatically */}
      <div style={{ width: '100%', height: '85vh', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: '1px solid #ddd' }}>
        <MapContainer center={dnhsCoordinates} zoom={17} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={dnhsCoordinates}>
            <Popup>
              Del Norte High School Campus.<br />Interactive schedule routes will anchor here.
            </Popup>
          </Marker>
        </MapContainer>
      </div>

    </div>
  );
}

export default MapPage;
