import { ProtectedRoute } from './ProtectedRoute';
import DashboardLayout from '../pages/DashboardLayout';

export default function ProtectedDashboard() {
  return (
    <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
  );
}
