/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './blog/.vitepress/theme/**/*.vue',
  ],
  safelist: ['toast-error-popup', 'toast-error-title', 'toast-error-close-btn'],
  theme: {
    container: {
      center: true,
      padding: '0.75rem',
    },
    extend: {
      colors: {
        primary: '#ac4142',
        'primary-dark': '#9b3b3a',
        'primary-light': '#db5654',
      },
      borderColor: {
        primary: '#ac4142',
      },
    },
  },
  variants: {},
  plugins: [
    require('@tailwindcss/typography'),
    function ({ addComponents }) {
      const newComponents = {
        h1: {
          '@apply mx-auto mt-5 mb-2 w-10/12 text-center text-2xl font-normal leading-normal text-black text-opacity-80 sm:mt-8 sm:w-full sm:text-3xl':
            {},
        },
        h2: {
          '@apply mt-8 mb-2 text-center text-2xl font-semibold leading-normal text-black text-opacity-80 sm:mb-3':
            {},
        },
        h3: {
          '@apply text-xl font-normal text-black text-opacity-80': {},
        },
        '.p': {
          '@apply mt-0 mb-1 text-base font-light leading-6 text-black text-opacity-90':
            {},
        },
        'a, .link': {
          '@apply cursor-pointer font-normal text-primary': {},
        },
        'a:hover, .link:hover': {
          '@apply text-primary-dark underline': {},
        },
        'a.primary-link': {
          '@apply font-normal text-white': {},
        },
        'a.primary-link:hover': {
          '@apply font-normal text-white underline': {},
        },
        '.chart-error': {
          '@apply my-32 text-center text-red-700': {},
        },
        '.chart-error-new': {
          '@apply flex h-5/6 items-center justify-center text-red-700': {},
        },
        '.toast-error-popup': {
          '@apply bg-red-500 py-3 text-white !important': {},
        },
        '.toast-error-title': {
          '@apply mr-8 font-normal text-white !important': {},
        },
        '.toast-error-close-btn': {
          '@apply static mr-1 text-2xl font-semibold leading-none text-white outline-none focus:shadow-none focus:outline-none !important':
            {},
        },
        '.tippy-content, .tippy-content p': {
          '@apply font-sans text-sm font-light leading-snug text-white': {},
        },
        '.tippy-content p.f-mono': {
          '@apply font-mono': {},
        },
        '.tippy-content a': {
          '@apply font-medium text-white underline': {},
        },
      };
      addComponents(newComponents);
    },
  ],
};
