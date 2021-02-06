module.exports = {
  purge: {
    content: ['./public/**/*.html', './src/**/*.vue'],
  },
  theme: {
    extend: {
      colors: {
        primary: '#ac4142',
        'primary-dark': '#9b3b3a',
      },
      borderColor: {
        primary: '#ac4142',
      },
    },
  },
  variants: {},
  plugins: [],
};
