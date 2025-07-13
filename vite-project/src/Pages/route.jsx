


import { createBrowserRouter } from 'react-router-dom';
import App from '../App'; // Root layout with Header
import Home from './Frontend/Home';
import About from './Frontend/About';
import Auth from './Auth';
import Login from './Auth/Login';
import Register from './Auth/Register';
import ForgotPassword from './Auth/ForgotPassword';
import Internship from './Frontend/Internship';


const Router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // This includes the Header
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
            { path: 'internship', element: <Internship /> }

    ]
  },
    {
    path: '/auth',
    element: <Auth />,
    children: [
      { index: true, element: <Login /> },
      {path:'register',element:<Register/>},
      {path: "forgot-password",element:<ForgotPassword/>}
    ]
  }
]);

export default Router;
