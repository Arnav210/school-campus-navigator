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

---

### 2. Line-by-Line Granular Code Interrogation

#### Line 1: `import React from 'react';`
* **Technical Mechanics:** Instructs the JavaScript engine to pull the core React engine out of the local `node_modules` cache folder. This initializes the JSX element compiler so the browser can understand visual tags mixed inside logic files.
* **AP CSA Java Analogy:** Operates like a standard class path import:
  ```java
  import core.framework.React;
  ```

#### Line 2: `import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';`
* **Technical Mechanics:** Uses **Named Destructuring** via curly braces `{}` to cherry-pick four highly specific class-like structural utilities from the `react-router-dom` library package. This avoids importing the entire library namespace into memory, optimizing local phone performance.
* **AP CSA Java Analogy:** Functions like importing explicit class tools out of a package layout:
  ```java
  import java.util.ArrayList; // Imports only ArrayList, not all of java.util
  ```

#### Line 3: `import OnboardingPage from './pages/OnboardingPage';`
#### Line 4: `import MapPage from './pages/MapPage';`
* **Technical Mechanics:** Establishes direct file relative paths (`./`) pointing to your custom decoupled child page files. This treats those external visual files as discrete instantiable modules inside this file scope.
* **AP CSA Java Analogy:** Pulling user-defined classes inside the same workspace project package:
  ```java
  OnboardingPage pageInstance = new OnboardingPage();
  ```

#### Line 6: `function App() {`
* **Technical Mechanics:** Declares the master structural functional component. In React, a component is simply a JavaScript function that evaluates logic and returns visual HTML layout layouts (JSX).
* **AP CSA Java Analogy:** Declares the public driver class or main execution block:
  ```java
  public class App {
  ```

#### Line 8: `const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding') === 'true';`
* **Technical Mechanics:** 
  1. `const`: Declares an immutable block constant variable (functions like `final` in Java).
  2. `localStorage.getItem('key')`: Queries the browser's persistent web data store disk space for a key matching that string name.
  3. `=== 'true'`: **Critical Step.** Because `localStorage` can only read and write raw text strings, it returns `"true"` as text, not a primitive boolean `true`. The strict equality operator `===` cross-references the string value against the text `'true'` and outputs a native JavaScript boolean primitive (`true` or `false`) into `hasCompletedOnboarding`.
* **AP CSA Java Analogy:** Functions identically to reading a localized map data collection dictionary:
  ```java
  final HashMap<String, String> localStorage = new HashMap<>();
  final boolean hasCompletedOnboarding = localStorage.get("hasCompletedOnboarding").equals("true");
  ```

#### Line 10: `return (`
* **Technical Mechanics:** Instructs the React component function to halt logic processing and output the visual layout tree structure wrapped within the following parentheses block to render on the client's screen.
* **AP CSA Java Analogy:** Traces identically to a method's object return call statement:
  ```java
  return visualUIObject;
  ```

#### Line 11: `<BrowserRouter basename="/school-campus-navigator">`
* **Technical Mechanics:** Instantiates the primary routing container. It sets up a background tracking listener loop over the browser window address bar history. The `basename` string configuration parameter safely hardcodes the subfolder URL root, ensuring the router functions perfectly inside a GitHub Pages directory instead of breaking at the server root domain.
* **AP CSA Java Analogy:** Initializing a primary monitoring system object container with custom path variables inside the constructor:
  ```java
  BrowserRouter router = new BrowserRouter("/school-campus-navigator");
  ```

#### Line 12: `<Routes>`
* **Technical Mechanics:** Configures the master virtual routing switchboard block. Every time the browser URL address changes, this wrapper scans through its internal child route arrays line-by-line to select the first valid match.
* **AP CSA Java Analogy:** Operates exactly like a structural `switch` control layout statement:
  ```java
  switch(currentURLPath) {
  ```

#### Lines 13–16: `<Route path="/" element={hasCompletedOnboarding ? <Navigate to="/map" /> : <Navigate to="/onboarding" />} />`
* **Technical Mechanics:** 
  1. `path="/"`: Listens to the absolute base root path location of the site.
  2. `element={...}`: Executes a dynamic statement portal via curly braces `{}` containing an inline **Ternary Operator Conditional Check** (`condition ? expressionIfTrue : expressionIfFalse`).
  3. **The Control Flow:** If the boolean evaluates to `true`, it mounts the `<Navigate>` tracking element to instantly rewrite the browser URL address history to `/map`. If it is `false`, it forces an immediate detour redirect to `/onboarding`.
