'use strict'

// 配置信息
const path = require('path')
const Service = require('egg').Service
const extend = require('extend')
const _ = require('lodash')
const NildeChain = require('nidle-chain')
const inputParse = require('../../lib/inquirer')

class ConfigService extends Service {
  // 获取应用对应环境配置
  async getByApp({ name, mode }) {
    // TODO: 通过name获取gitlab仓库
    const config = require(`../mock/config/${name}.${mode}`)

    // TODO: 获取应用指定mode配置

    // TODO: 有extend就获取模板
    let templateConfig = {}

    if (config.extend) {
      templateConfig = require(`../mock/config/${config.extend}`)
    }

    // 合并模板
    if (config.extend && !_.isEmpty(templateConfig)) {
      return extend(true, {}, templateConfig, config)
    }

    return config
  }

  // 发布时获取对应环境配置
  async getByCreate({ name, mode, changelogId }) {
    const config = await this.getByApp({
      name,
      mode
    })

    // 处理细节log/output
    const fileName = `${name}_${changelogId}`

    if (config.log) {
      const logPath = config.log.path
      config.log = {
        ...config.log,
        all: path.join(logPath, `${fileName}.all.log`),
        error: path.join(logPath, `${fileName}.error.log`)
      }
    }

    if (config.output) {
      if (config.output.backup) {
        config.output.backup = {
          ...config.output.backup,
          path: path.join(config.output.backup.path, `${fileName}_backup`)
        }
      }

      if (config.output.cache) {
        config.output.cache = {
          ...config.output.cache,
          path: path.join(config.output.cache.path, `${fileName}_cache`)
        }
      }
    }

    // 有chain，处理chain
    if (config.chain && _.isFunction(config.chain)) {
      const chainFun = config.chain
      delete config.chain

      const newConfig = new NildeChain()
      newConfig.merge(config)

      chainFun(newConfig)

      return newConfig.toConfig()
    }

    return config
  }

  // 获取发布记录对应配置
  async getById(changelogId) {
    // TODO: 获取路径

    // 通过路径查找配置文件
    return changelogId
  }

  // 获取配置
  async getInput({ id, source = 'WEB' }) {
    const inputs = require('../mock/config/input')
    const input = inputs[id]

    if (source === 'CLI') {
      return input
    }

    try {
      const result = inputParse(input)

      return result
    } catch (err) {
      throw err
    }
  }
}

module.exports = ConfigService
