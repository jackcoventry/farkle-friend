import localFont from "next/font/local";
import type { Metadata } from "next";
import { Providers } from "./providers";
import "@/styles/globals.css";

const Nunito = localFont({
  src: "./fonts/Nunito-Medium.woff2",
  variable: "--font-nunito",
});

const Outfit = localFont({
  src: "./fonts/Outfit-Regular.woff2",
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  applicationName: "Farkle Friend",
  authors: [{ name: "Farkle Friend" }],
  description: "A client-side Farkle scorekeeper and dice game.",
  icons: {
    icon: "/dice.svg",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    description: "A client-side Farkle scorekeeper and dice game.",
    siteName: "Farkle Friend",
    title: "Farkle Friend",
    type: "website",
  },
  title: {
    default: "Farkle Friend",
    template: "%s | Farkle Friend",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${Nunito.variable} ${Outfit.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
