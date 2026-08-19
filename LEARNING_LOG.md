# Core Architecture & Engineering Learning Ledger

This ledger tracks technical breakdowns, architectural decisions, and syntactical logic translations for the Del Norte High School Navigation PWA.

---

## Module 1: Client-Side Multi-Page Routing Infrastructure

### 1. Production Code Blueprint (`src/App.jsx`)
```jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import OnboardingPage from './pages/OnboardingPage';
import MapPage from './pages/MapPage';

function App() {
  const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding') === 'true';

  return (
    <BrowserRouter basename="/school-campus-navigator">
      <Routes>
        <Route 
          path="/" 
          element={hasCompletedOnboarding ? <Navigate to="/map" /> : <Navigate to="/onboarding" />} 
        />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/map" element={<MapPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

### 2. Line-by-Line Mechanics & AP CSA Analogy

#### Line: `import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';`
* **Technical Mechanics:** Uses **Named Destructuring** via curly braces `{}` to cherry-pick specific class-like structural tools out of the router library package, minimizing memory bundle sizes on local mobile devices.
* **AP CSA Analogy:** Mimics target dependency path selection imports:
  ```java
  import java.util.ArrayList; // Loads only ArrayList, not all of java.util
  ```

#### Line: `const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding') === 'true';`
* **Technical Mechanics:** Queries browser memory. Because `localStorage` natively tracks key data as pure text strings, appending the strict equality operator `=== 'true'` explicitly resolves that text check into a native primitive boolean variable (`true` or `false`).
* **AP CSA Analogy:** Functions identically to reading parameters from an instantiated map dictionary:
  ```java
  HashMap<String, String> localStorage = new HashMap<>();
  boolean hasCompletedOnboarding = localStorage.get("hasCompletedOnboarding").equals("true");
  ```

---

## Module 1.5: Client-Side Path Interception (The 404 Routing Hack)

### 1. Production Code Blueprint (`public/404.html`)
```html
<script type="text/javascript">
  var pathSegmentsToKeep = 1;
  var l = window.location;
  l.replace(
    l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
    l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?p=' +
    l.pathname.split('/').slice(1 + pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
    l.search.replace(/&/g, '~and~') +
    l.hash
  );
</script>
```

### 2. Mechanics Breakdown
* **The Static Host Trap:** Static file hosting services (GitHub Pages) do not understand virtual routing layers. Manual URL adjustments or window refreshes on paths like `/map` bypass React and throw server-side crashes.
* **The Redirection Intercept:** The script splits the target path string components into arrays (`.split('/')`), extracts the subfolder root name via pointer slicing ranges (`.slice()`), and converts the requested deep link into a plain text URL query token. It forces an instantaneous fallback redirect (`l.replace`) to the central `index.html` file layout where React Router can catch and parse it without showing a browser error screen.

---

## Module 2: High-Precision Landmark Waypoint Mapping

### 1. Production Code Blueprint (`src/pages/MapPage.jsx`)
```jsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { dnhsNodes } from '../campusData';
import 'leaflet/dist/leaflet.css';
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
  const dnhsCenter = [33.01447, -117.12146];
  const dnhsMaxBounds = [[33.0175, -117.1255], [33.0115, -117.1175]];

  return (
    <div style={{ padding: '20px', boxSizing: 'border-box', width: '100%', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <div style={{ width: '100%', height: '85vh', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: '1px solid #ddd' }}>
        <MapContainer center={dnhsCenter} zoom={18} minZoom={17} maxZoom={19} maxBounds={dnhsMaxBounds} maxBoundsViscosity={1.0} style={{ height: '100%', width: '100%' }}>
          <TileLayer attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {Object.keys(dnhsNodes).map((nodeName, index) => (
            <Marker key={index} position={dnhsNodes[nodeName]} draggable={false}>
              <Popup>
                <strong style={{ color: '#0070f3' }}>{nodeName}</strong><br />
                Destination anchor point. Tapping this room on your schedule draws a path to this door.
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default MapPage;
```

### 2. Mechanics Breakdown
* **Prototype Customization:** Overriding the internal global prototype configuration parameters (`L.Marker.prototype.options.icon`) manually resolves an asset path breaking issue native to production compilers (Vite), explicitly linking spatial pointers to hot-linked icon image resources.
* **Viewport Tracking Constraints:** Passing custom parameter constraints like `maxBoundsViscosity={1.0}` and `minZoom={17}` locks the user viewport camera context strictly onto the school building footprint lines, blocking panning access to extraneous map regions.
* **Reflection Collection Processing:** Evaluating `{Object.keys(dnhsNodes).map()}` acts like an advanced reflection algorithm array loop. It reads the string descriptors from our data dictionary ledger as a linear index layout collection, running an iterative loop to dynamically instantiate a separate visual `<Marker>` layer tracking to that key's coordinates array.
* **AP CSA Analogy:** Works identically to utilizing a key set lookup traversal loop across a Java data structure map:
  ```java
  for(String nodeName : dnhsNodes.keySet()) {
      double[] coords = dnhsNodes.get(nodeName);
      map.addMarker(new Marker(nodeName, coords));
  }
  ```

---

## Module 3: Stateful User Profiling & Optional Local Storage Caching

### 1. Production Code Blueprint (`src/pages/OnboardingPage.jsx`)
```jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function OnboardingPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('9');
  const [morningSpot, setMorningSpot] = useState('The Hawk Central Quad');
  const [officeHoursSpot, setOfficeHoursSpot] = useState('Campus Library');
  const [lunchSpot, setLunchSpot] = useState('The Hawk Central Quad');

  const handleOnboardingSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('studentName', name || 'Del Norte Guest');
    localStorage.setItem('studentGrade', grade);
    localStorage.setItem('morningSpot', morningSpot);
    localStorage.setItem('officeHoursSpot', officeHoursSpot);
    localStorage.setItem('lunchSpot', lunchSpot);
    localStorage.setItem('hasCompletedOnboarding', 'true');
    navigate('/map');
  };

  return (
    <div style={{ padding: '20px', boxSizing: 'border-box', width: '100%', minHeight: '100vh', fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f2f5' }}>
      <form onSubmit={handleOnboardingSubmit} style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '100%', maxWidth: '450px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ textAlign: 'center' }}>
          <h2>Welcome to Del Norte Navigator!</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '13px', fontWeight: 'bold' }}>What is your name?</label>
          <input type="text" placeholder="Enter your name (Optional)" value={name} onChange={(e) => setName(e.target.value)} style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }} />
        </div>
        {/* Dropdowns use unified layout configurations mapped identically to state mutators */}
        <button type="submit" style={{ marginTop: '10px', padding: '14px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
          Get Started
        </button>
      </form>
    </div>
  );
}

export default OnboardingPage;
```

### 2. Line-by-Line Mechanics & AP CSA Analogy

#### Line segment: `const [name, setName] = useState('');`
