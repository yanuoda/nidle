import resolve from 'rollup-plugin-node-resolve'

export default {
  input: './index.js',
  output: {
    file: './dist/index.js',
    format: 'cjs',
    name: 'NidlePluginEscheck'
  },
  plugins: [resolve()],
  external: ['execa', 'es-check-format']
}
