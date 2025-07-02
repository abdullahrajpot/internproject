import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import './index.css';
import Footer from './components/Footer';

const App = () => {
  return (
    <>
      <Header />
      <main className="p-4">
        <Outlet />
      </main>
      <Footer/>
    </>
  );
};

export default App;
