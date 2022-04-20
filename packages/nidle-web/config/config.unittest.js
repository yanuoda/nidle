'use strict'

require('../.dotenv.js')

const { DB_USER, DB_PASS, DB_HOST, DB_PORT } = process.env

// change to your own sequelize configurations for test
exports.sequelize = {
  dialect: 'mysql',
  host: DB_HOST,
  port: DB_PORT,
  database: 'nidle_web_unittest',
  username: DB_USER,
  password: DB_PASS,
  timezone: '+08:00'
}
