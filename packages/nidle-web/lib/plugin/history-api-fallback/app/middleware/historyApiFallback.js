'use strict'

const url = require('url')

module.exports = (options = {}) => {
  const logger = getLogger(options)

  return async function historyApiFallback(ctx, next) {
    if (ctx.method !== 'GET' || ctx.accepts(options.accepts || ['json', 'html']) !== 'html') {
      return next()
    }
    var parsedUrl = new url.URL(ctx.request.href)
    var rewriteTarget
    options.rewrites = options.rewrites || []
    for (var i = 0; i < options.rewrites.length; i++) {
      var rewrite = options.rewrites[i]
      var match = parsedUrl.pathname.match(rewrite.from)
      if (match !== null) {
        rewriteTarget = evaluateRewriteRule(parsedUrl, match, rewrite.to, ctx)
        ctx.url = rewriteTarget
        return next()
      }
    }

    var pathname = parsedUrl.pathname
    if (pathname.lastIndexOf('.') > pathname.lastIndexOf('/') && options.disableDotRule !== true) {
      return next()
    }

    rewriteTarget = options.index || '/index.html'
    logger('Rewriting', ctx.method, ctx.url, 'to', rewriteTarget)
    ctx.url = rewriteTarget
    return next()
  }

  function evaluateRewriteRule(parsedUrl, match, rule, ctx) {
    if (typeof rule === 'string') {
      return rule
    } else if (typeof rule !== 'function') {
      throw new Error('Rewrite rule can only be of type string or function.')
    }

    return rule({ parsedUrl, match, ctx })
  }

  function getLogger(options) {
    if (options && options.logger) {
      return options.logger
    } else if (options && options.verbose) {
      return console.log.bind(console)
    }
    return function () {}
  }
}
