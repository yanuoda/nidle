import { Changelog } from 'src/system/changelog/changelog.entity';
import _const from 'src/const';

type PickedChangelog = Pick<
  Changelog,
  | 'status'
  | 'codeReviewStatus'
  | 'environment'
  | 'active'
  | 'project'
  | 'id'
  | 'branch'
  | 'type'
>;

export default function (changelog: PickedChangelog | null, mode?: string) {
  const { environments } = _const;
  if (!changelog) {
    return {
      next: 'CREATE',
      label: '新建发布',
      environment: {
        value: mode,
      },
    };
  }

  const {
    status,
    codeReviewStatus,
    environment,
    active,
    project,
    id,
    branch,
    type,
  } = changelog;

  if (active === 1) {
    // 已创建新的发布，发布结束
    return {
      next: 'END',
      label: '已完成',
      disabled: true,
    };
  }

  const idx = environments.findIndex((item) => item.value === environment);

  if (idx < 0) {
    throw new Error(`无效发布环境: ${environment}`);
  }

  const current = environments[idx];

  if (status === 'NEW') {
    // 新建 - 开始
    return {
      next: 'START',
      label: '开始',
      quit: idx !== 0,
      environment: current,
      buttonText: '开始发布',
      redirectUrl: `/project/${project}/changelog/detail?id=${id}`,
    };
  }

  if (status === 'PENDING') {
    // 进行中 - 取消
    return {
      next: 'PENDING',
      label: '发布中',
      disabled: true,
      environment: current,
    };
  }

  if (status === 'FAIL') {
    // 失败 - 重新开始
    return {
      next: 'CREATE',
      label: '重新开始',
      quit: status === 'FAIL',
      environment: current,
      buttonText: '重新开始',
      redirectUrl: `/project/${project}/changelog/detail?id=${id}&branch=${branch}&action=CREATE&mode=${current.value}&type=${type}`,
    };
  }

  if (status === 'CANCEL') {
    // 退出发布 - 重新开始
    return {
      next: 'CREATE',
      label: '重新发布',
      environment: environments[0],
      buttonText: '重新发布',
      redirectUrl: `/project/${project}/changelog/detail?id=${id}&branch=${branch}&action=CREATE&mode=${environments[0].value}&type=${type}`,
    };
  }

  if (status === 'SUCCESS') {
    if (codeReviewStatus === 'PENDING') {
      // codeReview处理中 - 等待
      return {
        next: 'WAITING.CODEREVIEW',
        label: '等待代码审核',
        quit: true,
        environment: current,
        buttonText: '等待代码审核',
        redirectUrl: `/project/${project}/changelog/detail?id=${id}`,
      };
    }

    if (codeReviewStatus === 'FAIL') {
      // codeReview失败 - 取消发布
      return {
        next: 'FAIL',
        label: '代码审核失败',
        disabled: true,
        quit: true,
        environment: current,
      };
    }

    if (type === 'webhook') {
      // webhook发布成功，还在当前状态等待下一次发布，可以退出
      return {
        next: 'END',
        label: '发布成功',
        disabled: true,
        quit: true,
        environment: current,
      };
    }

    if (idx + 1 >= environments.length) {
      // 发布结束
      return {
        next: 'END',
        label: '发布完成',
        disabled: true,
        environment: current,
      };
    }

    // 进入下一步
    return {
      next: 'CREATE',
      label: `发布${environments[idx + 1].label}`,
      quit: true,
      environment: environments[idx + 1],
      buttonText: `发布${environments[idx + 1].label}`,
      redirectUrl: `/project/${project}/changelog/detail?id=${id}&branch=${branch}&action=CREATE&mode=${
        environments[idx + 1].value
      }`,
    };
  }
}
