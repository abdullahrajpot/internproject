import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import './index.css';
import Footer from './components/Footer';
import BackendStatus from './components/BackendStatus';

const App = () => {
  return (
    <>
      <Header />
      <main className="">
        <Outlet />
      </main>
      <Footer/>
      <BackendStatus />
    </>
  );
};

export default App;
