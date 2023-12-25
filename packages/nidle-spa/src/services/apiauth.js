import { request } from 'umi'

// 获取列表
export async function queryApiauthList(params) {
  return request('/api/apiauth/list', {
    method: 'POST',
    data: params
  })
}

export async function addApiauthList(params) {
  return request('/api/apiauth/add', {
    method: 'POST',
    data: params
  })
}

export async function modifyApiauthList(params) {
  return request('/api/apiauth/modify', {
    method: 'POST',
    data: params
  })
}

export async function deleteApiauthList(params) {
  return request('/api/apiauth/delete', {
    method: 'POST',
    data: params
  })
}
