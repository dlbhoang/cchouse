'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner, ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      richColors
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast rounded-2xl border shadow-xl backdrop-blur-md',
          title: 'font-semibold',
          description: 'opacity-80',
          actionButton: 'rounded-lg font-semibold',
          cancelButton: 'rounded-lg',
          icon: 'flex items-center justify-center',
        },
        style: {
          fontSize: '15px',
          padding: '18px 20px',
          gap: '14px',
          minWidth: '380px',
          maxWidth: '460px',
        },
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': '16px',
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };