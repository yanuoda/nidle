const path = require('path')
const fsExtra = require('fs-extra')
const inquirer = require('inquirer')
const { step, errorLog } = require('./log')

/**
 * 对比配置项是否有更新，有则询问并生成新的 .env 文件
 * @param {String} oldPath nidle 旧版文件目录
 * @param {String} tempPath nidle 更新文件下载目录
 */
module.exports = async function diffAndInquireEnvConfig(oldPath, tempPath) {
  step('增量询问服务配置...')
  const oldEnvQuestions = require(path.resolve(oldPath, './nidle-web/.envQuestion.js'))
  const newEnvQuestions = require(path.resolve(tempPath, './nidle-web/.envQuestion.js'))

  try {
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
    step('生成新版 .env 文件成功！')
  } catch (err) {
    errorLog(`nidle-web 配置文件更新失败，请重试！\n${err.message}`)
  }
}
