import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider> {/* Wrap App with AuthProvider */}
      <App />
    </AuthProvider>
  </BrowserRouter>
);