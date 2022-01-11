import { PlusOutlined } from '@ant-design/icons'
import { Tabs, Space, Modal, message, Button } from 'antd'
import ProCard from '@ant-design/pro-card'
import ProTable from '@ant-design/pro-table'
import ProForm, { ProFormText } from '@ant-design/pro-form'
import { PageContainer } from '@ant-design/pro-layout'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { useState, useRef } from 'react'
import { Link, useModel } from 'umi'
import { queryServerListByPage, queryServerDetail, addServer, modifyServer, deleteServer } from '@/services/server'

const ServerForm = props => {
  // 应用服务器
  const server = props.serverInfo
  const ServerInfo = (
    <ProForm
      layout="vertical"
      submitter={{
        searchConfig: {
          submitText: '保存'
        }
      }}
      onFinish={async values => {
        values = { ...values, environment: server.environment }
        const params = server.id ? { id: server.id, ...values } : values
        const result = server.id ? await modifyServer(params) : await addServer(params)
        const { success } = result || {}
        if (success) {
          props.onRefresh()
          message.success('服务器信息保存成功，正在刷新页面...')
        }
      }}
      initialValues={server.id ? server : {}}
      request={server.id ? queryServerDetail : ''}
      params={server.id ? { id: server.id } : ''}
    >
      <ProFormText
        width="xl"
        name="name"
        label=""
        placeholder="请输入服务器名称"
        required
        rules={[{ required: true, message: '请输入服务器名称' }]}
      />
      <ProFormText
        width="xl"
        name="ip"
        label=""
        placeholder="请输入IP地址"
        required
        rules={[{ required: true, message: '请输入IP地址' }]}
      />
      <ProFormText
        width="xl"
        name="username"
        label=""
        placeholder="请输入用户名"
        required
        rules={[{ required: true, message: '请输入用户名' }]}
      />
      <ProFormText.Password
        width="xl"
        name="password"
        type="password"
        label=""
        placeholder="请输入密码"
        required
        rules={[{ required: true, message: '请输入密码' }]}
      />
    </ProForm>
  )
  return <ProCard type="inner">{ServerInfo}</ProCard>
}

const ServerList = () => {
  // 获取环境配置信息
  const { initialState } = useModel('@@initialState')
  const { environmentList } = initialState || { environmentList: [] }
  const ref = useRef(null)
  const [serverInfo, setServerInfo] = useState({})
  const [visible, setVisible] = useState(false)

  const handleOpenModal = serverInfo => {
    setVisible(true)
    setServerInfo(serverInfo)
  }

  const handleCancel = () => {
    setVisible(false)
  }

  const handleRefresh = () => {
    handleCancel()
    ref.current.reload()
  }

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
          <a onClick={() => handleOpenModal(record)}>编辑</a>
          <a onClick={() => handleDeleteServer(record)}>删除</a>
        </Space>
      )
    }
  ]

  return (
    <ProCard headerBordered bordered type="inner">
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
                    <Button
                      key="button"
                      icon={<PlusOutlined />}
                      type="primary"
                      onClick={() => handleOpenModal({ environment: env.key })}
                    >
                      新建
                    </Button>
                  ]}
                />
              </Tabs.TabPane>
            ))}
          </Tabs>
        </>
      )}
      <Modal title="服务器信息" visible={visible} footer={null} onCancel={() => handleCancel()} destroyOnClose>
        <ServerForm serverInfo={serverInfo} onRefresh={() => handleRefresh()} />
      </Modal>
    </ProCard>
  )
}

const ServerContainer = () => {
  // 面包屑导航自定义
  const routes = [
    {
      path: '/server/list',
      breadcrumbName: '服务器列表'
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
      <ServerList />
    </PageContainer>
  )
}

export default ServerContainer
