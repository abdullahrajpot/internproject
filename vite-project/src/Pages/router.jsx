import { createBrowserRouter } from 'react-router-dom';
import App from '../App'; // Root layout with Header
import Home from '../Pages/Frontend/Home';
import About from '../Pages/Frontend/About';

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
