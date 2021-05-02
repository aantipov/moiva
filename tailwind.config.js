module.exports = {
  purge: {
    content: ['./index.html', './src/**/*.vue'],
  },
  theme: {
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
  plugins: [],
};
