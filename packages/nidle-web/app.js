class AppBootHook {
  constructor(app) {
    this.app = app
  }

  async willReady() {
    this.app.globalData = {
      environmentList: [
        { key: 'development', name: '测试' },
        { key: 'pre', name: '预发布' },
        { key: 'production', name: '生产' }
      ]
    }
  }
}

module.exports = AppBootHook
