'use strict'

require('../.dotenv.js')

const { DB_USER, DB_PASS, DB_HOST } = process.env

module.exports = appInfo => {
  // eslint-disable-next-line node/no-exports-assign
  const config = (exports = {})

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_{{keys}}'

  // add your config here
  config.middleware = []

  // change to your own sequelize configurations
  config.sequelize = {
    dialect: 'mysql',
    host: DB_HOST,
    port: 3306,
    database: 'nidle_web',
    username: DB_USER,
    password: DB_PASS,
    timezone: '+08:00',
    define: {
      timestamps: true,
      freezeTableName: true,
      createdAt: 'createdTime',
      updatedAt: 'updatedTime'
    }
  }

  return config
}
