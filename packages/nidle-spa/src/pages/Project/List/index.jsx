import { PageContainer } from '@ant-design/pro-layout'
import ProTable from '@ant-design/pro-table'
import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { queryProjectList } from '@/services/project'
import { Link } from 'umi'

const ProjectList = () => {
  const columns = [
    {
      title: '应用',
      dataIndex: 'name',
      align: 'center',
      render: (dom, { repositoryUrl, name }) => {
        return (
          <a href={repositoryUrl} target="_blank" rel="noreferrer">
            {name}
          </a>
        )
      }
    },
    {
      title: '负责人',
      dataIndex: 'owner',
      align: 'center'
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      align: 'center',
      width: 300,
      render: (dom, { id, name }) => [
        <Link key="settings" to={`/project/settings?id=${id}&name=${name}`}>
          设置
        </Link>,
        <Link key="publish" to={`/project/publish?id=${id}&name=${name}`}>
          发布记录
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
        request={queryProjectList}
        rowKey="id"
        bordered
        search={{
          labelWidth: 'auto'
        }}
        pagination={{
          pageSize: 10
        }}
        toolBarRender={() => [
          <Link key="newProject" to={`/project/settings`}>
            <Button key="button" icon={<PlusOutlined />} type="primary">
              新建
            </Button>
          </Link>
        ]}
      />
    </PageContainer>
  )
}

export default ProjectList
