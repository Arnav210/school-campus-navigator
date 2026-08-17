# Core Architecture & Engineering Learning Ledger

This ledger tracks technical breakdowns, architectural decisions, and syntactical logic translations for the Del Norte High School Navigation PWA.

---

## Module 1: Client-Side Multi-Page Routing Infrastructure

### 1. Unified Code Architecture (`src/App.jsx`)
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

### 2. Deep Technical Breakdown & Mechanics

#### A. Dependency Destructuring & Component Imports
* **Mechanism:** JavaScript uses the `import` statement to load external modules. Braces like `{ BrowserRouter }` indicate **named exports**, which pull specific class-like tools out of a library package, minimizing bundle bloat.
* **AP CSA Analogy:** Mapped identically to standard Java import statements:
  ```java
  import java.util.ArrayList; // Standard Java class inclusion
  ```

#### B. Serverless State Caching (`localStorage`)
* **Mechanism:** Web browsers expose a persistent, client-side data store known as `localStorage`. It stores strings in the user's browser disk space. The method `.getItem(key)` performs an operational search query.
* **The Evaluation Pattern:** `localStorage` returns a raw String, not a boolean. We append `=== 'true'` to explicitly convert that text string into a native JavaScript boolean variable.
* **AP CSA Analogy:** Functions identically to a standard Java `HashMap` utility:
  ```java
  HashMap<String, String> localStorage = new HashMap<>();
  boolean hasCompletedOnboarding = localStorage.get("hasCompletedOnboarding").equals("true");
  ```

#### C. Control Flow Redirection via Ternary Assignment
* **Mechanism:** The layout uses an internal execution expression wrapper `{}` containing a **Ternary Operator** (`condition ? expressionIfTrue : expressionIfFalse`). This evaluates the state of the onboarding boolean in real-time.
* **AP CSA Analogy:** Mapped directly to shorthand evaluation logic from AP CSA unit testing parameters:
  ```java
  int targetRoute = (hasCompletedOnboarding == true) ? routeToMap() : routeToOnboarding();
  ```

#### D. Virtual DOM Page Routing Engine Matrix
* `<BrowserRouter>`: Creates the root global history monitoring loop context. The `basename` string property forces routing paths to scale correctly inside GitHub Pages subfolder environments.
* `<Routes>`: Acts as an active switchboard array, cross-referencing incoming URL path patterns against our defined options.
* `<Route>`: Tracks like a `case` gate. If the address matches the `path` property exactly, it calls the `element` parameter constructor to instantiate the page component onto the user's viewport screen.
* `<Navigate>`: Safely triggers an immediate path update, altering the browser window history record without breaking application memory structures.

---
