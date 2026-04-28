import { DynaPuff, Kirang_Haerang, Outfit } from "next/font/google";
import { Providers } from "./providers";
import "@/styles/globals.css";

const dynaPuff = DynaPuff({
  subsets: ["latin"],
  variable: "--font-dynapuff",
});

const kirangHaerang = Kirang_Haerang({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-kirang-haerang",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

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
