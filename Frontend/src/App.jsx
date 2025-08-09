import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import './index.css';
import Footer from './components/Footer';

const App = () => {
  return (
    <>
      <Header />
      <main className="">
        <Outlet />
      </main>
      <Footer/>
    </>
  );
};

export default App;
