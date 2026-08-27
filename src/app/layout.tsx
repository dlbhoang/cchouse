import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { SWRConfig } from "swr";
import { Toaster } from "@/components/ui/toaster";
import "@/lib/styles/globals.css";
import AuthProvider from "@/components/layouts/providers/auth-provider";
import ChunkErrorHandler from "@/components/chunk-error-handler";

const APP_NAME = "cchouse";

export const metadata: Metadata = {
  title: "Phần mềm quản trị - C.C.HOUSE",
  description: "Chào mừng bạn đến với phần mềm quản trị của C.C.HOUSE",
  applicationName: APP_NAME,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_NAME,
  },
  formatDetection: {
    telephone: false,
  },
  manifest: "/manifest.json",
  icons: {
    shortcut: "/logo.png",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Figtree:wght@300..900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300..900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/@fontsource/geist-mono@5.2.5/400.css"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/@fontsource/geist-mono@5.2.5/600.css"
          rel="stylesheet"
        />
      </head>
      <body>
        <ChunkErrorHandler />

        <Script
          src="/assets/libs/tinymce/tinymce.min.js"
          strategy="beforeInteractive"
        />

        <SWRConfig>
          <AuthProvider>
            {children}
            <Toaster expand position="top-center" richColors />
          </AuthProvider>
        </SWRConfig>
      </body>
    </html>
  );
}