module.exports = {
  base: '/blog/',
  lang: 'en-US',
  title: 'Moiva.io Blog',
  head: [
    [
      'link',
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon/favicon.ico',
      },
    ],
    [
      'meta',
      {
        name: 'copyright',
        content: '2020-current, Alexey Antipov',
      },
    ],
    [
      'meta',
      {
        name: 'twitter:creator',
        content: '@_aantipov',
      },
    ],
    [
      'meta',
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
    ],
    [
      'script',
      {
        async: true,
        defer: true,
        'data-domain': 'moiva.io',
        src: 'https://plausible.io/js/plausible.js',
      },
    ],
  ],
};
