const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
const Logger = require('../utils/log')

/**
 * 交互式询问用户配置并输出到 .env 文件
 * @param {String} outPath nidle 下载目录
 * @returns nidle 服务地址
 */
module.exports = async function customEnvConfig(outPath) {
  const envConfigQuestions = require(path.resolve(outPath, './nidle-web/.envQuestion.js'))
  const questions = envConfigQuestions.map(question => {
    const { name, message } = question
    return {
      ...question,
      message: `${message}(${name}): `
    }
  })

  try {
    let envRaw = ''
    const answers = await inquirer.prompt(questions)
    const { NIDLE_SERVER, NIDLE_PORT } = answers
    const NIDLE_URL = `${NIDLE_SERVER}:${NIDLE_PORT}`
    delete answers.NIDLE_SERVER
    delete answers.NIDLE_PORT
    Object.keys(answers).forEach(config => (envRaw = `${envRaw}${config}=${answers[config]}\n`))
    // 根据输入的 nidle 服务启动地址和端口，得到其他配置项
    envRaw = `
${envRaw}
OAUTH_GITLAB_REDIRECT_URI=${NIDLE_URL}/api/oauth/callback\n
FE_SUCCESS_CALLBACK=${NIDLE_URL}/\n
FE_FAILED_CALLBACK=${NIDLE_URL}/user/login\n
NIDLE_URL=${NIDLE_URL}\n
`
    fs.writeFileSync(path.resolve(outPath, './nidle-web/.env'), envRaw)
    console.log()
    return NIDLE_URL
  } catch (err) {
    new Logger('nidle-web 服务配置').errorLog(`nidle-web 配置生成失败，请重试！\n${err.message}`)
  }
}
