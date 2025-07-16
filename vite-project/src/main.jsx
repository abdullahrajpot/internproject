
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import Router from './Pages/route';
import { AuthProvider } from './Contexts/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// import router from './Pages';
// import './App.css';

createRoot(document.getElementById('root')).render(
  <AuthProvider>
  <StrictMode>
<ToastContainer position="top-right" autoClose={3000} />
    <RouterProvider router={Router} />
  </StrictMode>
  </AuthProvider>
);
