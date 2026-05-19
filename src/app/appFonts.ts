import localFont from 'next/font/local';

const nunito = localFont({
  src: './fonts/Nunito-Medium.woff2',
  variable: '--font-nunito',
});

const outfit = localFont({
  src: './fonts/Outfit-Regular.woff2',
  variable: '--font-outfit',
});

export const appFontClassName = `${nunito.variable} ${outfit.variable}`;
