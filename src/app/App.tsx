import { createBrowserRouter, RouterProvider } from 'react-router';
import { RootLayout } from './components/RootLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import ProtectedDashboard from './components/ProtectedDashboard';
import Overview from './pages/Overview';
import BatchDetail from './pages/BatchDetail';
import History from './pages/History';
import CameraMonitoring from './pages/CameraMonitoring';
import Weather from './pages/Weather';
import VoiceAlerts from './pages/VoiceAlerts';

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <Landing />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/dashboard',
        element: <ProtectedDashboard />,
        children: [
          {
            index: true,
            element: <Overview />,
          },
          {
            path: 'batch/:id',
            element: <BatchDetail />,
          },
          {
            path: 'camera',
            element: <CameraMonitoring />,
          },
          {
            path: 'weather',
            element: <Weather />,
          },
          {
            path: 'voice',
            element: <VoiceAlerts />,
          },
          {
            path: 'history',
            element: <History />,
          },
        ],
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}