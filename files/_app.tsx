import React, { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';

// Import styles - Order is important!
import '@/styles/globals.css';
import 'antd/dist/reset.css';

/**
 * Custom Ant Design Theme Configuration
 * Matches the PropAddEdit component design
 */
const antdTheme = {
  token: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
    colorPrimary: '#fa8c16',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1890ff',
    colorTextBase: '#000000',
    borderRadius: 8,
    fontSize: 14,
    lineHeight: 1.5,
  },
  components: {
    Button: {
      borderRadius: 8,
      fontWeight: 600,
    },
    Input: {
      borderRadius: 8,
      controlHeight: 36,
    },
    Select: {
      borderRadius: 8,
      controlHeight: 36,
    },
    DatePicker: {
      borderRadius: 8,
      controlHeight: 36,
    },
    Card: {
      borderRadius: 12,
      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
    },
  },
};

/**
 * App Component Wrapper
 * Sets up Ant Design theme and locale
 */
export default function App({ Component, pageProps }: AppProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <ConfigProvider theme={antdTheme} locale={viVN}>
      <Component {...pageProps} />
    </ConfigProvider>
  );
}
