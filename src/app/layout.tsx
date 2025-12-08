"use client";

import { ModalStackProvider } from "@/components/Modal/ModalStackContext";
import "@/styles/globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Kirang+Haerang&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ModalStackProvider>{children}</ModalStackProvider>
      </body>
    </html>
  );
}
