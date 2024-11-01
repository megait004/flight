import AboutPage from '@pages/Client/AboutPage';
import ContactPage from '@pages/Client/ContactPage';
import FlightPage from '@pages/Client/FlightPage';
import Index from '@pages/Client/Index/Index';
import Layout from '@pages/Client/Layout';
import { createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Index />
      },
      {
        path: '/ve-may-bay',
        element: <FlightPage />
      },
      {
        path: '/gioi-thieu',
        element: <AboutPage />
      },
      {
        path: '/lien-he',
        element: <ContactPage />
      }
    ]
  }
]);

export default router;