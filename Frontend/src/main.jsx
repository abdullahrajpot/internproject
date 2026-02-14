
import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import Router from './Pages/route';
import { AuthProvider } from './Contexts/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserProvider } from './Contexts/UserContext';
import { SettingsProvider } from './Contexts/SettingsContext';


// import router from './Pages';
import './index.css';

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <SettingsProvider>
      <UserProvider>

        <StrictMode>
          <ToastContainer position="top-right" autoClose={3000} />
          <RouterProvider router={Router} />
        </StrictMode>
      </UserProvider>
    </SettingsProvider>
  </AuthProvider>
);
