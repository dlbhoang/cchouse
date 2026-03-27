// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

/** @type {import('next').NextConfig} */
module.exports = {
  swcMinify: true,
  reactStrictMode: true,
  output: 'standalone',
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'batdongsan.blob.core.windows.net',
        port: '',
        pathname: '/cchouse/**',
      },
    ],
  },
  transpilePackages: [
    // antd & deps
    '@ant-design',
    '@rc-component',
    'antd',
    'rc-cascader',
    'rc-checkbox',
    'rc-collapse',
    'rc-dialog',
    'rc-drawer',
    'rc-dropdown',
    'rc-field-form',
    'rc-image',
    'rc-input',
    'rc-input-number',
    'rc-mentions',
    'rc-menu',
    'rc-motion',
    'rc-notification',
    'rc-pagination',
    'rc-picker',
    'rc-progress',
    'rc-rate',
    'rc-resize-observer',
    'rc-segmented',
    'rc-select',
    'rc-slider',
    'rc-steps',
    'rc-switch',
    'rc-table',
    'rc-tabs',
    'rc-textarea',
    'rc-tooltip',
    'rc-tree',
    'rc-tree-select',
    'rc-upload',
    'rc-util',
  ],
};
// module.exports = withPWA(
//   {
//     swcMinify: true,
//     reactStrictMode: true,
//     eslint: {
//       dirs: ["src"],
//       // Warning: This allows production builds to successfully complete even if
//       // your project has ESLint errors.
//       // ignoreDuringBuilds: true,
//     },
//     // compiler:{
//     //   removeConsole: true,
//     // },
//     images: {
//       unoptimized: true,
//       remotePatterns: [
//         {
//           protocol: 'https',
//           hostname: 'batdongsan.blob.core.windows.net',
//           port: '',
//           pathname: '/cchouse/**',
//         },
//       ],
//     },
//   }

// );
