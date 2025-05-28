import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import './index.css';

const App = () => {
  return (
    <>
      <Header />
      <main className="p-4">
        <Outlet />
      </main>
    </>
  );
};

export default App;
