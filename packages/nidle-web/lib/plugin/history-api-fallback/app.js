'use strict'

module.exports = app => {
  const index = app.config.coreMiddleware.indexOf('static')

  if (index > -1) {
    app.config.coreMiddleware.splice(index, 0, 'historyApiFallback')
  }
}
