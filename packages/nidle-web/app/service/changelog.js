'use strict'

// 发布记录
const fs = require('fs')
const path = require('path')
const Service = require('egg').Service
const Nidle = require('nidle')
const _ = require('lodash')
const extend = require('extend')
const moment = require('moment')

class ChangelogService extends Service {
  // 新建发布
  async create() {
    const { ctx } = this
    const nidleConfig = ctx.app.config.nidle
    const { branch, projectId, mode } = ctx.request.body

    // TODO: 新建发布，复用period

    try {
      const project = await ctx.service.project.getBaseinfo(projectId)
      const now = new Date().getTime()
      const fileName = `${project.name}_${mode}_${now}`
      const config = await ctx.service.config.getByCreate(project, mode, branch, fileName, {
        repository: {
          type: project.repositoryType.toLocaleLowerCase(),
          url: project.repositoryUrl,
          branch,
          userName: ctx.session.user.name
        }
      })
      // 将配置存起来
      const configPath = path.resolve(nidleConfig.config.path, `${fileName}.json`)
      fs.writeFileSync(configPath, JSON.stringify(config, '', 2))

      // 创建记录
      const changelog = await ctx.model.Changelog.create({
        period: now,
        project: projectId,
        branch,
        developer: ctx.session.user.id,
        // TODO: source
        source: 'web',
        status: 'NEW',
        codeReviewStatus: 'NEW',
        environment: mode,
        configPath,
        logPath: config.log.all
      })
      const manager = new Nidle(extend(true, {}, config))
      const inputs = await manager.init()

      return {
        config,
        changelog,
        ...inputs
      }
    } catch (err) {
      console.log(2222, err)
      throw err
    }
  }

  // 开始构建任务
  async start({ id, configPath, inputs = [], servers }) {
    const { ctx } = this

    try {
      const configRaw = fs.readFileSync(configPath)
      const config = JSON.parse(configRaw)
      const serverList = []

      for (let i = 0, len = servers.length; i < len; i++) {
        const item = servers[i]
        const server = await ctx.model.Server.findOne({ where: { id: item.serverId } })
        await ctx.model.ProjectServer.update({ changelog: id }, { where: { id: item.id } })

        serverList.push({
          id: item.id,
          output: item.output,
          ip: server.ip,
          username: server.username,
          password: server.password
        })
      }

      const serverTidyList = serverList.map(item => {
        return {
          id: item.id,
          ip: item.ip,
          output: item.output
        }
      })
      fs.writeFileSync(
        configPath,
        JSON.stringify(
          {
            ...config,
            privacy: {
              server: serverTidyList
            },
            options: inputs
          },
          '',
          2
        )
      )

      ctx.app.runInBackground(async ctx => {
        async function update({ status, stage }) {
          const data = {}

          if (typeof stage !== 'undefined') {
            data.stage = stage
          }

          if (status) {
            data.status = status === 'success' ? 'SUCCESS' : 'FAIL'
          }

          try {
            await ctx.model.Changelog.update(data, { where: { id } })
          } catch (err) {
            throw err
          }
        }

        const manager = new Nidle({
          ...config,
          privacy: {
            server: serverList
          }
        })
        await manager.init()
        await manager.mount(inputs, update)

        async function wait() {
          return new Promise(resolve => {
            manager.on('completed', function () {
              console.log('completed')
              resolve()
            })

            manager.on('error', function () {
              console.log('end')
              resolve()
            })
          })
        }
        await manager.start()
        await wait()
        console.log('55555')
      })

      await ctx.model.Changelog.update(
        {
          status: 'PENDING'
        },
        { where: { id } }
      )

      return true
    } catch (err) {
      console.error(11111, err)
      throw err
    }
  }

  // 任务详情
  async detail({ id }) {
    const { ctx } = this
    try {
      const changelog = await ctx.model.Changelog.findOne({ where: { id } })
      const project = await ctx.model.Project.findOne({ where: { id: changelog.project } })
      const configRaw = fs.readFileSync(changelog.configPath)
      const config = JSON.parse(configRaw)

      return {
        config,
        changelog: {
          ...changelog.dataValues,
          statusEnum: changelog.statusEnum,
          projectName: project.name
        },
        inputs: config.inputs || []
      }
    } catch (err) {
      console.log(3333, err)
      throw err
    }
  }

