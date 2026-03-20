import { Outlet } from 'react-router';
import { AuthProvider } from '../contexts/AuthContext';
import { SystemProvider } from '../contexts/SystemContext';
import { Toaster } from './ui/sonner';
import { ConnectionAlert } from './ConnectionAlert';

export function RootLayout() {
  return (
    <AuthProvider>
      <SystemProvider>
        <div className="min-h-screen">
          <Outlet />
          <ConnectionAlert />
          <Toaster position="top-right" richColors />
        </div>
      </SystemProvider>
    </AuthProvider>
  );
}
