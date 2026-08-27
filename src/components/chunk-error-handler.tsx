'use client';

import { useEffect } from 'react';

export default function ChunkErrorHandler() {
  useEffect(() => {
    const RELOAD_KEY = 'chunk_reload_attempted';

    const reloadOnce = () => {
      if (!sessionStorage.getItem(RELOAD_KEY)) {
        sessionStorage.setItem(RELOAD_KEY, '1');
        window.location.reload();
      }
    };

    const onError = (e: ErrorEvent) => {
      if (
        e.message?.includes('Loading chunk') ||
        e.message?.includes('ChunkLoadError')
      ) {
        reloadOnce();
      }
    };

    const onRejection = (e: PromiseRejectionEvent) => {
      const reason = String(e.reason?.message ?? e.reason ?? '');
      if (reason.includes('Loading chunk') || reason.includes('ChunkLoadError')) {
        reloadOnce();
      }
    };

    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);

    // Trang load thành công -> reset cờ để lần sau vẫn có thể reload nếu cần
    sessionStorage.removeItem(RELOAD_KEY);

    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onRejection);
    };
  }, []);

  return null;
}