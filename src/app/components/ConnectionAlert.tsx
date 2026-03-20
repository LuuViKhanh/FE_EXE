import { useEffect } from 'react';
import { useSystem } from '../contexts/SystemContext';
import { toast } from 'sonner';
import { WifiOff, Wifi } from 'lucide-react';

export function ConnectionAlert() {
  const { isOnline } = useSystem();

  useEffect(() => {
    if (!isOnline) {
      toast.error(
        <div className="flex items-center gap-2">
          <WifiOff className="w-5 h-5" />
          <div>
            <div className="font-semibold">Mất kết nối</div>
            <div className="text-sm text-muted-foreground">Đang cố gắng kết nối lại...</div>
          </div>
        </div>,
        {
          id: 'connection-lost',
          duration: Infinity,
        }
      );
    } else {
      toast.dismiss('connection-lost');
      // Show reconnection success only if previously disconnected
      const wasOffline = localStorage.getItem('was_offline');
      if (wasOffline === 'true') {
        toast.success(
          <div className="flex items-center gap-2">
            <Wifi className="w-5 h-5" />
            <div>
              <div className="font-semibold">Đã kết nối lại</div>
              <div className="text-sm text-muted-foreground">Hệ thống hoạt động bình thường</div>
            </div>
          </div>
        );
        localStorage.removeItem('was_offline');
      }
    }

    if (!isOnline) {
      localStorage.setItem('was_offline', 'true');
    }
  }, [isOnline]);

  return null;
}
