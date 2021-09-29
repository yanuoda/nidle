module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:node/recommended',
    'plugin:prettier/recommended'
  ],
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
    'react/prop-types': 0, //防止在react组件定义中缺少props验证
    'no-useless-catch': 0
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
}
