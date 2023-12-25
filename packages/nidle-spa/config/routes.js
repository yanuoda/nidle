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
      { path: '/project/webhooks', name: 'webhooks', component: './Project/Webhooks', hideInMenu: true },
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
  {
    path: '/template',
    name: '配置模板管理',
    icon: 'appstore',
    routes: [
      {
        path: '/template/list',
        name: '模板列表',
        icon: 'table',
        component: './Template'
      },
      {
        path: '/template/detail',
        name: '模板配置',
        component: './Template/Detail',
        hideInMenu: true
      },
      { path: '/template', redirect: '/template/list' },
      { component: './404' }
    ]
  },
  {
    path: '/airline-publish',
    name: '航司服务器关系管理',
    icon: 'table',
    routes: [
      {
        path: '/airline-publish/list',
        name: '航司服务器关系列表',
        icon: 'smile',
        component: './AirlinePublish/List'
      },
      { path: '/airline-publish', redirect: '/airline-publish/list' },
      { component: './404' }
    ]
  },
  {
    path: '/apiauth',
    name: '接口调用权限管理',
    icon: 'table',
    routes: [
      {
        path: '/apiauth/list',
        name: '接口调用权限列表',
        icon: 'smile',
        component: './Apiauth/List'
      },
      { path: '/apiauth', redirect: '/apiauth/list' },
      { component: './404' }
    ]
  },
  { path: '/modifypassword', name: '修改密码', icon: 'edit', component: './User/ModifyPassword' },
  { path: '/associatedAccount', name: '关联账号', icon: 'heart', component: './User/associatedAccount' },
  { path: '/', redirect: '/welcome' },
  { component: './404' }
]
