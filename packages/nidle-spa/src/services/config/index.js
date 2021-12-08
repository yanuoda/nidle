import { request } from 'umi'

// 获取input
export async function getInput(params) {
  return request('/api/config/getInput', {
    method: 'POST',
    data: params
  })
}

// 设置input
export async function setInput(params) {
  return request('/api/config/setInput', {
    method: 'POST',
    data: params
  })
}
