// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Your Tailwind CSS output
import { Toaster } from './App'; // Import Toaster from App.jsx where it's defined inline

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster /> {/* Add the Toaster component here */}
  </React.StrictMode>
);
