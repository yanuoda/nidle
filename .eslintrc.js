module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:node/recommended', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: ['react', 'prettier'],
  rules: {
    'prettier/prettier': 2,
    'space-before-function-paren': 0,
    'node/no-unsupported-features/es-syntax': [2, { ignores: ['modules', 'dynamicImport'] }],
    'node/no-missing-import': 0,
    'constructor-super': 0,
    'no-this-before-super': 0,
    'no-useless-catch': 0
  }
}
