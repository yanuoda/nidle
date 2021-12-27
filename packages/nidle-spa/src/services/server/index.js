import { request } from 'umi'

// 获取服务器列表
export async function queryServerList(params) {
  return request('/api/server', {
    method: 'POST',
    data: params
  })
}

// 获取服务器分页列表
export async function queryServerListByPage(params) {
  return request('/api/server/list', {
    method: 'POST',
    data: params
  })
}

// 获取服务器分页列表
export async function queryServerDetail(params) {
  return request('/api/server/query', {
    method: 'GET',
    params
  })
}

// 新增服务器
export async function addServer(params) {
  return request('/api/server/add', {
    method: 'POST',
    data: params
  })
}

// 删除服务器
export async function deleteServer(params) {
  return request('/api/server/delete', {
    method: 'POST',
    data: params
  })
}

// 修改服务器
export async function modifyServer(params) {
  return request('/api/server/modify', {
    method: 'POST',
    data: params
  })
}
