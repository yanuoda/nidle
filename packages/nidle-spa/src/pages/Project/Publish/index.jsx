import { useState, useRef } from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import ProTable from '@ant-design/pro-table'
import { Tabs, Button } from 'antd'
// import {  } from '@ant-design/icons'
import { Link, history } from 'umi'

import { getPublishList, getChildPublishList } from '@/services/publish'
import { mode as environmentList } from '@/dicts/app'

// import styles from './index.less'
import useColumns from './hooks/useColumns'
import CreateChangelog from './components/CreateChangelog'
import ChildrenModal from './components/ChildrenModal'

const Publish = props => {
  const { name: projectName, id: projectId } = props.location.query

  // 面包屑导航自定义
  const routes = [
    {
      path: '/project/list',
      breadcrumbName: '应用列表'
    },
    {
      breadcrumbName: projectName || projectId
    },
    {
      breadcrumbName: '发布记录'
    }
  ]

  const [activeTabKey, setActiveTabKey] = useState(environmentList[0]?.value || '')
  const [expandedRowKeys, setExpandedRowKeys] = useState([])
  const [childrenModalOpen, setChildrenModalOpen] = useState(false)
  const [childrenModalParams, setChildrenModalParams] = useState({})
  const actionRef = useRef()

  const columns = useColumns({
    onReload: () => {
      actionRef?.current.reload()
      setExpandedRowKeys([])
    },
    moreListClick: ({ id, period }) => {
      setChildrenModalOpen(true)
      setChildrenModalParams({
        excludeId: id,
        period
      })
    }
  })

  const loadChildPublishList = async ({ id, period }) => {
    const { data, total } = await getChildPublishList({
      excludeId: id,
      projectId,
      environment: activeTabKey,
      period,
      current: 1,
      pageSize: 10
    })
    if (total > data.length) {
      return [
        ...data,
        {
          totalChilds: total,
          id: 'totalChilds',
          changelog: { id, period }
        }
      ]
    }
    return data
  }

  return (
    <PageContainer
      header={{
        title: `应用：${projectName}`,
        breadcrumb: {
          routes,
          itemRender({ path, breadcrumbName }) {
            if (path) return <Link to={path}>{breadcrumbName}</Link>
            return <span>{breadcrumbName}</span>
          }
        },
        extra: [
          <CreateChangelog projectId={projectId} projectName={projectName} key="CreateChangelog" />,
          <Button
            key="projectWebhooks"
            type="default"
            onClick={() => {
              history.push(`/project/webhooks?id=${projectId}&name=${projectName}`)
            }}
          >
            应用webhooks
          </Button>,
          <Button
            key="projectSettings"
            type="default"
            onClick={() => {
              history.push(`/project/settings?id=${projectId}&name=${projectName}`)
            }}
          >
            应用设置
          </Button>
        ]
      }}
    >
      {environmentList.length > 0 && (
        <>
          <Tabs
            items={environmentList.map(({ value, label }) => ({ label, key: value }))}
            activeKey={activeTabKey}
            onChange={val => {
              setActiveTabKey(val)
              setExpandedRowKeys([])
            }}
            style={{ marginTop: -24 }}
          />
          <ProTable
            actionRef={actionRef}
            columns={columns}
            params={{ projectId, environment: activeTabKey }}
            request={getPublishList}
            expandable={{
              expandedRowKeys,
              onExpand: async (expanded, record) => {
                if (expanded && !record.children.length) {
                  record.children = await loadChildPublishList(record)
                }
                if (expanded) setExpandedRowKeys(_ids => [..._ids, record.id])
                else setExpandedRowKeys(_ids => _ids.filter(id => id !== record.id))
              }
            }}
            rowKey="id"
            bordered
            pagination={{ pageSize: 10 }}
            scroll={{ x: 1500 }}
            search={false}
          />
          <ChildrenModal
            open={childrenModalOpen}
            params={{
              showInfo: true,
              projectId,
              environment: activeTabKey,
              ...childrenModalParams
            }}
            onClose={() => setChildrenModalOpen(false)}
          />
        </>
      )}
    </PageContainer>
  )
}

export default Publish
