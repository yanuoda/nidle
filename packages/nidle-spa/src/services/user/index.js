import { request } from 'umi'

// 获取当前的用户
export async function queryCurrentUser(options) {
  return request('/api/user', {
    method: 'GET',
    ...(options || {})
  })
}

// 登录
export async function login(options) {
  return request('/api/user/login', {
    method: 'POST',
    ...(options || {})
  })
}

// 退出登录
export async function logout(options) {
  return request('/api/user/logout', {
    method: 'GET',
    ...(options || {})
  })
}
