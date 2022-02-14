import path from 'path'
import fs from 'fs'
import imagemin from 'imagemin'
import imageminJPG from 'imagemin-mozjpeg'
import imageminPNG from 'imagemin-pngquant'
import imageminGIF from 'imagemin-gifsicle'
import imageminSVG from 'imagemin-svgo'

const extname = '.{jpeg,jpg,png,gif,svg}'

function minimage(task, config = {}) {
  return new Promise((resolve, reject) => {
    const { output } = task
    let source
    const quality = config.quality || 75
    const destination = path.resolve(output.path, '.image-min')

    if (config.source && config.source.length) {
      source = config.source.split(/,\s?/).map(item => `${path.resolve(output.path, item)}/**/*${extname}`)
    } else {
      source = [`${output.path}/**/*${extname}`]
    }

    task.logger.info({
      name: 'imagemin',
      detail: `imagemin source direotry::\n${source.join('\n')}`
    })

    imagemin(source, {
      destination,
      plugins: [
        imageminJPG({
          quality
        }),
        imageminPNG(),
        imageminGIF(),
        imageminSVG()
      ]
    })
      .then(files => {
        files.forEach(file => {
          const sourceState = fs.statSync(file.sourcePath)
          const destinationState = fs.statSync(file.destinationPath)
          task.logger.info({
            name: 'imagemin',
            detail: `imagemin file:: ${file.sourcePath} size ${(sourceState.size / 1000).toFixed(2)}kb to ${(
              destinationState.size / 1000
            ).toFixed(2)}kb\n`
          })
          fs.copyFileSync(file.destinationPath, file.sourcePath)
        })
        fs.rmSync(destination, {
          force: true,
          recursive: true
        })
        resolve()
      })
      .catch(err => {
        reject(err)
      })
  })
}

export default minimage
