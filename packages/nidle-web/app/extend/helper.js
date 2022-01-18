module.exports = {
  nidleNext(changelog) {
    const { environments } = this.app.config.nidle

    if (!changelog) {
      return {
        next: 'CREATE',
        label: '新建发布',
        environment: environments[0]
      }
    }

    const { status, codeReviewStatus, environment, active } = changelog

    if (active === 1) {
      // 已创建新的发布，发布结束
      return {
        next: 'END',
        label: '已完成',
        disabled: true
      }
    }

    const idx = environments.findIndex(item => item.value === environment)

    if (idx < 0) {
      throw new Error(`无效发布环境: ${environment}`)
    }

    const current = environments[idx]

    if (status === 'NEW') {
      // 新建 - 开始
      return {
        next: 'START',
        label: '开始',
        quit: idx !== 0,
        environment: current
      }
    }

    if (status === 'PENDING') {
      // 进行中 - 取消
      return {
        next: 'PENDING',
        label: '发布中',
        disabled: true,
        environment: current
      }
    }

    if (status === 'FAIL') {
      // 失败 - 重新开始
      return {
        next: 'CREATE',
        label: '重新开始',
        quit: status === 'FAIL',
        environment: current
      }
    }

    if (status === 'CANCEL') {
      // 退出发布 - 重新开始
      return {
        next: 'CREATE',
        label: '重新发布',
        environment: environments[0]
      }
    }

    if (status === 'SUCCESS') {
      if (codeReviewStatus === 'PENDING') {
        // codeReview处理中 - 等待
        return {
          next: 'WAITING.CODEREVIEW',
          label: '等待代码审核',
          disabled: true,
          quit: true,
          environment: current
        }
      }

      if (codeReviewStatus === 'FAIL') {
        // codeReview失败 - 取消发布
        return {
          next: 'FAIL',
          label: '代码审核失败',
          disabled: true,
          quit: true,
          environment: current
        }
      }

      if (idx + 1 >= environments.length) {
        // 发布结束
        return {
          next: 'END',
          label: '发布完成',
          disabled: true,
          environment: current
        }
      }

      // 进入下一步
      return {
        next: 'CREATE',
        label: `发布${environments[idx + 1].label}`,
        quit: true,
        environment: environments[idx + 1]
      }
    }
  }
}
