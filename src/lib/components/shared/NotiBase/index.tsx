import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

interface NotiOptions {
  type: NotificationType;
  message: string;
  description?: string;
  callback?: () => void;
  duration?: number; // ms, mặc định 4000
}

// Container singleton
let container: HTMLElement | null = null;
let activeRoot: ReturnType<typeof createRoot> | null = null;

function getContainer() {
  if (!container) {
    container = document.createElement('div');
    container.style.cssText = `
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      z-index: 9999; width: 460px; max-width: calc(100vw - 32px); pointer-events: none;
    `;
    document.body.appendChild(container);
    activeRoot = createRoot(container);
  }
  return activeRoot!;
}

function Icon({ type }: { type: NotificationType }) {
  const common = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none' };
  switch (type) {
    case 'success':
      return (
        <svg {...common}>
          <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'error':
      return (
        <svg {...common}>
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'warning':
      return (
        <svg {...common}>
          <path d="M12 9v4m0 4h.01M10.29 3.86l-8.18 14.18A1 1 0 003 19.5h18a1 1 0 00.89-1.46L13.71 3.86a1 1 0 00-1.72 0z"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'info':
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          <path d="M12 11v5m0-8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
  }
}

const palette: Record<NotificationType, {
  accent: string;
  iconBg: string;
  iconColor: string;
  btnColor: string;
  btnBorder: string;
  btnBg: string;
}> = {
  success: {
    accent: '#22c55e',
    iconBg: 'rgba(34,197,94,0.12)',
    iconColor: '#16a34a',
    btnColor: '#15803d',
    btnBorder: 'rgba(34,197,94,0.35)',
    btnBg: 'rgba(34,197,94,0.08)',
  },
  info: {
    accent: '#3b82f6',
    iconBg: 'rgba(59,130,246,0.12)',
    iconColor: '#2563eb',
    btnColor: '#1d4ed8',
    btnBorder: 'rgba(59,130,246,0.35)',
    btnBg: 'rgba(59,130,246,0.08)',
  },
  warning: {
    accent: '#f59e0b',
    iconBg: 'rgba(245,158,11,0.12)',
    iconColor: '#d97706',
    btnColor: '#b45309',
    btnBorder: 'rgba(245,158,11,0.35)',
    btnBg: 'rgba(245,158,11,0.08)',
  },
  error: {
    accent: '#ef4444',
    iconBg: 'rgba(239,68,68,0.12)',
    iconColor: '#dc2626',
    btnColor: '#b91c1c',
    btnBorder: 'rgba(239,68,68,0.35)',
    btnBg: 'rgba(239,68,68,0.08)',
  },
};

function NotiItem({ opts, onClose }: { opts: NotiOptions; onClose: () => void }) {
  const duration = opts.duration ?? 4000;
  const c = palette[opts.type];

  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        pointerEvents: 'all',
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 14,
        padding: '18px 20px 18px 18px',
        borderRadius: 14,
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(14px) saturate(180%)',
        WebkitBackdropFilter: 'blur(14px) saturate(180%)',
        border: '1px solid rgba(0,0,0,0.06)',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 12px 32px -8px rgba(0,0,0,0.18)',
        overflow: 'hidden',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        animation: 'notiPopIn 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          background: c.accent,
        }}
      />

      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          background: c.iconBg,
          color: c.iconColor,
          marginLeft: 4,
        }}
      >
        <Icon type={opts.type} />
      </div>

      <div style={{ flex: 1, minWidth: 0, paddingTop: 2 }}>
        <div style={{ fontSize: 15.5, fontWeight: 600, lineHeight: 1.45, color: '#1a1a1a', letterSpacing: '-0.01em' }}>
          {opts.message}
        </div>
        {opts.description && (
          <div style={{ fontSize: 13.5, marginTop: 4, color: '#6b7280', lineHeight: 1.5 }}>
            {opts.description}
          </div>
        )}
        {opts.callback && (
          <div style={{ marginTop: 12 }}>
            <button
              onClick={opts.callback}
              style={{
                fontSize: 13,
                fontWeight: 600,
                padding: '6px 14px',
                borderRadius: 8,
                cursor: 'pointer',
                border: `1px solid ${c.btnBorder}`,
                background: c.btnBg,
                color: c.btnColor,
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = c.btnBorder)}
              onMouseLeave={(e) => (e.currentTarget.style.background = c.btnBg)}
            >
              Xem thông tin
            </button>
          </div>
        )}
      </div>

      <button
        onClick={onClose}
        aria-label="Đóng"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          flexShrink: 0,
          padding: 4,
          marginTop: -2,
          marginRight: -6,
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#9ca3af',
          transition: 'background 0.15s ease, color 0.15s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(0,0,0,0.06)';
          e.currentTarget.style.color = '#374151';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = '#9ca3af';
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        style={{
          position: 'absolute',
          left: 4,
          right: 0,
          bottom: 0,
          height: 2.5,
          background: c.accent,
          opacity: 0.35,
          animation: `notiShrink ${duration}ms linear forwards`,
          transformOrigin: 'left',
        }}
      />
    </div>
  );
}

if (typeof document !== 'undefined' && !document.getElementById('noti-base-keyframes')) {
  const style = document.createElement('style');
  style.id = 'noti-base-keyframes';
  style.textContent = `
    @keyframes notiPopIn {
      from { opacity: 0; transform: translateY(-8px) scale(0.94); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes notiShrink {
      from { transform: scaleX(1); }
      to   { transform: scaleX(0); }
    }
  `;
  document.head.appendChild(style);
}

import { toast } from 'sonner';


// Giữ nguyên chữ ký cũ để không phải sửa các nơi đang gọi NotiBase(...)
export const NotiBase = (
  type: NotificationType,
  message: string,
  callback?: () => void,
  description?: string
) => {
  const options = {
    description,
    duration: 4000,
    action: callback
      ? {
          label: 'Xem thông tin',
          onClick: callback,
        }
      : undefined,
  };

  switch (type) {
    case 'success':
      toast.success(message, options);
      break;
    case 'error':
      toast.error(message, options);
      break;
    case 'warning':
      toast.warning(message, options);
      break;
    case 'info':
    default:
      toast.info(message, options);
      break;
  }
};