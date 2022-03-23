import ProTable from '@ant-design/pro-table'
import CreateChangelog from '../CreateChangelog'

const PublishList = props => {
  const { columns, data, showAddBtn, projectName, projectId, projectType } = props

  return (
    <>
      <ProTable
        columns={columns}
        dataSource={data}
        rowKey="id"
        bordered
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1200 }}
        search={false}
        toolBarRender={() => [
          showAddBtn ? (
            <CreateChangelog projectId={projectId} projectName={projectName} projectType={projectType} />
          ) : null
        ]}
      />
    </>
  )
}

export default PublishList
