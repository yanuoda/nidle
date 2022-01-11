import { request } from 'umi'

// 获取当前用户的应用列表
export async function queryProjectList(params) {
  return request('/api/project/list', {
    method: 'POST',
    data: params
  })
}

// 获取应用详情
export async function queryProjectDetail(params) {
  return request('/api/project/detail', {
    method: 'GET',
    params
  })
}

// 保存并同步应用数据
export async function saveAndSyncProject(params) {
  return request('/api/project/sync', {
    method: 'POST',
    data: params
  })
}

// 编辑应用联系人
export async function saveProjectContacts(params) {
  return request('/api/project/contacts/update', {
    method: 'POST',
    data: params
  })
}

// 添加应用服务器
export async function addProjectServer(params) {
  return request('/api/project/server/add', {
    method: 'POST',
    data: params
  })
}

// 删除应用服务器
export async function delProjectServer(params) {
  return request('/api/project/server/delete', {
    method: 'POST',
    data: params
  })
}

// 编辑应用服务器
export async function modifyProjectServer(params) {
  return request('/api/project/server/modify', {
    method: 'POST',
    data: params
  })
}

// 获取应用服务器
export async function getProjectServer(params) {
  return request('/api/project/server/fetch', {
    method: 'POST',
    data: params
  })
}

// 编辑应用服务器
export async function queryProjectBranched(params) {
  return request('/api/project/branches', {
    method: 'GET',
    params
  })
}
