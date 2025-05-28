import { createBrowserRouter } from 'react-router-dom';
import App from '../App'; // Root layout with Header
import Home from './Frontend/Home';
import About from './Frontend/About';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // This includes the Header
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> }
    ]
  }
]);

export default router;
