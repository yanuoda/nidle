/* eslint-disable @typescript-eslint/no-var-requires */

const nodeExternals = require('webpack-node-externals');

module.exports = function (options) {
  return {
    ...options,
    externals: [
      nodeExternals({
        // es module packages
        allowlist: [/^nidle/i, /^@okbeng03/i],
      }),
    ],
  };
};
