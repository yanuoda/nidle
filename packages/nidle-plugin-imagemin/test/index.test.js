import imagemin from '../lib/index.js'
import task from './fixtures/config.js'

imagemin(task, {
  source: 'imgage,img'
})
