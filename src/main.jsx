import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import './index.css';
import { ContactProvider } from './store'; // Importamos el proveedor

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ContactProvider> {/* Envolvemos la aplicación con el proveedor */}
    <RouterProvider router={router} />
    </ContactProvider>
  </React.StrictMode>
);