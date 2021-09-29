const fs = require('fs')
const path = require('path')

const envMap = {
  development: '.env.local',
  test: '.env.test',
  production: '.env.prod'
}
const envFile = envMap[process.env.NODE_ENV] || '.env'
let envPath = path.resolve(process.cwd(), envFile)
envPath = fs.existsSync(envPath) ? envPath : path.resolve(process.cwd(), '.env.example')

require('dotenv').config({ path: envPath })
