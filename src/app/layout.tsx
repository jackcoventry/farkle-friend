import { Analytics } from '@vercel/analytics/next';
import Script from 'next/script';
import '@/styles/globals.css';
import { appFontClassName } from './appFonts';
import { Providers } from './providers';

export { metadata } from './appMetadata';

const themeBootstrapScript = `
(() => {
  const root = document.documentElement;

  try {
    const systemTheme = window.matchMedia('(prefers-color-scheme: light)').matches
      ? 'light'
      : 'dark';
    root.dataset.systemTheme = systemTheme;

    const raw = window.localStorage.getItem('farkle-friend-settings');
    if (!raw) return;

    const storedSettings = JSON.parse(raw);
    const preferences = storedSettings && storedSettings.preferences;
    const theme = preferences && preferences.theme;
    const motionEnabled = preferences && preferences.motionEnabled;

    if (theme === 'light' || theme === 'dark') {
      root.dataset.theme = theme;
    }

    if (typeof motionEnabled === 'boolean') {
      root.dataset.motion = motionEnabled ? 'on' : 'off';
    }
  } catch (error) {
    // Ignore invalid or unavailable storage; React will apply defaults after hydration.
  } finally {
    root.dataset.themeReady = 'true';
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={appFontClassName}
      suppressHydrationWarning
    >
      <head>
        <Script
          id="theme-bootstrap"
          strategy="beforeInteractive"
          // Fixed inline bootstrap only reads localStorage and media state to avoid theme flash.
          dangerouslySetInnerHTML={{ __html: themeBootstrapScript }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
        {process.env.VERCEL_ENV === 'production' ? <Analytics /> : null}
      </body>
    </html>
  );
}
