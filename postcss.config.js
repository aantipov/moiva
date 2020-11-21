module.exports = {
  plugins: {
    tailwindcss: {
      purge: {
        enabled: false,
      },
    },
    'vue-cli-plugin-tailwind/purgecss': {
      enabled: false,
      purge: {
        enabled: false,
      },
    },
    autoprefixer: {},
  },
  purge: {
    enabled: false,
  },
};
