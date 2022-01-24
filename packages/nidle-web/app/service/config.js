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
  async getByApp({ id, mode, branch = 'master' }) {
    const { ctx } = this
    const fileName = `nidle.${mode}.config.json`

    try {
      const config = await ctx.service.gitlab.getFile(id, branch, fileName)
      let templateConfig = {}

      if (config.extend) {
        const template = await ctx.model.Template.findOne({ where: { name: config.extend } })

        if (template) {
          templateConfig = JSON.parse(template.config)
        }
      }

      // 合并模板
      if (config.extend && !_.isEmpty(templateConfig)) {
        return extend(true, {}, templateConfig, config)
      }

      return config
    } catch (err) {
      ctx.logger.error(`获取应用对应环境配置: \n${err.message}\n${err.stack}`)
      if (err.message === '404 File Not Found') {
        // 如果是文件没找到，说明该应用在此环境没有发布机器，特殊处理，不抛出错误
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
        id: project.gitlabId,
        mode,
        branch
      })

      if (!config) {
        // 没有配置，说明该应用在此环境没有发布机器
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
      ctx.logger.error(`发布时获取对应环境配置: \n${err.message}\n${err.stack}`)
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
  async getInput(inputs = [], values, source = 'web') {
    if (source === 'CLI') {
      return inputs
    }

    try {
      if (!inputs.length) {
        return inputs
      }

      return inputParse.parse(inputs, values)
    } catch (err) {
      this.ctx.logger.error(`getInput: \n${err.message}\n${err.stack}`)
      throw err
    }
  }

  async setInput(values, groups) {
    try {
      return inputParse.transform(values, groups)
    } catch (err) {
      this.ctx.logger.error(`setInput: \n${err.message}\n${err.stack}`)
      throw err
    }
  }
}

module.exports = ConfigService
