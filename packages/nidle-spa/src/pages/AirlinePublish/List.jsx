import { PlusOutlined } from '@ant-design/icons'
import { Tabs, Space, Modal, message, Button } from 'antd'
import ProCard from '@ant-design/pro-card'
import ProTable from '@ant-design/pro-table'
import { PageContainer } from '@ant-design/pro-layout'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { useState, useRef } from 'react'
import { Link } from 'umi'

import { mode as environmentList } from '@/dicts/app'
import { queryAirlinePublishList, deleteAirlinePublishList } from '@/services/airline-publish'

import EditAirlinePublish from './components/EditAirlinePublish'

const AirlinePublishList = () => {
  const [activeTabKey, setActiveTabKey] = useState(environmentList[0]?.value || '')
  const [modalOpen, setModalOpen] = useState(false)
  const [editData, setEditData] = useState({})

  const actionRef = useRef(null)

  const handleModalOpen = data => {
    setModalOpen(true)
    setEditData(data)
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
        const delRes = await deleteAirlinePublishList({ id })
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
              path: '/airline-publish/list',
              breadcrumbName: '航司服务器关系列表'
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
        {environmentList.length > 0 && (
          <>
            <Tabs
              items={environmentList.map(({ value, label }) => ({ label, key: value }))}
              activeKey={activeTabKey}
              onChange={val => setActiveTabKey(val)}
              style={{ padding: '0 24px' }}
              tabBarExtraContent={
                <Button
                  key="addButton"
                  icon={<PlusOutlined />}
                  type="primary"
                  onClick={() => handleModalOpen({ environment: activeTabKey })}
                >
                  新建
                </Button>
              }
            />
            <ProTable
              columns={[
                {
                  title: '航司',
                  dataIndex: 'airline',
                  key: 'airline',
                  width: 70
                },
                {
                  title: '所属环境',
                  dataIndex: 'environment',
                  key: 'environment',
                  width: 120
                },
                {
                  title: '服务器名',
                  dataIndex: 'name',
                  key: 'name',
                  width: 120
                },
                {
                  title: 'IP',
                  dataIndex: 'ip',
                  key: 'ip',
                  width: 120
                },
                {
                  title: '发布路径',
                  dataIndex: 'projectServerOutput',
                  key: 'projectServerOutput'
                },
                {
                  title: '相对路径',
                  dataIndex: 'relativePath',
                  key: 'relativePath'
                },
                {
                  title: '描述',
                  dataIndex: 'description',
                  key: 'description'
                },
                {
                  title: '状态',
                  dataIndex: 'status',
                  key: 'status',
                  width: 90,
                  render: text => ['禁用', '启用'][text]
                },
                {
                  title: '操作',
                  key: 'action',
                  width: 150,
                  render: (text, record) => (
                    <Space size="middle">
                      <Button type="link" onClick={() => handleModalOpen(record)} style={{ padding: 4 }}>
                        编辑
                      </Button>
                      <Button type="link" onClick={() => handleDeleteServer(record)} style={{ padding: 4 }}>
                        删除
                      </Button>
                    </Space>
                  )
                }
              ]}
              request={queryAirlinePublishList}
              params={{ environment: activeTabKey }}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              actionRef={actionRef}
              search={false}
            />
          </>
        )}
        <EditAirlinePublish open={modalOpen} editData={editData} onClose={handleModalClose} />
      </ProCard>
    </PageContainer>
  )
}

export default AirlinePublishList
