import localFont from 'next/font/local';

const outfit = localFont({
  src: './fonts/Outfit-Regular.woff2',
  variable: '--font-outfit',
});

export const appFontClassName = `${outfit.variable}`;
