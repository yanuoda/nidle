import { request } from 'umi'

// 获取服务器列表
export async function queryPublishData(params) {
  return request('/api/project/publish/list', {
    method: 'GET',
    params
  })
}

// 获取服务器列表
export async function getPublishList(data) {
  return request('/api/project/publish/list', {
    method: 'POST',
    data
  })
}

// 获取服务器列表
export async function getChildPublishList(data) {
  return request('/api/project/publish/child-list', {
    method: 'POST',
    data
  })
}
