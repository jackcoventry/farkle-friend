import localFont from "next/font/local";
import type { Metadata } from "next";
import { Providers } from "./providers";
import "@/styles/globals.css";

const dynaPuff = localFont({
  src: "./fonts/dynapuff-400.ttf",
  variable: "--font-dynapuff",
});

const kirangHaerang = localFont({
  src: "./fonts/kirang-haerang-400.ttf",
  weight: "400",
  variable: "--font-kirang-haerang",
});

const outfit = localFont({
  src: "./fonts/outfit-400.ttf",
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  description: "A client-side Farkle scorekeeper and dice game.",
  title: "Farkle Friend",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dynaPuff.variable} ${kirangHaerang.variable} ${outfit.variable}`}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
