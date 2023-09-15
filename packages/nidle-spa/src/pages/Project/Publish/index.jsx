import { useState, useEffect } from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import { Modal, Tabs, Badge, Button, message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Link, history } from 'umi'

import { queryPublishData } from '@/services/publish'
import { deleteByIds } from '@/services/changelog'
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

  const deleteChangelogByPeriod = (record, index) => {
    const { id, children = [], isChild, environment, period } = record
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: (
        <>
          <div>确认删除该{isChild ? '子记录' : '记录（组）'}？</div>
          {!isChild && (
            <div>
              <ExclamationCircleOutlined />
              &nbsp; 注意：子记录（如有）也会一并删除。
            </div>
          )}
        </>
      ),
      onOk: async () => {
        const ids = [id, ...children.map(({ id }) => id)]
        console.log('delete changelog:', ids)
        const res = await deleteByIds({ ids })
        console.log('res:', res)
        if (res.success) {
          message.success('删除成功')
          setPublishDataList(_data => {
            const _list = _data[environment]
            const newList = [..._list]
            if (!isChild) {
              newList.splice(index, 1)
            } else {
              const parentIndex = newList.findIndex(c => c.period === period)
              const parent = newList[parentIndex]
              const newChildren = [...parent.children]
              newChildren.splice(index, 1)
              newList.splice(parentIndex, 1, {
                ...parent,
                children: newChildren
              })
            }
            return { ..._data, [environment]: newList }
          })
        }
      }
    })
  }

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
      width: 100,
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
      align: 'center',
      width: 150
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      valueType: 'dateTime',
      align: 'center',
      width: 100
    },
    {
      title: '修改时间',
      dataIndex: 'updatedTime',
      valueType: 'dateTime',
      align: 'center',
      width: 100
    },
    {
      title: '发布耗时',
      dataIndex: 'duration',
      align: 'center',
      width: 80,
      render(dom, { duration }) {
        return transformDuration(duration)
      }
    },
    {
      title: '触发方式',
      dataIndex: 'source',
      align: 'center',
      width: 80
    },
    {
      title: '发布类型',
      dataIndex: 'type',
      align: 'center',
      width: 90
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
      width: 150,
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
      render: (dom, record, index) => {
        const { id, project, status, isChild, nextPublish } = record
        const btnDoms = [
          <Link key="publish" to={`/project/${project}/changelog/detail?id=${id}`}>
            <Button type="link" key="发布详情" className={styles.linkBtn}>
              发布详情
            </Button>
          </Link>,
          // 新建、取消 状态的发布记录 or 子记录 才可以删除
          ['NEW', 'CANCEL'].includes(status) || isChild ? (
            <Button
              type="link"
              key="删除"
              onClick={() => deleteChangelogByPeriod(record, index)}
              className={styles.linkBtn}
            >
              删除
            </Button>
          ) : null
        ]
        // 子发布记录不可操作，直接返回
        if (isChild) return btnDoms
        //
        const { buttonText, redirectUrl, quit } = nextPublish || {}
        if (quit) {
          btnDoms.unshift(
            <Link key={buttonText} to={`/project/${project}/changelog/detail?id=${id}`}>
              <Button type="primary" key="退出发布" className={styles.warningBtn}>
                退出发布
              </Button>
            </Link>
          )
        }
        if (buttonText) {
          let textBtn = (
            <Button type="primary" key={buttonText}>
              {buttonText}
            </Button>
          )
          if (redirectUrl) {
            textBtn = (
              <Link key={buttonText} to={redirectUrl}>
                {textBtn}
              </Link>
            )
          }
          btnDoms.unshift(textBtn)
        }
        return btnDoms
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
          <CreateChangelog projectId={id} projectName={name} key="CreateChangelog" />,
          <Button
            key="projectSettings"
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
