const execa = require('execa')

module.exports = async function runCommand(bin, args, opts = {}) {
  const showInfo = !!process.env.showInfo
  return execa(bin, args, { stdio: showInfo ? 'inherit' : 'pipe', ...opts })
}
