const fs = require('fs')
const path = require('path')

let envPath = path.resolve(process.cwd(), '.env')
envPath = fs.existsSync(envPath) ? envPath : path.resolve(process.cwd(), '.env.example')

require('dotenv').config({ path: envPath })
