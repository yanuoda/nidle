const fs = require('fs')
const path = require('path')

const root = process.cwd()

let envPath = path.resolve(root, '.env')
envPath = fs.existsSync(envPath) ? envPath : path.resolve(root, '.env.example')

require('dotenv').config({ path: envPath })
