import path from 'path'
import execa from 'execa'

/**
 * 压缩input目录，并且以目录名命名放到output目录
 * 覆盖目标文件
 * @param {String} input 要压缩的目录
 * @param {String} output 输出目标目录
 * @param {Boolean} isRemove 是否移除原文件
 * @param {String} extname 扩展名
 * @returns Promise
 */
export const compress = function (input, output = '.', isRemove = false, extname = '.tgz') {
  return new Promise((resolve, reject) => {
    const basename = path.basename(input)
    let shell = `cd ${path.dirname(input)} && tar -zcpf ${output}/${basename}${extname} ./${basename}`

    if (isRemove) {
      shell += ` && rm -rf ${input}`
    }

    execa(shell, {
      shell: true
    })
      .then(() => {
        resolve()
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * 解压input目录，放到output目录
 * 覆盖目标文件
 * @param {String} input 要解缩的目录
 * @param {String} output 输出目标目录
 * @param {Boolean} isRemove 是否移除原文件
 * @returns Promise
 */
export const decompress = function (input, output = '.', isRemove = false) {
  return new Promise((resolve, reject) => {
    let shell = `tar -zxpf ${input} -C ${path.dirname(output)}`

    if (isRemove) {
      shell += ` && rm -rf ${input}`
    }

    execa(shell, {
      shell: true
    })
      .then(() => {
        resolve()
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * 拷贝input目录，并且以目录名命名放到output目录
 * 覆盖目标文件
 * @param {String} input 要拷贝的目录
 * @param {String} output 输出目标目录
 * @param {Boolean} isRemove 是否移除原文件
 * @returns Promise
 */
export const copy = function (input, output = '.', isRemove = false) {
  return new Promise((resolve, reject) => {
    let shell = `cp -rpf ${input} ${output}`

    if (isRemove) {
      shell += ` && rm -rf ${input}`
    }

    execa(shell, {
      shell: true
    })
      .then(() => {
        resolve()
      })
      .catch(err => {
        reject(err)
      })
  })
}
