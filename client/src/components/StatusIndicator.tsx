/**
 * StatusIndicator Component
 * Shows online/offline status and PWA installation status
 */

import React, { useEffect, useState } from 'react';
import { Wifi, WifiOff, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StatusIndicatorProps {
  onInstallClick?: () => void;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  onInstallClick,
}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setCanInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  return (
    <div className="flex items-center gap-3">
      {/* Online/Offline status */}
      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100">
        {isOnline ? (
          <>
            <Wifi size={14} className="text-green-600" />
            <span className="text-xs font-medium text-green-600">Online</span>
          </>
        ) : (
          <>
            <WifiOff size={14} className="text-red-600" />
            <span className="text-xs font-medium text-red-600">Offline</span>
          </>
        )}
      </div>

      {/* Install button */}
      {canInstall && (
        <Button
          size="sm"
          variant="outline"
          onClick={onInstallClick}
          className="gap-2"
        >
          <Download size={14} />
          Instalar
        </Button>
      )}
    </div>
  );
};
