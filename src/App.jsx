import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Absolute path overrides to fix missing default marker pins in Vite asset compilers
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize:,
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Default coordinate placeholder [Latitude, Longitude]
  // We can lock these numbers onto your exact high school buildings next!
  const schoolCoordinates = [37.7749, -122.4194]; 

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '10px', maxWidth: '500px', margin: '0 auto' }}>
      {!isLoggedIn ? (
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '60px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h2 style={{ margin: 0, color: '#333' }}>🏫 Freshman Navigation</h2>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Sign in to generate your customized class routes.</p>
          <input type="email" placeholder="School Email Address" required style={{ padding: '12px', borderRadius: '4px', border: '1px solid #ccc' }} />
          <input type="password" placeholder="Password" required style={{ padding: '12px', borderRadius: '4px', border: '1px solid #ccc' }} />
          <button type="submit" style={{ padding: '12px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
            Access Campus Map
          </button>
        </form>
      ) : (
        <div style={{ marginTop: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h3 style={{ margin: 0 }}>🗺️ Live Campus View</h3>
            <button onClick={() => setIsLoggedIn(false)} style={{ color: '#ff0000', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
              Log Out
            </button>
          </div>

          {/* Interactive Responsive Mobile Map Frame */}
          <div style={{ height: '70vh', width: '100%', borderRadius: '8px', overflow: 'hidden', border: '2px solid #0070f3' }}>
            <MapContainer center={schoolCoordinates} zoom={17} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={schoolCoordinates}>
                <Popup>
                  High School Campus Center <br /> Class path navigation lines will bind here.
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
