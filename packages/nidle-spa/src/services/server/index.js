import { request } from 'umi'

// 获取服务器列表
export async function queryServerList(params) {
  return request('/api/server', {
    method: 'POST',
    data: params
  })
}
