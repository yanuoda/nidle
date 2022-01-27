// 启动配置项
exports.cluster = {
  listen: {
    hostname: '0.0.0.0',
    port: 7001
  }
}

exports.nidle = {
  output: {
    backup: {
      path: '/frontend/nidle-output/backup/'
    },
    path: '/frontend/nidle-output/output/'
  },
  source: '/frontend/nidle-output/source/',
  log: {
    path: '/frontend/nidle-output/logs/'
  },
  config: {
    path: '/frontend/nidle-output/config/'
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

exports.logger = {
  dir: '/frontend/nidle-output/nidle-web'
}

// exports.nidle = {
//   output: {
//     backup: {
//       path: '/Users/wangchangbin/git/nidle-output/backup/'
//     },
//     path: '/Users/wangchangbin/git/nidle-output/output/'
//   },
//   source: '/Users/wangchangbin/git/nidle-output/source/',
//   log: {
//     path: '/Users/wangchangbin/git/nidle-output/logs/'
//   },
//   config: {
//     path: '/Users/wangchangbin/git/nidle-output/config/'
//   },
//   environments: [
//     {
//       value: 'development',
//       label: '测试'
//     },
//     {
//       value: 'pre',
//       label: '预发布'
//     },
//     {
//       value: 'production',
//       label: '生产'
//     }
//   ]
// }

// exports.logger = {
//   dir: '/Users/wangchangbin/git/nidle-output/nidle-web'
// }

// exports.mailer = {
//   host: "smtp.ethereal.email",
//   port: 587,
//   secure: false, // true for 465, false for other ports
//   auth: {
//     user: testAccount.user, // generated ethereal user
//     pass: testAccount.pass  // generated ethereal password
//   },
//   from: 'Pangalink <no-reply@pangalink.net>'
// }
