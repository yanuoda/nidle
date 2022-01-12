exports.nidle = {
  output: {
    backup: {
      path: '/Users/wangchangbin/git/nidle-output/backup/'
    },
    path: '/Users/wangchangbin/git/nidle-output/output/'
  },
  source: '/Users/wangchangbin/git/nidle-output/source/',
  log: {
    path: '/Users/wangchangbin/git/nidle-output/logs/'
  },
  config: {
    path: '/Users/wangchangbin/git/nidle-output/config/'
  },
  environments: [
    {
      value: 'development',
      label: '测试'
    },
    {
      value: 'pre',
      label: '预发布'
    },
    {
      value: 'production',
      label: '生产'
    }
  ]
}
