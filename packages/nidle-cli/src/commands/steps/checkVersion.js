const path = require('path')
const semver = require('semver')
const { version, Logger } = require('../utils')

module.exports = function checkVersion(outPath) {
  const logger = new Logger('检查本地 nidle-cli 的版本是否满足安装条件')
  const packageInfo = require(path.resolve(outPath, './nidle-web/package.json'))
  const { version: currentVersion, nidleCli } = packageInfo
  const isSatisfies = semver.satisfies(version, nidleCli?.version)

  if (isSatisfies) {
    logger.success()
    return true
  } else {
    logger.error(
      `安装 nidle@${currentVersion} 需要依赖 nidle-cli@${nidleCli?.version}，本地安装的版本为 nidle-cli@${version}，请升级后重试！`
    )
  }
}
