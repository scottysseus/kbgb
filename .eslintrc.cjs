module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'standard-with-typescript'
  ],
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint'
  ],
  parserOptions: { project: 'tsconfig.json' },
  rules: {
    'strict-boolean-expressions': 'off'
  }
}