  // 日志
  async log({ logPath, id, type = 'all' }) {
    const { ctx } = this

    try {
      const changelog = await ctx.model.Changelog.findOne({ where: { id } })
      let logRaw

      if (!logPath) {
        if (type === 'error') {
          // 只返回错误日志
          const configRaw = fs.readFileSync(changelog.configPath)
          const config = JSON.parse(configRaw)

          logPath = config.log.error
        } else {
          logPath = changelog.logPath
        }
      }

      logRaw = fs.readFileSync(logPath)
      logRaw = logRaw.toString().replace(/\n/g, ',')

      if (logRaw[logRaw.length - 1] === ',') {
        logRaw = logRaw.substr(0, logRaw.length - 1)
      }

      logRaw = '[' + logRaw + ']'
      const logs = JSON.parse(logRaw)
      const len = logs.length

      const result = {
        status: changelog.status,
        statusEnum: changelog.statusEnum,
        stage: changelog.stage
      }

      if (len > 1) {
        result.startTime = logs[0].time

        if (changelog.statusEnum > 1) {
          result.endTime = logs[len - 1].time
        }

        result.duration = getDuration(logs[0].time, logs[len - 1].time)

        // 分组
        const stages = []
        transform(logs, stages, 0)

        return {
          ...result,
          stages
        }
      } else {
        return result
      }
    } catch (err) {
      console.log(444, err)
      throw err
    }
  }
}

function transform(logs, stages, from = 0) {
  const stageStartIdx = _.findIndex(logs, { progress: 'STAGE START' }, from)

  if (stageStartIdx > -1) {
    const stageStart = logs[stageStartIdx]
    const stage = {
      name: stageStart.name,
      startTime: stageStart.time,
      steps: []
    }

    const stageEndIdx = _.findIndex(
      logs,
      function (item) {
        return (item.progress === 'STAGE ERROR' || item.progress === 'STAGE COMPLETE') && item.name === stage.name
      },
      stageStartIdx
    )
    getSteps(logs, stage.steps, stageStartIdx, stageEndIdx > -1 ? stageEndIdx : logs.length)

    stages.push(stage)

    if (stageEndIdx > -1) {
      const stageEnd = logs[stageEndIdx]
      stage.endTime = stageEnd.time
      stage.duration = getDuration(stage.startTime, stage.endTime)

      transform(logs, stages, stageEndIdx)
    } else {
      stage.duration = getDuration(stage.startTime, logs[logs.length - 1].time)
      return
    }
  } else {
    return
  }
}

function getSteps(logs, steps, from = 0, end) {
  const stepStartIdx = _.findIndex(logs, { progress: 'STEP START' }, from)

  if (stepStartIdx > -1) {
    const stepStart = logs[stepStartIdx]
    const step = {
      name: stepStart.name,
      taskName: stepStart.taskName,
      startTime: stepStart.time
    }

    const stepEndIdx = _.findIndex(
      logs,
      function (item) {
        return (item.progress === 'STEP ERROR' || item.progress === 'STEP COMPLETE') && item.name === step.name
      },
      stepStartIdx
    )

    // 拼接详情
    const list = logs.slice(stepStartIdx + 1, stepStartIdx > -1 ? stepEndIdx : logs.len)
    step.detail = list.map(item => item.detail).join('')

    steps.push(step)

    if (stepEndIdx > -1) {
      const stepEnd = logs[stepEndIdx]
      step.endTime = stepEnd.time
      step.duration = getDuration(step.startTime, step.endTime)

      if (stepEnd.progress === 'STEP ERROR') {
        step.status = 'FAIL'
        step.detail += stepEnd.error.stack
      }

      if (stepEndIdx + 1 >= end) {
        return
      }

      getSteps(logs, steps, stepEndIdx, end)
    } else {
      step.duration = getDuration(step.startTime, logs[logs.length - 1].time)
      return
    }
  } else {
    return
  }
}

// 计算持续时间
function getDuration(begin, end) {
  const beginTime = moment(begin)
  const endTime = moment(end)
  const duration = moment.duration(endTime.diff(beginTime))
  const m = duration.minutes()
  const s = duration.seconds()

  return m ? `${m}m${s}s` : s === 0 ? '<1s' : `${s}s`
}

module.exports = ChangelogService
