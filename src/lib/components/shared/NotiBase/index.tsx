import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

interface NotiOptions {
  type: NotificationType;
  message: string;
  description?: string;
  callback?: () => void;
  duration?: number; // ms, mặc định 3200
}

const ICONS: Record<NotificationType, string> = {
  success: '✓',
  info: 'i',
  warning: '!',
  error: '✕',
};

// Container singleton
let container: HTMLElement | null = null;
let activeRoot: ReturnType<typeof createRoot> | null = null;

function getContainer() {
  if (!container) {
    container = document.createElement('div');
    container.style.cssText = `
      position: fixed; top: 1rem; left: 50%; transform: translateX(-50%);
      z-index: 9999; width: 360px; pointer-events: none;
    `;
    document.body.appendChild(container);
    activeRoot = createRoot(container);
  }
  return activeRoot!;
}

function NotiItem({ opts, onClose }: { opts: NotiOptions; onClose: () => void }) {
  const progressRef = useRef<HTMLDivElement>(null);
  const duration = opts.duration ?? 3200;

  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      pointerEvents: 'all',
      display: 'flex', alignItems: 'flex-start', gap: 10,
      padding: '12px 14px',
      borderRadius: 12,
      background: 'var(--color-bg, #fff)',
      border: '0.5px solid rgba(0,0,0,0.12)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      marginBottom: 8,
      animation: 'notiSlideIn 0.22s cubic-bezier(0.22,1,0.36,1)',
    }}>
      {/* Icon */}
      <div style={{
        width: 28, height: 28, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, fontSize: 14, fontWeight: 600,
        ...colorMap[opts.type].icon,
      }}>
        {ICONS[opts.type]}
      </div>

      {/* Body */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.4 }}>
          {opts.message}
        </div>
        {opts.description && (
          <div style={{ fontSize: 12, marginTop: 2, opacity: 0.65, lineHeight: 1.5 }}>
            {opts.description}
          </div>
        )}
        {opts.callback && (
          <div style={{ marginTop: 8 }}>
            <button
              onClick={opts.callback}
              style={{
                fontSize: 12, fontWeight: 500,
                padding: '4px 10px',
                borderRadius: 6, cursor: 'pointer',
                border: '0.5px solid', background: 'transparent',
                ...colorMap[opts.type].btn,
              }}
            >
              Xem thông tin
            </button>
          </div>
        )}
        {/* Progress bar */}
        <div style={{
          height: 2, borderRadius: 1, marginTop: 8,
          animation: `notiShrink ${duration}ms linear forwards`,
          ...colorMap[opts.type].progress,
        }} />
      </div>

      {/* Close */}
      <button
        onClick={onClose}
        aria-label="Đóng"
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 16, color: '#999', flexShrink: 0, padding: 0,
          display: 'flex', alignItems: 'center',
        }}
      >
        ✕
      </button>
    </div>
  );
}

const colorMap: Record<NotificationType, {
  icon: React.CSSProperties;
  btn: React.CSSProperties;
  progress: React.CSSProperties;
}> = {
  success: {
    icon:     { background: '#f0fdf4', color: '#16a34a' },
    btn:      { color: '#16a34a', borderColor: '#86efac' },
    progress: { background: '#86efac' },
  },
  info: {
    icon:     { background: '#eff6ff', color: '#2563eb' },
    btn:      { color: '#2563eb', borderColor: '#93c5fd' },
    progress: { background: '#93c5fd' },
  },
  warning: {
    icon:     { background: '#fffbeb', color: '#d97706' },
    btn:      { color: '#d97706', borderColor: '#fcd34d' },
    progress: { background: '#fcd34d' },
  },
  error: {
    icon:     { background: '#fef2f2', color: '#dc2626' },
    btn:      { color: '#dc2626', borderColor: '#fca5a5' },
    progress: { background: '#fca5a5' },
  },
};

// Inject keyframes once
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes notiSlideIn {
      from { opacity: 0; transform: translateY(-10px) scale(0.96); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes notiShrink {
      from { width: 100%; }
      to   { width: 0%; }
    }
  `;
  document.head.appendChild(style);
}

// Public API — thay thế NotiBase cũ
export const NotiBase = (
  type: NotificationType,
  message: string,
  callback?: () => void,
  description?: string
) => {
  const root = getContainer();
  const handleClose = () => root.render(<></>);

  root.render(
    <NotiItem
      opts={{ type, message, description, callback }}
      onClose={handleClose}
    />
  );
};