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
  async getByApp({ projectUrl, mode, branch }) {
    const { ctx } = this
    const fileName = `nidle.${mode}.config.json`

    try {
      const config = await ctx.service.gitlab.getFile(projectUrl, branch, fileName)
      let templateConfig = {}

      if (config.extend) {
        templateConfig = require(`../mock/config/tmp-${config.extend}`)
      }

      // 合并模板
      if (config.extend && !_.isEmpty(templateConfig)) {
        return extend(true, {}, templateConfig, config)
      }

      return config
    } catch (err) {
      if (err.message === '404 File Not Found') {
        return ''
      }

      throw err
    }
  }

  // 发布时获取对应环境配置
  async getByCreate(project, mode, branch, fileName) {
    const { ctx } = this

    try {
      const nidleConfig = ctx.app.config.nidle
      const config = await this.getByApp({
        projectUrl: project.repositoryUrl,
        mode,
        branch
      })

      if (!config) {
        return ''
      }

      if (mode === nidleConfig.environments[0].value) {
        // 处理细节output
        config.source = path.resolve(nidleConfig.source, config.source || config.name, fileName)

        if (config.output) {
          config.output.path = path.resolve(nidleConfig.output.path, config.output.path || config.name, fileName)

          if (config.output.backup) {
            config.output.backup = {
              ...config.output.backup,
              path: path.resolve(nidleConfig.output.backup.path, config.output.backup.path || config.name)
            }
          } else {
            config.output.backup = {
              path: path.resolve(nidleConfig.output.backup.path, config.name)
            }
          }
        } else {
          config.output = {
            path: path.resolve(nidleConfig.output.path, config.name, fileName),
            backup: {
              path: path.resolve(nidleConfig.output.backup.path, config.name)
            }
          }
        }
      }

      // 处理细节log
      let logPath

      if (config.log) {
        logPath = path.resolve(nidleConfig.log.path, config.log.path || config.name)
      } else {
        logPath = path.resolve(nidleConfig.log.path, config.name)
      }

      config.log = {
        ...config.log,
        path: logPath,
        all: path.join(logPath, `all_${mode}_${fileName}.log`),
        error: path.join(logPath, `error_${mode}_${fileName}.log`)
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
    } catch (err) {
      throw err
    }
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
      const result = inputParse.parse(input)

      return result
    } catch (err) {
      throw err
    }
  }

  async setInput({ values, groups }) {
    try {
      const result = inputParse.transform(values, groups)
      console.log('input values::: ', result)

      return true
    } catch (err) {
      throw err
    }
  }
}

module.exports = ConfigService
