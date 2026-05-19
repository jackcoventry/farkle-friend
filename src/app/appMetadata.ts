import type { Metadata } from 'next';

export const metadata: Metadata = {
  applicationName: 'Farkle Friend',
  authors: [{ name: 'Farkle Friend' }],
  description: 'A client-side Farkle scorekeeper and dice game.',
  icons: {
    icon: '/dice.svg',
  },
  manifest: '/manifest.webmanifest',
  openGraph: {
    description: 'A client-side Farkle scorekeeper and dice game.',
    siteName: 'Farkle Friend',
    title: 'Farkle Friend',
    type: 'website',
  },
  title: {
    default: 'Farkle Friend',
    template: '%s | Farkle Friend',
  },
};