* **AP CSA Java Analogy:** Traces directly to an inline shorthand evaluation expression inside a switch case condition:
  ```java
  case "/":
      if (hasCompletedOnboarding == true) { return new Navigate("/map"); }
      else { return new Navigate("/onboarding"); }
  ```

#### Line 17: `<Route path="/onboarding" element={<OnboardingPage />} />`
#### Line 18: `<Route path="/map" element={<MapPage />} />`
* **Technical Mechanics:** Registers clear destination guard houses. If the browser address matches `/onboarding`, it executes the `OnboardingPage()` constructor to inject Screen 1's UI layer onto the screen. If it matches `/map`, it safely instantiates the `MapPage()` layout.
* **AP CSA Java Analogy:** Finalizing individual case block execution paths:
  ```java
  case "/onboarding": return new OnboardingPage();
  case "/map":        return new MapPage();
  ```

#### Lines 20–21: `</Routes> </BrowserRouter> ); }`
* **Technical Mechanics:** Cleanly closes out the virtual layouts tags tree nested children arrays, finalizes the function declaration scope, and completes the executable runtime engine block.

#### Line 24: `export default App;`
* **Technical Mechanics:** Declares the `App` component function as the default public export module of this physical file layout, allowing the entry root index script (`main.jsx`) to safely locate, import, and mount it into the structural HTML browser window layout frame.
* **AP CSA Java Analogy:** Making a class public and visible to external compiler builders outside the local sub-package directory:
  ```java
  public class App { ... }
  ```


---

## Module 1.5: GitHub Pages Deep-Linking Mitigation (The 404 Routing Hack)

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

### 2. Line-by-Line Granular Script Interrogation

#### Line: `var pathSegmentsToKeep = 1;`
* **Technical Mechanics:** Allocates a local integer index variable. This indicates how many directory layers represent the static project root folder. For GitHub Pages hosting, this is exactly `1` slot (matching `/school-campus-navigator`).
* **AP CSA Java Analogy:** Declares a local constant configuration identifier:
  ```java
  int pathSegmentsToKeep = 1;
  ```

#### Line: `var l = window.location;`
* **Technical Mechanics:** Creates a local alias pointer caching the browser's global location object mapping context. This gives the script access to the browser toolbar's current network state and routing attributes.
* **AP CSA Java Analogy:** Assigns a reference handle variable pointing to a system parameter state object:
  ```java
  Location l = Window.getLocation();
  ```

#### Line: `l.replace( ... );`
* **Technical Mechanics:** Invokes the location object's core override method. This replaces the active web historical slot with a new constructed path layout string, immediately redirecting the viewport engine without causing browser backtracking loops.
* **AP CSA Java Analogy:** Calls a setter/mutator method on an object reference instance:
  ```java
  l.replace(newPathString);
  ```

#### Line segment: `l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '')`
* **Technical Mechanics:** Dynamically reconstructs the absolute base origin address string. It reads the protocol method (`https:`), appends domain indicators (`//arnav210.github.io`), and checks if a localized port exists using a short ternary evaluation string operator.
* **AP CSA Java Analogy:** Executes sequence string concatenations using object attribute returns:
  ```java
  String origin = l.getProtocol() + "//" + l.getHostname();
  ```

#### Line segment: `l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?p='`
* **Technical Mechanics:** 
  1. `.split('/')`: Breaks your routing path text string down into an array of isolated substring index components using the forward slash as an item boundary.
  2. `.slice(...)`: Performs an operational extract loop over the array elements, copying only the primary repository title index layer.
  3. `.join('/')`: Glues the array values back together into a structured text string.
  4. `+ '/?p='`: Appends a query search parameter flag. This packages whatever path broken route string the user originally requested (like `/map`) into a safe text value variable appended straight onto your home route landing directory.
* **AP CSA Java Analogy:** Traces identically to standard String tracking manipulations, Array copying ranges, and indexing loops:
  ```java
  String[] pathArray = l.getPathname().split("/");
  String[] slicedArray = Arrays.copyOfRange(pathArray, 0, 1 + pathSegmentsToKeep);
  String cleanRoot = String.join("/", slicedArray) + "/?p=";
  ```

---
