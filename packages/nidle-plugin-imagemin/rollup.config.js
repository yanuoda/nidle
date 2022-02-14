import resolve from 'rollup-plugin-node-resolve'

export default {
  input: './index.js',
  output: {
    file: './dist/index.js',
    format: 'cjs',
    name: 'NidlePluginImagemin'
  },
  plugins: [resolve()],
  external: ['imagemin', 'imagemin-gifsicle', 'imagemin-mozjpeg', 'imagemin-pngquant', 'imagemin-svgo']
}
