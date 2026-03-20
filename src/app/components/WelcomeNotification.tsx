import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { Sparkles } from 'lucide-react';

export function WelcomeNotification() {
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Show welcome notification on login
      const hasShownWelcome = sessionStorage.getItem('welcome_shown');
      
      if (!hasShownWelcome) {
        setTimeout(() => {
          toast.success(
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-sky-400" />
              <div>
                <div className="font-semibold">Xin chào, {user.name}!</div>
                <div className="text-sm text-slate-400">
                  Camera AI đang hoạt động và tự động phát hiện batch
                </div>
              </div>
            </div>,
            {
              duration: 4000,
            }
          );
          sessionStorage.setItem('welcome_shown', 'true');
        }, 500);
      }
    }
  }, [isAuthenticated, user]);

  return null;
}