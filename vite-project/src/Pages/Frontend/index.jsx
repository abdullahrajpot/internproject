// src/Pages/Frontend/index.js
import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../../components/Header'
import Home from './Home'
import About from './About'

const Frontend = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}

// Export this full route structure directly
const frontendRoutes = {
  path: '/',
  element: <Frontend />,
  children: [
    {
      path: '',
      element: <Home />
    },
    {
      path: 'about',
      element: <About />
    }
  ]
}

export default frontendRoutes
