import postcssGlobalData from '@csstools/postcss-global-data';
import customMedia from 'postcss-custom-media';

const config = {
  plugins: [
    postcssGlobalData({
      files: ['./src/styles/breakpoints.css'],
    }),
    customMedia(),
    '@tailwindcss/postcss',
  ],
};

export default config;
