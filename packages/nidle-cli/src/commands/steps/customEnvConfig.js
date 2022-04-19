const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
const { Logger } = require('../utils')

/**
 * 交互式询问用户配置并输出到 .env 文件
 * @param {String} outPath nidle 下载目录
 * @returns nidle 服务地址
 */
module.exports = async function customEnvConfig(outPath) {
  const { questions: envConfigQuestions, handler } = require(path.resolve(outPath, './nidle-web/.envQuestion.js'))
  const questions = envConfigQuestions.map(question => {
    const { name, message } = question
    return {
      ...question,
      message: `${message}(${name}): `
    }
  })

  try {
    const answers = await inquirer.prompt(questions)
    const { envRaw, NIDLE_URL } = handler(answers)
    fs.writeFileSync(path.resolve(outPath, './nidle-web/.env'), envRaw)
    console.log()
    return NIDLE_URL
  } catch (err) {
    new Logger('nidle-web 服务配置').error(`nidle-web 配置生成失败，请重试！\n${err}`)
  }
}
