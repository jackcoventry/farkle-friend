import '@/styles/globals.css';
import { appFontClassName } from './appFonts';
import { metadata } from './appMetadata';
import { Providers } from './providers';

export { metadata };

const themeBootstrapScript = `
(() => {
  try {
    const raw = window.localStorage.getItem('farkle-friend-settings');
    if (!raw) return;

    const preferences = JSON.parse(raw)?.preferences;
    const theme = preferences?.theme;
    const motionEnabled = preferences?.motionEnabled;
    const root = document.documentElement;

    if (theme === 'light' || theme === 'dark') {
      root.dataset.theme = theme;
    }

    if (typeof motionEnabled === 'boolean') {
      root.dataset.motion = motionEnabled ? 'on' : 'off';
    }
  } catch {
    // Ignore invalid or unavailable storage; React will apply defaults after hydration.
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
        <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
