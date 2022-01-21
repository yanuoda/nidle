import { request } from 'umi'

// 获取模板分页列表
export async function queryTemplateList(params) {
  return request('/api/template/list', {
    method: 'POST',
    data: params
  })
}

// 获取模板详情
export async function queryTemplate(params) {
  return request('/api/template', {
    method: 'POST',
    data: params
  })
}

// 新增配置模板
export async function addTemplate(params) {
  return request('/api/template/add', {
    method: 'POST',
    data: params
  })
}

// 删除配置模板
export async function deleteTemplate(params) {
  return request('/api/template/delete', {
    method: 'POST',
    data: params
  })
}

// 修改服务器
export async function modifyTemplate(params) {
  return request('/api/template/modify', {
    method: 'POST',
    data: params
  })
}
