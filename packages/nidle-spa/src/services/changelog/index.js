import { request } from 'umi'

// 获取分支
export async function fetchBranches(id, search) {
  const result = await request('/api/project/branches', {
    method: 'GET',
    params: { id, search }
  })

  if (result.success === true) {
    result.data = (result.data || []).map(item => {
      return {
        value: item.name,
        label: item.commit.author_name ? `${item.name} [${item.commit.author_name}]` : item.name
      }
    })
  }

  return result
}

// 新建发布
export async function create(params) {
  return request('/api/changelog/create', {
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

// 详情
export async function republish(params) {
  return request('/api/changelog/republish', {
    method: 'POST',
    data: params
  })
}

// 退出构建任务
export async function quit(params) {
  return request('/api/changelog/quit', {
    method: 'POST',
    data: params
  })
}

// 详情
export async function detail(params) {
  return request('/api/changelog/detail', {
    method: 'POST',
    data: params
  })
}

// 日志
export async function fetchLog(params) {
  return request('/api/changelog/log', {
    method: 'POST',
    data: params
  })
}

// 日志
export async function updateChangelog(params) {
  return request('/api/changelog/updateone', {
    method: 'POST',
    data: params
  })
}

// 批量删除发布
export async function deleteByIds(params) {
  return request('/api/changelog/delete', {
    method: 'POST',
    data: params
  })
}
