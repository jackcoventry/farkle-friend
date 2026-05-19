'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (!('serviceWorker' in navigator) || !window.isSecureContext) return;

    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Service worker registration should never block the game.
    });
  }, []);

  return null;
}
