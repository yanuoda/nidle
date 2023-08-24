import { useState, useEffect } from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import { Tabs, Badge, Button } from 'antd'
import { queryPublishData } from '@/services/publish'
import { Link, history } from 'umi'

import PublishList from './components/PublishList'
import CreateChangelog from './components/CreateChangelog'
import { transformDuration } from '@/utils'
import { status as statusList } from '@/dicts/changelog'
import { mode as environmentList } from '@/dicts/app'
import styles from './index.less'

const Publish = props => {
  const { name, id } = props.location.query

  // 面包屑导航自定义
  const routes = [
    {
      path: '/project/list',
      breadcrumbName: '应用列表'
    },
    {
      breadcrumbName: name || id
    },
    {
      breadcrumbName: '发布记录'
    }
  ]

  // 处理数据
  const [publishDataList, setPublishDataList] = useState({})
  useEffect(async () => {
    // 获取所有发布数据
    const { data, success } = await queryPublishData({ id })
    if (success) {
      setPublishDataList(data)
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
      title: '发布类型',
      dataIndex: 'type',
      align: 'center'
    },
    {
      title: '描述',
      dataIndex: 'description',
      align: 'center'
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      initialValue: 'all',
      fixed: 'right',
      width: 130,
      valueEnum: statusList,
      render(dom, { status, environment }) {
        const { label: envName } = environmentList.find(env => env.value === environment)
        const { label, badgeStatus } = statusList.find(item => item.value === status)
        return <Badge status={badgeStatus} text={`${envName} - ${label}`} />
      }
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      align: 'center',
      width: 300,
      render: (dom, { id, nextPublish, isChild, project }) => {
        const { buttonText, redirectUrl, quit } = nextPublish || {}
        const list = []
        if (!isChild) {
          if (buttonText && redirectUrl) {
            list.push(
              <Link key={buttonText} to={redirectUrl}>
                <Button type="primary" key={buttonText}>
                  {buttonText}
                </Button>
              </Link>
            )
          } else if (buttonText) {
            list.push(
              <Button type="primary" key={buttonText}>
                {buttonText}
              </Button>
            )
          }

          if (quit) {
            list.push(
              <Link key={buttonText} to={`/project/${project}/changelog/detail?id=${id}`}>
                <Button type="primary" key="退出发布" className={styles.warningBtn}>
                  退出发布
                </Button>
              </Link>
            )
          }

          list.push(
            <Link key="publish" to={`/project/${project}/changelog/detail?id=${id}`}>
              发布详情
            </Link>
          )
        } else {
          list.push(
            <Link key="publish" to={`/project/${project}/changelog/detail?id=${id}`}>
              发布详情
            </Link>
          )
        }

        return list
      }
    }
  ]

  return (
    <PageContainer
      header={{
        title: `应用：${name}`,
        breadcrumb: {
          routes,
          itemRender({ path, breadcrumbName }) {
            if (path) return <Link to={path}>{breadcrumbName}</Link>
            return <span>{breadcrumbName}</span>
          }
        },
        extra: [
          <CreateChangelog projectId={id} projectName={name} />,
          <Button
            type="default"
            onClick={() => {
              history.push(`/project/settings?id=${id}&name=${name}`)
            }}
          >
            应用设置
          </Button>
        ]
      }}
    >
      {environmentList.length > 0 && (
        <Tabs defaultActiveKey={environmentList[0]?.value} style={{ marginTop: -24 }}>
          {environmentList.map(env => (
            <Tabs.TabPane tab={env.label} key={env.value}>
              <PublishList columns={columns} data={publishDataList[env.value] || []} />
            </Tabs.TabPane>
          ))}
        </Tabs>
      )}
    </PageContainer>
  )
}

export default Publish
