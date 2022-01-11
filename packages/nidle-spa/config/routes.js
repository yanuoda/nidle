export default [
  {
    path: '/user',
    layout: false,
    routes: [
      { path: '/user', routes: [{ name: '登录', path: '/user/login', component: './User/Login' }] },
      { component: './404' }
    ]
  },
  { path: '/welcome', name: '欢迎', icon: 'smile', component: './Welcome' },
  {
    path: '/project',
    name: '应用管理',
    icon: 'crown',
    routes: [
      { path: '/project/list', name: '应用列表', icon: 'smile', component: './Project/List' },
      { path: '/project/settings', name: '应用配置', component: './Project/Settings', hideInMenu: true },
      { path: '/project/publish', name: '发布记录', component: './Project/Publish', hideInMenu: true },
      { path: '/project', redirect: '/project/list' },
      { path: '/project/:id/changelog/detail', name: '发布详情', component: './Changelog/Detail', hideInMenu: true },
      { component: './404' }
    ]
  },
  {
    path: '/server',
    name: '服务器管理',
    icon: 'table',
    routes: [
      {
        path: '/server/list',
        name: '服务器列表',
        icon: 'smile',
        component: './Server/List'
      },
      {
        path: '/server/form',
        name: '服务器配置',
        component: './Server/Form',
        hideInMenu: true
      },
      { path: '/server', redirect: '/serverlist' },
      { component: './404' }
    ]
  },
  { path: '/', redirect: '/welcome' },
  { component: './404' }
]
