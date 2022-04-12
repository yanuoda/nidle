module.exports = {
  version: '',
  root: '',
  steps: [
    {
      funcName: 'downloadNidle',
      args: ['globalVars.outPath', 'globalVars.version'],
      res: null
    },
    {
      funcName: 'customEnvConfig',
      args: ['globalVars.outPath'],
      res: null
    },
    {
      funcName: 'installSpaPackages',
      args: ['globalVars.outPath'],
      res: null,
      clearFunc: ['rmSpaNodeModules', 'globalVars.outPath']
    },
    {
      funcName: 'installWebPackages',
      args: ['globalVars.outPath'],
      res: null,
      clearFunc: ['rmWebNodeModules', 'globalVars.outPath']
    },
    {
      funcName: 'buildSpa',
      args: ['globalVars.outPath'],
      res: null
    },
    {
      funcName: 'dbMigration',
      args: ['globalVars.outPath'],
      res: null
    },
    {
      funcName: 'startServer',
      args: ['globalVars.outPath'],
      res: null
    }
  ]
}
