const fs = require('fs')
const path = require('path')
const chalk = require('chalk')

/**
 * 判断依赖是否有更新
 * @param {Object} oldDeps 旧版依赖项
 * @param {*} mergeDeps 合并后的依赖项
 * @returns 依赖项是否有更新
 */
function diff(oldDeps, mergeDeps) {
  const oldDepsList = Object.entries(oldDeps)
  const mergeDepsList = Object.entries(mergeDeps)

  if (oldDepsList.length !== mergeDepsList.length) {
    return true
  }

  for (const [mergeDepKey, mergeDepVal] of mergeDepsList) {
    const oldDepVal = oldDeps[mergeDepKey]
    if (!oldDepVal || oldDepVal !== mergeDepVal) {
      return true
    }
  }

  return false
}

/**
 * 新旧版本依赖 merge
 * @param {Object} oldDeps 旧版依赖项
 * @param {Object} newDeps 新版依赖项
 * @returns 新旧版本依赖合并后的结果
 */
function merge(oldDeps, newDeps) {
  const mergeDepsMap = JSON.parse(JSON.stringify(newDeps))
  const retainPlugins = []
  const oldDepsList = Object.entries(oldDeps)

  for (const [oldDepKey, oldDepVal] of oldDepsList) {
    const newDepVal = mergeDepsMap[oldDepKey]

    if (!newDepVal) {
      mergeDepsMap[oldDepKey] = oldDepVal
      if (/^nidle-plugin/.test(oldDepKey)) {
        // 旧版项目存在不同于新项目的插件依赖，对于插件之外的依赖将不再保留
        retainPlugins.push(`${oldDepKey}@${oldDepVal}`)
      }
    }
  }

  if (retainPlugins.length > 0) {
    console.log(
      chalk.yellow(
        `
  nidle-web 不存在于新版依赖的以下插件将被保留，如需升级插件版本，请更新完成后自行升级：\n${retainPlugins
    .map(plugin => `    - ${plugin}`)
    .join('\n')}\n`
      )
    )
  }

  return mergeDepsMap
}

/**
 * 重写 package.json 的依赖
 * @param {String} filePath package.json 的文件路径
 * @param {Object} packageInfo package.json 文件内容
 * @param {String} depsKey 依赖类型 key
 * @param {Object} val 依赖集合
 */
function rewriteDeps(filePath, packageInfo, depsKey, val) {
  packageInfo[depsKey] = val
  fs.writeFileSync(filePath, JSON.stringify(packageInfo, null, 2))
}

/**
 * 判断依赖项是否有更新
 * @param {String} oldDir 旧资源目录
 * @param {String} tempDir 更新资源目录
 * @returns deps 是否有更新
 */
function validateIfDepsUpdate(oldDir, tempDir) {
  const oldPackageInfo = require(path.resolve(oldDir, 'package.json'))
  const newPackageInfo = require(path.resolve(tempDir, 'package.json'))

  // merge and diff
  const mergeDepsMap = merge(oldPackageInfo.dependencies, newPackageInfo.dependencies)
  const isDiff = diff(oldPackageInfo.dependencies, mergeDepsMap)
  // 无论是否需要重装依赖，都将 merge 后的依赖重写入新版 package.json
  rewriteDeps(path.resolve(tempDir, 'package.json'), newPackageInfo, 'dependencies', mergeDepsMap)
  return isDiff
}

/**
 * 判断 dev 依赖项是否有更新
 * @param {String} oldDir 旧资源目录
 * @param {String} tempDir 更新资源目录
 * @returns deps 是否有更新
 */
function validateIfDevDepsUpdate(oldDir, tempDir) {
  const oldPackageInfo = require(path.resolve(oldDir, 'package.json'))
  const newPackageInfo = require(path.resolve(tempDir, 'package.json'))

  // merge and diff
  const mergeDepsMap = merge(oldPackageInfo.devDependencies, newPackageInfo.devDependencies)
  const isDiff = diff(oldPackageInfo.devDependencies, mergeDepsMap)
  // 无论是否需要重装依赖，都将 merge 后的依赖重写入新版 package.json
  rewriteDeps(path.resolve(tempDir, 'package.json'), newPackageInfo, 'devDependencies', mergeDepsMap)
  return isDiff
}

module.exports = {
  validateIfDepsUpdate,
  validateIfDevDepsUpdate
}
