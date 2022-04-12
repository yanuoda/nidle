const path = require('path')
const fsExtra = require('fs-extra')
const inquirer = require('inquirer')
const { Logger } = require('../utils')

/**
 * 对比配置项是否有更新，有则询问并生成新的 .env 文件
 * @param {String} oldPath nidle 旧版文件目录
 * @param {String} tempPath nidle 更新文件下载目录
 * @returns nidle 服务地址
 */
module.exports = async function diffAndInquireEnvConfig(oldPath, tempPath) {
  const logger = new Logger('增量询问服务配置')

  try {
    logger.step()
    const oldEnvQuestions = require(path.resolve(oldPath, './nidle-web/.envQuestion.js'))
    const newEnvQuestions = require(path.resolve(tempPath, './nidle-web/.envQuestion.js'))

    const updateConfigQuestions = newEnvQuestions
      .filter(newEnv => {
        return !oldEnvQuestions.find(({ name }) => name === newEnv.name)
      })
      .map(question => {
        const { name, message } = question
        return {
          ...question,
          message: `${message}(${name}): `
        }
      })

    let updateEnvRaw = await fsExtra.readFile(path.resolve(oldPath, './nidle-web/.env'), 'utf8')
    if (updateConfigQuestions.length > 0) {
      // 有更新，询问新配置项
      const answers = await inquirer.prompt(updateConfigQuestions)

      Object.keys(answers).forEach(config => (updateEnvRaw = `${updateEnvRaw}${config}=${answers[config]}\n`))
    }
    await fsExtra.writeFile(path.resolve(tempPath, './nidle-web/.env'), updateEnvRaw)
    logger.success()
    return updateEnvRaw.match(/NIDLE_URL=(.*?)\n/)[1]
  } catch (err) {
    logger.error(`nidle-web 配置文件更新失败，请重试！\n${err}`)
  }
}
