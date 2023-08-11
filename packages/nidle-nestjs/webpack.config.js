/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * 需要 nest-cli.json 中 compilerOptions.builder = 'webpack' 才会加载此文件配置
 * 20230811: 暂不使用 webpack 构建
 */
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
