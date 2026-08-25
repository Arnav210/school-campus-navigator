# Module 1: Enterprise Multi-Page Routing Architecture

## 1. Production Switchboard System Core (src/App.jsx)

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


## 2. Client-Side Memory I/O Blocking Mechanics

Line configuration:
const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding') === 'true';

How it works:
When a user opens the application, this line executes synchronously before the browser renders any UI elements. It accesses the browser's persistent key-value store to check if the user has already finished onboarding. 

Because data saved to local storage is always saved as raw strings, checking a string variable directly inside a conditional component can cause severe runtime bugs. The strict equality operator converts this text string into a clean primitive Boolean token (true or false) right during the first lifecycle tick. This intentionally prevents visual glitching, page flickering, or layout jumps before the map loads.


## 3. Virtual Routing Switching Layers

Line configuration:
<BrowserRouter basename="/school-campus-navigator">

How it works:
This component initializes an isolated session history tracker directly on the client device. By hardcoding the basename parameter to /school-campus-navigator, the virtual router knows to automatically look for this repository prefix across all sub-page requests. This allows our single-page application (SPA) to cleanly run inside a subdirectory path network, which is mandatory for static web hosting platforms like GitHub Pages.


## 4. AP CSA Advanced Analogy

This workflow functions exactly like selectively importing specific collection classes from a utility package and verifying condition attributes inside an instantiated HashMap dictionary container:

import java.util.HashMap;

public class ApplicationSwitchboard {
    public static void main(String[] args) {
        HashMap<String, String> localStorage = new HashMap<>();
        localStorage.put("hasCompletedOnboarding", "true");
        
        boolean hasOnboarded = localStorage.get("hasCompletedOnboarding").equals("true");
        
        if (hasOnboarded) {
            System.out.println("Switching viewport frame pointer destination directly to: /map");
        } else {
            System.out.println("Switching viewport frame pointer destination directly to: /onboarding");
        }
    }
}

# Module 1.5: Deep Path Interception (The Single-Page App 404 Proxy)

## 1. Hard-Coded Fallback Script (public/404.html)

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


## 2. Low-Level Protocol Parsing Mechanics

The Static Server Mismatch:
GitHub Pages hosts files using flat, physical directory structures. When a user directly types an internal sub-page link like /map into their mobile address bar or reloads that path, the remote server looks inside its asset folders for a file named /map/index.html. Because that subdirectory track only exists virtually inside memory paths managed by React Router, the hosting platform instantly returns a severe 404 error protocol crash.

The Redirection Catch Loop:
This fallback proxy script intercepts the network failure before an error screen displays. The expression window.location.pathname.split('/') explodes the requested URL string parameter into an array of sub-strings using the forward slash as a divider. 

The script isolates the root deployment directory path names with a custom .slice() boundary sweep, converts the deep child route parameter into an appended plain-text query search parameter token (?p=), and issues an atomic window state swap payload command via window.location.replace(). This immediately brings the client back to the index.html root file where React Router can catch, decode, and render the target application route view dynamically without showing a server crash.

# Module 2: Topological Graph Data Modeling & Decoupling

## 1. Modularity Backbones (src/campusData.js & src/roomDatabase.js)

// src/campusData.js
export const dnhsRoutingGrid = {
  "Node_5040": [33.01463, -117.12179],
  "Node_6659": [33.01470, -117.12174]
};

export const dnhsPaths = {
  "Node_5040": ["Node_6659", "Node_6853", "Node_9260", "Administration", "Library"],
  "Node_6659": ["Node_8554", "Node_5040", "Node_4327", "Node_7952", "Library"]
};

// src/roomDatabase.js
export const classroomLookup = {
  "S101": [33.01496, -117.11998],
  "B125": [33.01363, -117.12182]
};


## 2. High-Density Graph Architecture Breakdown

Structural Modularity (Separation of Concerns):
This architecture explicitly splits the coordinate datasets into two standalone repositories. Public student search targets like individual rooms are compiled inside roomDatabase.js, while hidden pavement intersections are maintained within campusData.js. This separation guarantees that thousands of individual classrooms can be renamed, edited, or appended on the fly without breaking the underlying background map navigation configurations.

Topological Graph Adjacency List:
The data structure dnhsPaths acts as an unweighted Graph Theory Adjacency List. Every distinct coordinate point serves as a vertex string key. This key references a flat array matching all open sidewalk junctions it directly touches. If a walkway is blocked on campus, removing a single string token from its direct matching array instantly prevents the shortest-path algorithm from routing pedestrian traffic through that track segment.


## 3. AP CSA Advanced Analogy

This database structure maps directly to initializing nested generic map dictionaries inside a Java object collection array pipeline:

import java.util.HashMap;
import java.util.ArrayList;
import java.util.Arrays;

public class CampusGraphWeb {
    public static void main(String[] args) {
        HashMap<String, ArrayList<String>> paths = new HashMap<>();
        
        paths.put("Node_5040", new ArrayList<>(Arrays.asList("Node_6659", "Node_6853")));
        
        System.out.println("Direct sidewalk connectivity routes found: " + paths.get("Node_5040"));
    }
}

# Module 3: Constrained Dijkstra Pathfinder Mathematics

## 1. Algorithmic Optimization Script Matrix (src/pages/MapPage.jsx)

