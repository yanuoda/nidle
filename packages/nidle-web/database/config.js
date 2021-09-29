require('../.dotenv.js')

const { DB_USER, DB_PASS, DB_HOST } = process.env

module.exports = {
  development: {
    username: DB_USER,
    password: DB_PASS,
    database: 'nidle_web',
    host: DB_HOST,
    dialect: 'mysql',
    timezone: '+08:00'
  },
  test: {
    username: DB_USER,
    password: DB_PASS,
    database: 'nidle_web_unittest',
    host: DB_HOST,
    dialect: 'mysql',
    timezone: '+08:00'
  }
}
