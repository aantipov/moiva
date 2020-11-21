module.exports = {
  plugins: {
    tailwindcss: {
      purge: {
        enabled: false,
      },
    },
    'vue-cli-plugin-tailwind/purgecss': {},
    autoprefixer: {},
  },
  purge: {
    enabled: false,
  },
};
