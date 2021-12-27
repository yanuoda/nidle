import { PlusOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import ProCard from '@ant-design/pro-card'
import ProTable from '@ant-design/pro-table'
import { PageContainer } from '@ant-design/pro-layout'
import { Tabs, Space, Modal, message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { useRef } from 'react'
import { Link, useModel } from 'umi'
import { queryServerListByPage, deleteServer } from '@/services/server'

const ServerList = () => {
  // 获取环境配置信息
  const { initialState } = useModel('@@initialState')
  const { environmentList } = initialState || { environmentList: [] }
  const ref = useRef(null)

  const handleDeleteServer = params => {
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: '确认删除该机器？',
      onOk() {
        return delMethod(params)
      }
    })
  }

  const delMethod = async params => {
    const delRes = await deleteServer(params)
    const { success } = delRes || {}

    if (success) {
      ref.current.reload()
      message.success('删除成功！')
    }
  }
  const columns = [
    {
      title: '机器名',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'IP',
      dataIndex: 'ip',
      key: 'ip'
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Link
            key="newServer"
            to={`/server/form?id=${record.id}&name=${record.name}&environment=${record.environment}`}
          >
            编辑
          </Link>
          <a onClick={() => handleDeleteServer(record)}>删除</a>
        </Space>
      )
    }
  ]

  return (
    <ProCard title="基础信息" headerBordered collapsible bordered type="inner">
      {environmentList.length > 0 && (
        <>
          <Tabs defaultActiveKey={environmentList[0]?.key}>
            {environmentList.map(env => (
              <Tabs.TabPane tab={env.name} key={env.key}>
                <ProTable
                  columns={columns}
                  request={queryServerListByPage}
                  params={{ environment: env.key }}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                  actionRef={ref}
                  toolBarRender={() => [
                    <Link key="newServer" to={`/server/form?environment=${env.key}`}>
                      <Button key="button" icon={<PlusOutlined />} type="primary">
                        新建
                      </Button>
                    </Link>
                  ]}
                />
              </Tabs.TabPane>
            ))}
          </Tabs>
        </>
      )}
    </ProCard>
  )
}

const ServerListContainer = props => {
  const { name: projectName } = props.location.query
  // 面包屑导航自定义
  const routes = [
    {
      path: '/server/list',
      breadcrumbName: '服务器列表'
    }
  ]

  if (projectName) {
    routes.splice(1, 0, {
      path: '',
      breadcrumbName: projectName
    })
  }

  return (
    <PageContainer
      waterMarkProps={{}}
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
      <ServerList />
    </PageContainer>
  )
}

export default ServerListContainer
