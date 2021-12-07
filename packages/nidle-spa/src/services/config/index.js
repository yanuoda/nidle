import { request } from 'umi'

// 获取input
export async function getInput(params) {
  return request('/api/config/getInput', {
    method: 'POST',
    data: params
  })
}
