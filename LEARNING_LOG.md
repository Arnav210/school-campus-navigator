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

## Module 2: Architectural Separation of Public Markers & Adjacency Grids

### 1. Production Data Backbone (`src/campusData.js`)
```javascript
export const dnhsLandmarks = {
  "A Building (Administration & Counseling)": [33.01493, -117.12160]
};

export const dnhsRoutingGrid = {
  "Node_5040": [33.01463, -117.12179],
  "Node_6659": [33.01470, -117.12174]
};

export const dnhsPaths = {
  "Node_5040": ["Node_6659", "Node_6853", "Node_9260"]
};
```

### 2. Mechanics Breakdown & AP CSA Analogy
* **Separation of Concerns:** Splitting data into `dnhsLandmarks` and `dnhsRoutingGrid` separates user-facing visual waypoints from the raw mathematical coordinates backend. This ensures the client UI stays clean while providing the hidden grid layers required by routing calculations.
* **Graph Adjacency Lists:** The `dnhsPaths` ledger represents a **Graph Data Structure Adjacency List**. It explicitly outlines direct walkway pathways by mapping a specific node key to an array string collection of its immediate spatial neighbors.
* **AP CSA Analogy:** Maps directly to an instantiated object tracking structure containing nested array collections:
  ```java
  HashMap<String, ArrayList<String>> dnhsPaths = new HashMap<>();
  ```

---

## Module 3: Rapid-Fire Edge Connection Workspace & Event Guards

### 1. Production Code Blueprint (`src/pages/MapPage.jsx`)
```jsx
// Tracks dual-click mapping hooks natively
const handleNodeClick = (nodeId) => {
  if (!selectedNodeA) {
    setSelectedNodeA(nodeId);
  } else if (selectedNodeA === nodeId) {
    setSelectedNodeA(null);
  } else if (!selectedNodeB) {
    setSelectedNodeB(nodeId);
  }
};
```

### 2. Mechanics Breakdown
* **Event Bubbling Interception:** Map container overlay elements capture clicks on lower DOM hierarchies and bubble them to the background container canvas. Removing traditional Leaflet Popups and migrating to direct State-Hook selection variables deletes this propagation path, ensuring fast click registration.
* **Viewport Hover State Shuttles:** Attaching `mouseover` and `mouseout` listener hooks to active `<CircleMarker>` elements allows our script to temporarily call `map.dragging.disable()`. This stops background map panning elements the exact millisecond a user grabs a custom node point, allowing precise node adjustments.
