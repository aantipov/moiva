module.exports = {
  plugins: [
    require.resolve('prettier-plugin-astro'),
    require.resolve('prettier-plugin-tailwindcss'),
  ],
  singleQuote: true,
  overrides: [
    {
      files: 'public/index.html',
      options: {
        printWidth: 200,
      },
    },
    {
      files: '*.json',
      options: {
        printWidth: 120,
      },
    },
    {
      files: 'src/data/readings.json',
      options: {
        printWidth: 200,
      },
    },
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
};
