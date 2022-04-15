module.exports = {
  version: '',
  root: '',
  steps: [
    {
      funcName: 'downloadNidle',
      args: ['globalVars.tempDir', 'globalVars.version'],
      res: null
    },
    {
      funcName: 'checkVersion',
      args: ['globalVars.tempDir'],
      res: null
    },
    {
      funcName: 'diffDeps',
      args: ['globalVars.root', 'globalVars.tempDir'],
      res: null
    },
    {
      funcName: 'diffAndInquireEnvConfig',
      args: ['globalVars.root', 'globalVars.tempDir'],
      res: null
    },
    {
      funcName: 'stopServer',
      args: ['globalVars.root'],
      res: null
    },
    {
      funcName: 'coverNidleFiles',
      args: ['globalVars.root', 'globalVars.tempDir', 'diffDeps.isSpaDepsUpdate', 'diffDeps.isWebDepsUpdate'],
      res: null
    },
    {
      condition: ['diffDeps.isSpaDepsUpdate'],
      clearFunc: ['rmSpaNodeModules', 'globalVars.root'],
      funcName: 'installSpaPackages',
      args: ['globalVars.root'],
      res: null
    },
    {
      condition: ['diffDeps.isWebDepsUpdate'],
      clearFunc: ['rmWebNodeModules', 'globalVars.root'],
      funcName: 'installWebPackages',
      args: ['globalVars.root'],
      res: null
    },
    {
      funcName: 'buildSpa',
      args: ['globalVars.root'],
      res: null
    },
    {
      funcName: 'dbMigration',
      args: ['globalVars.root'],
      res: null
    },
    {
      funcName: 'startServer',
      args: ['globalVars.root'],
      res: null
    }
  ]
}
