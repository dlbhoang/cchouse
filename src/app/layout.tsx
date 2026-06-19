import type { Metadata } from "next";
import { SWRConfig } from "swr";
import { Toaster } from "@/components/ui/toaster";
import Meta from "@/lib/components/Meta";
import "@/lib/styles/globals.css";
import AuthProvider from "@/components/layouts/providers/auth-provider";

export const metadata: Metadata = {
  title: "Phần mềm quản trị - C.C.HOUSE",
  description: "Chào mừng bạn đến với phần mềm quản trị của C.C.HOUSE",
};

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Meta />
        <link
          href="https://fonts.googleapis.com/css2?family=Figtree:wght@300..900&display=swap"
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

        <script src="/assets/libs/tinymce/tinymce.min.js"></script>
      </head>
      <body>
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
