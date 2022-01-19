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

// 开始构建任务
export async function start(params) {
  return request('/api/changelog/start', {
    method: 'POST',
    data: params
  })
}

// 获取项目配置
export async function getConfigByApp(params) {
  return request('/api/config/getByApp', {
    method: 'POST',
    data: params
  })
}
