import { request } from 'umi'

// 获取服务器列表
export async function queryPublishData(params) {
  return request('/api/project/publish/list', {
    method: 'GET',
    params
  })
}
