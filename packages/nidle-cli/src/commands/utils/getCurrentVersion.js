const path = require('path')

/**
 * 获取已安装版本
 * @param {String} rootPath nidle 安装根路径
 * @returns 已安装版本
 */
module.exports = function getCurrentVersion(rootPath) {
  const pkgInfo = require(path.resolve(rootPath, './nidle-web/package.json'))
  return pkgInfo.version
}
