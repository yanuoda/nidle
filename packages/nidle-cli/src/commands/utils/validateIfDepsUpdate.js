const path = require('path')

function diff(oldDeps, newDeps) {
  const oldDepsList = Object.entries(oldDeps)
  const newDepsList = Object.entries(newDeps)

  if (oldDepsList.length !== newDepsList.length) {
    return true
  }

  for (const [oldDepKey, oldDepVal] of oldDepsList) {
    const newDepVal = newDeps[oldDepKey]
    if (!newDepVal || newDepVal !== oldDepVal) {
      return true
    }
  }

  return false
}

/**
 * 判断依赖项是否有更新
 * @param {String} oldDir 旧资源目录
 * @param {String} tempDir 更新资源目录
 * @returns deps 是否有更新
 */
function validateIfDepsUpdate(oldDir, tempDir) {
  const { dependencies: oldDeps } = require(path.resolve(oldDir, 'package.json'))
  const { dependencies: newDeps } = require(path.resolve(tempDir, 'package.json'))

  // diff
  return diff(oldDeps, newDeps)
}

/**
 * 判断 dev 依赖项是否有更新
 * @param {String} oldDir 旧资源目录
 * @param {String} tempDir 更新资源目录
 * @returns deps 是否有更新
 */
function validateIfDevDepsUpdate(oldDir, tempDir) {
  const { devDependencies: oldDeps } = require(path.resolve(oldDir, 'package.json'))
  const { devDependencies: newDeps } = require(path.resolve(tempDir, 'package.json'))

  // diff
  return diff(oldDeps, newDeps)
}

module.exports = {
  validateIfDepsUpdate,
  validateIfDevDepsUpdate
}
