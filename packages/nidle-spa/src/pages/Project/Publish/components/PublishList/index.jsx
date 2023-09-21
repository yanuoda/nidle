import ProTable from '@ant-design/pro-table'

const PublishList = props => {
  const { columns, data } = props

  return (
    <>
      <ProTable
        columns={columns}
        dataSource={data}
        rowKey="id"
        bordered
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1500 }}
        search={false}
      />
    </>
  )
}

export default PublishList
