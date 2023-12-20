import { useRef } from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import ProTable from '@ant-design/pro-table'
import { Modal, Space, message, Button } from 'antd'
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { queryTemplateList, deleteTemplate } from '@/services/template'
import { Link } from 'umi'

const Template = () => {
  const ref = useRef(null)

  const handleDeleteTemp = id => {
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: '确认删除该模板？',
      onOk() {
        return delMethod(id)
      }
    })
  }

  const delMethod = async id => {
    const delRes = await deleteTemplate({ id })
    const { success } = delRes || {}

    if (success) {
      ref.current.reload()
      message.success('删除成功！')
    }
  }

  const columns = [
    {
      title: '模板名称',
      dataIndex: 'name',
      align: 'center'
    },
    {
      title: '描述',
      dataIndex: 'description',
      align: 'center'
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      align: 'center',
      width: 300,
      render: (dom, { id, name }) => (
        <Space size="middle">
          <Link key="settings" to={`/template/detail?id=${id}&name=${name}`}>
            <Button type="link" style={{ padding: 4 }}>
              编辑
            </Button>
          </Link>
          <Button type="link" onClick={() => handleDeleteTemp(id)} style={{ padding: 4 }}>
            删除
          </Button>
        </Space>
      )
    }
  ]

  return (
    <PageContainer
      header={{
        title: null
      }}
    >
      <ProTable
        columns={columns}
        request={queryTemplateList}
        rowKey="id"
        bordered
        search={{
          labelWidth: 'auto'
        }}
        pagination={{
          pageSize: 10
        }}
        toolBarRender={() => [
          <Link key="newProject" to={`/template/detail`}>
            <Button key="button" icon={<PlusOutlined />} type="primary">
              新增配置
            </Button>
          </Link>
        ]}
      />
    </PageContainer>
  )
}

export default Template
