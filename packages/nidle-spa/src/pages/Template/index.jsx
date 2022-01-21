import { PageContainer } from '@ant-design/pro-layout'
import ProTable from '@ant-design/pro-table'
import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { queryTemplateList } from '@/services/template'
import { Link } from 'umi'

const Template = () => {
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
      render: (dom, { id, name }) => [
        <Link key="settings" to={`/template/detail?id=${id}&name=${name}`}>
          编辑
        </Link>
      ]
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
