module.exports = {
  questions: [
    {
      name: 'NIDLE_HOST',
      default: '127.0.0.1',
      message: '请输入 nidle 服务启动 IP '
    },
    {
      name: 'NIDLE_PORT',
      default: '7001',
      message: '请输入 nidle 服务启动端口'
    },
    {
      name: 'DB_USER',
      default: 'root',
      message: '请输入数据库登录用户名'
    },
    {
      name: 'DB_PASS',
      default: '',
      message: '请输入数据库登录密码'
    },
    {
      name: 'DB_HOST',
      default: '127.0.0.1',
      message: '请输入数据库服务 IP '
    },
    {
      name: 'DB_PORT',
      default: '3306',
      message: '请输入数据库服务端口'
    },
    {
      name: 'OAUTH_GITLAB_BASEURL',
      default: 'https://gitlab.com',
      message: '请输入 gitlab 地址'
    },
    {
      name: 'GITLAB_PRIVATE_TOKEN',
      default: '',
      message: '请输入 gitlab 管理员 private_token '
    },
    {
      name: 'OAUTH_GITLAB_CLIENT_ID',
      default: '',
      message: '请输入 gitlab 登录授权应用 client_id '
    },
    {
      name: 'OAUTH_GITLAB_CLIENT_SECRET',
      default: '',
      message: '请输入 gitlab 登录授权应用 client_secret '
    },
    {
      name: 'OAUTH_GITLAB_SCOPE',
      default: 'read_user',
      message: '请输入 gitlab 登录授权应用 API scope '
    },
    {
      name: 'REDIS_HOST',
      default: '127.0.0.1',
      message: '请输入 redis IP '
    },
    {
      name: 'REDIS_PORT',
      default: '6379',
      message: '请输入 redis 服务端口'
    },
    {
      name: 'REDIS_PASSWORD',
      default: '',
      message: '请输入 redis 登录密码'
    },
    {
      name: 'REDIS_DB_INDEX',
      default: '0',
      message: '请输入 redis 数据库 index '
    }
  ],
  handler(answers) {
    let envRaw = ''
    const { NIDLE_HOST, NIDLE_PORT } = answers
    const NIDLE_URL = `http://${NIDLE_HOST}:${NIDLE_PORT}`
    delete answers.NIDLE_HOST
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
    return { envRaw, NIDLE_URL }
  }
}
