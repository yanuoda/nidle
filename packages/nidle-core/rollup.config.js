import resolve from 'rollup-plugin-node-resolve'

export default {
  input: './index.js',
  output: {
    file: './dist/index.js',
    format: 'cjs',
    name: 'NidleCore'
  },
  plugins: [resolve()],
  external: ['execa', 'extend', 'eventemitter3', 'p-retry', 'p-timeout', 'pino']
}
