import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

/* Continuous background service worker registration pipeline tracking hook */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('./sw.js')
      .then(function(reg) {
        console.log('Service Worker registered successfully inside scope:', reg.scope);
      })
      .catch(function(err) {
        console.error('Service Worker registration encounter error failure:', err);
      });
  });
}
