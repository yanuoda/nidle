class AppBootHook {
  constructor(app) {
    this.app = app
  }

  async willReady() {
    this.app.globalData = {
      environmentList: [
        { key: 'test', name: '测试' },
        { key: 'pre', name: '预发' },
        { key: 'prod', name: '生产' }
      ]
    }
  }
}

module.exports = AppBootHook