function calculateDistance(coord1, coord2) {
  const lat1 = coord1[0];
  const lon1 = coord1[1];
  const lat2 = coord2[0];
  const lon2 = coord2[1];
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function findShortestPath(startKey, endKey, gpsCoords) {
  const masterGraph = Object.assign({}, dnhsRoutingGrid, classroomLookup);
  const dynamicPaths = Object.assign({}, dnhsPaths);

  const distances = {};
  const previous = {};
  let queue = [];

  Object.keys(masterGraph).forEach(function(id) {
    distances[id] = id === startKey ? 0 : Infinity;
    queue.push({ id: id, dist: distances[id] });
    previous[id] = null;
  });

  while (queue.length > 0) {
    queue.sort(function(a, b) { return a.dist - b.dist; });
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
    neighbors.forEach(function(neighborId) {
      const isNeighborClassroom = classroomLookup.hasOwnProperty(neighborId);
      if (isNeighborClassroom && neighborId !== endKey) return;

      const alt = distances[u] + calculateDistance(masterGraph[u], masterGraph[neighborId]);
      if (alt < distances[neighborId]) {
        distances[neighborId] = alt;
        previous[neighborId] = u;
        queue = queue.map(function(q) {
          return q.id === neighborId ? Object.assign({}, q, { dist: alt }) : q;
        });
      }
    });
  }
  return null;
}


## 2. Comprehensive Mathematical Breakdown

The Haversine Distance Pipeline:
Standard Euclidean geometry calculations fail when mapping long coordinates over spherical, curved spaces. The application maps accurate sidewalk traversal costs using the Haversine equation. It converts geographic latitude and longitude degree coordinates into absolute measurements in meters by computing the central angle between the two coordinate array vectors and multiplying the resulting value by the mean radius of the Earth (6,371,000 meters).

The Priority Sort Cost Machine:
The expression queue.sort(function(a, b) { return a.dist - b.dist; }) executes an ascending weight evaluation sorting order across unvisited tracking items on every iteration of the pathfinding cycle. This ensures that the execution pointer continuously pulls the absolute lowest accumulated distance weight vertex next via queue.shift(). This removes loose or wasteful processing passes, ensuring lightning-fast search updates on low-powered mobile phone devices.

Topological Obstruction Intercept Guards:
To prevent the pathfinder from routing pedestrian lines directly through the inside walls of alternative classroom structures along a route, the system enforces a strict validation intercept step: classroomLookup.hasOwnProperty(neighborId). If a neighbor connection maps to a registered classroom key and is not the ultimate target destination, it triggers an instant return statement. This cuts that node from the iteration, forcing the path line to stay strictly on the outdoor concrete sidewalks.

# Module 4: Mobile Web Optimization & Fluid Viewport Handling

## 1. CSS Mobile Layout Core (src/styles/MapPage.css)

.navigator-text-input {
  font-size: 16px;
  background-color: #2a4365;
  color: #ffffff;
  border: 2px solid #0d233a;
  outline: none;
}

.autocomplete-overlay-dropdown {
  position: absolute;
  top: 62px;
  max-height: 150px;
  overflow-y: auto;
  z-index: 2000;
}


## 2. Low-Level Mobile Ingestion Mechanics

Forced Browser Zoom Bypass:
Mobile operating systems (such as Apple iOS Safari) are hard-coded to trigger an aggressive automatic camera viewport zoom-in the exact millisecond a user clicks into a text input element if that field has an input typography size smaller than 16px. Bumping our typography style directly to a strict font-size: 16px base satisfies the browser's internal accessibility parameters, completely blocking the browser from forcing awkward zoom changes so the map remains steady.

Persistent List Focus Reset Architecture:
Native mobile devices often hide or distort standard drop-down layouts. The application builds absolute-positioned layout overlays directly beneath inputs. Setting position: absolute isolates it from the standard document flow, allowing it to float cleanly on top of form sections. Using an automatic vertical scrollbar property (overflow-y: auto) capped at a maximum height of 150px keeps the UI clean and space-efficient on smaller mobile screens.

Focus State Clears:
Attaching clear onFocus listeners hooks resets the layout states whenever a text box is clicked. This instantly empties the input filters and displays the full 114-classroom option listing automatically, letting students browse or filter names seamlessly.

# Module 5: Live Asynchronous Geolocation Tracking & Proximity Anchoring

## 1. Satellite Ingestion Script (src/pages/MapPage.jsx)

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


## 2. Geolocation Positioning & Network Snapping Mechanics

Non-Blocking Hardware Positioning Watch Loops:
The method navigator.geolocation.watchPosition establishes an active listener pipeline hooked straight into the mobile hardware's internal GPS satellite telemetry chip. Configuring the tracker stream with enableHighAccuracy: true forces the phone to pull precise location updates directly from telemetry sensors rather than rough cell tower triangulation, updating the user's position dot on the map in real-time.

Blank-Field Footprint Snapping Calculations:
When a student types a destination but leaves the starting field blank, the engine routes directly from their current location. The script calculates straight-line distances from the user's phone coordinates to all 48 network dots. It picks the absolute closest sidewalk vertex and bridges it to a virtual start tag (USER_GPS_START), enabling dynamic pathing from a student's precise steps to their destination classroom door.
