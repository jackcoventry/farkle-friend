import '@/styles/globals.css';
import { appFontClassName } from './appFonts';
import { metadata } from './appMetadata';
import { Providers } from './providers';

export { metadata };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={appFontClassName}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
