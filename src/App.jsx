import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import OnboardingPage from './pages/OnboardingPage';
import MapPage from './pages/MapPage';

function App() {
  return (
    // basename property maps application routing parameters to the GitHub Pages subfolder
    <BrowserRouter basename="/school-campus-navigator">
      <Routes>
        <Route path="/" element={<Navigate to="/map" replace />} />
        
        {/* Explicit Path Declarations linking browser URLs to component renders */}
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/map" element={<MapPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
