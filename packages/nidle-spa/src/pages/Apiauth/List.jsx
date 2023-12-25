import { PlusOutlined } from '@ant-design/icons'
import { Space, Modal, message, Button } from 'antd'
import ProCard from '@ant-design/pro-card'
import ProTable from '@ant-design/pro-table'
import { PageContainer } from '@ant-design/pro-layout'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { useState, useRef } from 'react'
import { Link } from 'umi'

import { queryApiauthList, deleteApiauthList } from '@/services/apiauth'

import EditApiauth from './components/EditApiauth'

const ApiauthList = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [editData, setEditData] = useState({})

  const actionRef = useRef(null)

  const handleModalOpen = data => {
    setModalOpen(true)
    setEditData(data || {})
  }

  const handleModalClose = refresh => {
    setModalOpen(false)
    if (refresh) {
      actionRef.current.reload()
    }
  }

  const handleDeleteServer = ({ id }) => {
    Modal.confirm({
      title: '提示',
      icon: <ExclamationCircleOutlined />,
      content: '确认删除该配置？',
      async onOk() {
        const delRes = await deleteApiauthList({ id })
        const { success } = delRes || {}

        if (success) {
          actionRef.current.reload()
          message.success('删除成功！')
        }
      }
    })
  }

  return (
    <PageContainer
      header={{
        title: null,
        breadcrumb: {
          routes: [
            {
              path: '/apiauth/list',
              breadcrumbName: '接口调用权限管理'
            }
          ],
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
      <ProCard headerBordered bordered type="inner">
        <ProTable
          columns={[
            {
              title: '名称',
              dataIndex: 'name',
              key: 'name',
              width: 120
            },
            {
              title: 'ApiKey',
              dataIndex: 'apiKey',
              key: 'apiKey',
              hideInSearch: true,
              width: 400
            },
            {
              title: '最近调用',
              dataIndex: 'lastInvokeTime',
              key: 'lastInvokeTime',
              valueType: 'dateTime',
              hideInSearch: true,
              width: 250
            },
            {
              title: '描述',
              dataIndex: 'description',
              key: 'description',
              hideInSearch: true
            },
            {
              title: '状态',
              dataIndex: 'status',
              key: 'status',
              width: 120,
              hideInSearch: true,
              render: text => ['禁用', '启用'][text]
            },
            {
              title: '操作',
              key: 'action',
              width: 150,
              hideInSearch: true,
              render: (text, record) => (
                <Space size="small">
                  <Button type="link" onClick={() => handleModalOpen(record)}>
                    编辑
                  </Button>
                  <Button type="link" onClick={() => handleDeleteServer(record)}>
                    删除
                  </Button>
                </Space>
              )
            }
          ]}
          request={queryApiauthList}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          actionRef={actionRef}
          toolBarRender={() => (
            <Button key="addButton" icon={<PlusOutlined />} type="primary" onClick={() => handleModalOpen()}>
              新建
            </Button>
          )}
        />
        <EditApiauth open={modalOpen} editData={editData} onClose={handleModalClose} />
      </ProCard>
    </PageContainer>
  )
}

export default ApiauthList
