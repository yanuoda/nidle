const fs = require('fs')
const path = require('path')
const chalk = require('chalk')

function rewriteDeps(filePath, packageInfo, depsKey, val) {
  packageInfo[depsKey] = val
  fs.writeFileSync(filePath, JSON.stringify(packageInfo, null, 2))
}

function mergeAndDiff(oldDeps, newDeps) {
  const mergeDepsMap = JSON.parse(JSON.stringify(newDeps))
  const retainPlugins = []
  const oldDepsList = Object.entries(oldDeps)
  let isDiff = false

  for (const [oldDepKey, oldDepVal] of oldDepsList) {
    const newDepVal = newDeps[oldDepKey]
    if (!newDepVal && /^nidle-plugin/.test(oldDepKey)) {
      // 旧版项目存在不同于新项目的插件依赖，对于插件之外的依赖将不再保留
      isDiff = true
      retainPlugins.push(`${oldDepKey}@${oldDepVal}`)
      mergeDepsMap[oldDepKey] = oldDepVal
    } else if (newDepVal && newDepVal !== oldDepVal) {
      // 新旧依赖版本不同，以新版依赖为准
      isDiff = true
    }
  }

  if (retainPlugins.length > 0) {
    console.log(
      chalk.yellow(
        `
  nidle-web 旧版依赖的以下插件将被保留，如需升级插件版本，请更新完成后自行升级：\n${retainPlugins
    .map(plugin => `    - ${plugin}`)
    .join('\n')}\n`
      )
    )
  }

  return { isDiff, mergeDepsMap }
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

  // diff
  const { isDiff, mergeDepsMap } = mergeAndDiff(oldPackageInfo.dependencies, newPackageInfo.dependencies)
  if (isDiff) {
    // 有变化
    rewriteDeps(path.resolve(tempDir, 'package.json'), newPackageInfo, 'dependencies', mergeDepsMap)
  }
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

  // diff
  const { isDiff, mergeDepsMap } = mergeAndDiff(oldPackageInfo.devDependencies, newPackageInfo.devDependencies)
  if (isDiff) {
    // 有变化
    rewriteDeps(path.resolve(tempDir, 'package.json'), newPackageInfo, 'devDependencies', mergeDepsMap)
  }
  return isDiff
}

module.exports = {
  validateIfDepsUpdate,
  validateIfDevDepsUpdate
}
