import { useSystem } from '../contexts/SystemContext';
import { Camera, CameraOff, Brain, Wifi, WifiOff } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

export function SystemStatus() {
  const { isOnline, lastSync, cameraStatus, isDetecting } = useSystem();

  return (
    <div className="flex items-center gap-3 text-sm">
      {/* Network Status */}
      <div className="flex items-center gap-2">
        {isOnline ? (
          <>
            <div className="relative">
              <Wifi className="w-4 h-4 text-emerald-400" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50" />
            </div>
            <span className="text-slate-300 font-medium hidden lg:inline">Network</span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4 text-red-400" />
            <span className="text-slate-300 font-medium hidden lg:inline">Offline</span>
          </>
        )}
      </div>

      {/* Separator */}
      <div className="w-px h-4 bg-slate-600" />

      {/* Camera Status */}
      <div className="flex items-center gap-2">
        {cameraStatus === 'online' ? (
          <>
            <div className="relative">
              <Camera className="w-4 h-4 text-sky-400" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-sky-400 rounded-full animate-pulse shadow-lg shadow-sky-400/50" />
            </div>
            <span className="text-slate-300 font-medium hidden lg:inline">Camera</span>
          </>
        ) : (
          <>
            <CameraOff className="w-4 h-4 text-red-400" />
            <span className="text-slate-300 font-medium hidden lg:inline">Camera Offline</span>
          </>
        )}
      </div>

      {/* AI Detection Indicator */}
      {isDetecting && (
        <>
          <div className="w-px h-4 bg-slate-600" />
          <div className="flex items-center gap-2 px-3 py-1 bg-sky-400/20 backdrop-blur-sm rounded-full border border-sky-400/30 shadow-lg shadow-sky-400/20">
            <Brain className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
            <span className="text-sky-400 font-semibold text-xs">AI Detecting...</span>
          </div>
        </>
      )}

      {/* Last Sync */}
      {isOnline && lastSync && (
        <div className="text-slate-500 text-xs hidden xl:inline">
          {formatDistanceToNow(lastSync, { addSuffix: true, locale: vi })}
        </div>
      )}
    </div>
  );
}