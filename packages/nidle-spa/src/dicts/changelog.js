export const status = [
  {
    value: 'NEW',
    enum: 0,
    label: '新建',
    badgeStatus: 'default' // 用于在列表中展示状态颜色
  },
  {
    value: 'PENDING',
    enum: 1,
    label: '发布中',
    badgeStatus: 'processing'
  },
  {
    value: 'SUCCESS',
    enum: 2,
    label: '发布成功',
    badgeStatus: 'success'
  },
  {
    value: 'FAIL',
    enum: 3,
    label: '发布失败',
    badgeStatus: 'error'
  },
  {
    value: 'CANCEL',
    enum: 4,
    label: '发布取消',
    badgeStatus: 'warning'
  }
]

export const codeReviewStatus = [
  {
    value: 'NEW',
    enum: 0,
    label: '新建'
  },
  {
    value: 'SUCCESS',
    enum: 1,
    label: '成功'
  },
  {
    value: 'FAIL',
    enum: 2,
    label: '失败'
  }
]
