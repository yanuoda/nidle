import { request } from 'umi'

// 获取列表
export async function queryAirlinePublishList(params) {
  return request('/api/airline-publish/list', {
    method: 'POST',
    data: params
  })
}

export async function addAirlinePublishList(params) {
  return request('/api/airline-publish/add', {
    method: 'POST',
    data: params
  })
}

export async function modifyAirlinePublishList(params) {
  return request('/api/airline-publish/modify', {
    method: 'POST',
    data: params
  })
}

export async function deleteAirlinePublishList(params) {
  return request('/api/airline-publish/delete', {
    method: 'POST',
    data: params
  })
}
