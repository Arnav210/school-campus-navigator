import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import OnboardingPage from './pages/OnboardingPage';
import MapPage from './pages/MapPage';

function App() {
  // Sync state with client browser memory to bypass onboarding on repeat sessions
  const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding') === 'true';

  return (
    // basename property maps application routing parameters to the GitHub Pages subfolder
    <BrowserRouter basename="/school-campus-navigator">
      <Routes>
        {/* Central Gateway Routing: Conditional check directs user based on profile persistence */}
        <Route 
          path="/" 
          element={hasCompletedOnboarding ? <Navigate to="/map" /> : <Navigate to="/onboarding" />} 
        />
        
        {/* Explicit Path Declarations linking browser URLs to component renders */}
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/map" element={<MapPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
