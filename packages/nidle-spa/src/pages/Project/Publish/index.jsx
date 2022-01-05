import { useState, useEffect } from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import { Tabs, Tooltip, Badge, Button } from 'antd'
import { queryProjectBranched } from '@/services/project'
import { queryPublishData } from '@/services/publish'
import { Link, useModel } from 'umi'

import PublishList from './components/PublishList'
import { transformDuration } from '@/utils'
import styles from './index.less'

// 发布状态
const statusMap = {
  all: { text: '全部', status: 'default' },
  0: { text: '进行中', status: 'processing' },
  1: { text: '成功', status: 'success' },
  2: { text: '失败', status: 'error' },
  3: { text: '取消', status: 'default' },
  4: { text: '暂停', status: 'warning' }
}

const Publish = props => {
  const { name, id } = props.location.query
  // 获取环境配置信息
  const { initialState } = useModel('@@initialState')
  const { environmentList } = initialState || { environmentList: [] }

  // 面包屑导航自定义
  const routes = [
    {
      path: '/project/list',
      breadcrumbName: '应用列表'
    },
    {
      path: '/project/publish',
      breadcrumbName: '发布记录'
    }
  ]
  if (name) {
    routes.splice(1, 0, {
      path: '',
      breadcrumbName: name
    })
  }

  // 处理数据
  const [publishDataList, setPublishDataList] = useState({})
  const [branches, setBranches] = useState({})
  useEffect(async () => {
    // 获取所有发布数据
    const { data, success } = await queryPublishData({ id })
    if (success) {
      setPublishDataList(data)
    }
    // 获取项目分支数据
    const { data: branchData, success: branchSuccess } = await queryProjectBranched({ id })
    if (branchSuccess) {
      const branchesMap = {}
      branchData.forEach(({ name, commit, protected: isProtect }) => {
        if (isProtect) {
          // 受保护的分支不能直接发布，防止对分支造成破坏性更改
          return
        }
        const { author_name } = commit
        branchesMap[name] = `${name} [${author_name}]`
      })
      setBranches(branchesMap)
    }
  }, [])

  const columns = [
    {
      title: '分支',
      dataIndex: 'branch',
      fixed: 'left',
      align: 'center'
    },
    {
      title: 'commitId',
      dataIndex: 'commitId',
      align: 'center',
      render(dom, { commitId, commitUrl }) {
        return (
          <a href={commitUrl} target="_blank" rel="noreferrer">
            {(commitId || '').slice(0, 10)}
          </a>
        )
      }
    },
    {
      title: '开发人员',
      dataIndex: 'developer',
      align: 'center'
    },
    {
      title: '开始时间',
      dataIndex: 'createdTime',
      valueType: 'dateTime',
      align: 'center'
    },
    {
      title: '修改时间',
      dataIndex: 'updatedTime',
      valueType: 'dateTime',
      align: 'center'
    },
    {
      title: '发布耗时',
      dataIndex: 'duration',
      align: 'center',
      render(dom, { duration }) {
        return transformDuration(duration)
      }
    },
    {
      title: '触发方式',
      dataIndex: 'source',
      align: 'center'
    },
    {
      title: '机器',
      dataIndex: 'serverInfo',
      align: 'center',
      render(dom, { serverInfo }) {
        const { ip, output } = serverInfo
        return (
          <Tooltip placement="top" title={output}>
            <span>{ip}</span>
          </Tooltip>
        )
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      initialValue: 'all',
      fixed: 'right',
      width: 100,
      valueEnum: statusMap,
      render(dom, { status }) {
        const { text, status: badgeStatus } = statusMap[status]
        return <Badge status={badgeStatus} text={text} />
      }
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      align: 'center',
      width: 300,
      render: (dom, { id, canPublish, environment, codeReviewStatus, status, isChild }) => {
        const list = []
        if (!isChild) {
          // 可以发布
          if (canPublish) {
            const idx = environmentList.findIndex(({ key }) => key === environment)
            if (idx === 0) {
              // 测试环境
              list.push(
                <Button type="primary" key="publishPre">
                  发布{environmentList[idx + 1].name}
                </Button>
              )
            } else if (idx === 1 && codeReviewStatus === 0) {
              // 预发环境需要先做代码审核
              list.push(
                <Button type="primary" key="codeReview">
                  代码审核
                </Button>
              )
            } else if (idx === 1 && codeReviewStatus === 1) {
              list.push(
                <Button type="primary" key="publishProd">
                  发布{environmentList[idx + 1].name}
                </Button>
              )
            }
            list.push(
              <Button type="primary" className={styles.warningBtn} key="exitPublish">
                退出发布
              </Button>
            )
          }
          // 失败或取消可以重新发布
          if ([2, 3].includes(status)) {
            list.push(
              <Button type="primary" className={styles.warningBtn} key="rePublish">
                重新发布
              </Button>
            )
          }
          // TODO: 上线后是否可以回滚?
        }

        list.push(
          <Link key="publish" to={`/project/publish/detail?id=${id}&name=${name}`}>
            发布详情
          </Link>
        )
        return list
      }
    }
  ]

  return (
    <PageContainer
      header={{
        title: null,
        breadcrumb: {
          routes,
          itemRender({ path, breadcrumbName }) {
            return location.pathname === path || !path ? (
              <span>{breadcrumbName}</span>
            ) : (
              <Link to={path}>{breadcrumbName}</Link>
            )
          }
        }
      }}
    >
      {environmentList.length > 0 && (
        <Tabs defaultActiveKey={environmentList[0]?.key}>
          {environmentList.map((env, idx) => (
            <Tabs.TabPane tab={env.name} key={env.key}>
              <PublishList
                columns={columns}
                data={publishDataList[env.key] || []}
                branches={branches}
                showAddBtn={idx === 0}
              />
            </Tabs.TabPane>
          ))}
        </Tabs>
      )}
    </PageContainer>
  )
}

export default Publish
