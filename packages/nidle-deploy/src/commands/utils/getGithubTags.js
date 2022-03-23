const { Octokit } = require('@octokit/core')
const semverSort = require('semver/functions/sort')
const { step, errorLog } = require('./log')

const octokit = new Octokit({})

module.exports = async function getGithubTags() {
  step('开始检查 nidle 版本更新...')
  try {
    const { data } = await octokit.request('GET /repos/{owner}/{repo}/tags', {
      owner: 'yanuoda',
      repo: 'nidle'
    })
    // 找到最新的版本
    const versionSortList = semverSort(data.map(ver => ver.name.slice(1)))
    return versionSortList.length > 0 ? `${versionSortList.pop()}` : null
  } catch (err) {
    errorLog(`检查 nidle 版本更新失败，请重试！\n${err.message}`)
  }
}
