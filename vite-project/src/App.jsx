import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import './index.css';
import Contact from './Pages/Frontend/Contact/ContactUs';

const App = () => {
  return (
    <>
      <Header />
      <Contact/>
      <main className="p-4">
        <Outlet />
      </main>
    </>
  );
};

export default App;
