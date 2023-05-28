module.exports = {
  root: true,
  env: {
    es2020: true,
    browser: true,
    node: true,
  },
  parser: 'vue-eslint-parser',
  plugins: ['vue', '@typescript-eslint'],
  extends: [
    'eslint:recommended',
    '@vue/typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended',
    'prettier',
  ],
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  rules: {
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    'no-sparse-arrays': 'off',
    'no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
      },
    ],
    'vue/script-setup-uses-vars': 'error',
  },
  globals: {
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
    withDefaults: 'readonly',
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/*.spec.{j,t}s?(x)',
        'src/main.spec.ts',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {},
    },
  ],
};
