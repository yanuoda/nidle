import { useState, useEffect } from 'react'
import { Table, Space, Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

const ServerList = props => {
  const { modifyMethod, delMethod, data, serverList } = props
  const [projectServerList, setProjectServerList] = useState([])

  useEffect(() => {
    const list = data.map(item => {
      const { Server } = item
      const { name, ip } = Server
      return {
        name,
        ip,
        ...item
      }
    })
    setProjectServerList(list)
  }, [data, serverList])

  const handleDelete = params => {
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: '确认在当前应用下删除该机器？',
      onOk() {
        return delMethod(params)
      }
    })
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
      title: '目录',
      dataIndex: 'output',
      key: 'output'
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <a onClick={() => modifyMethod(record)}>编辑</a>
          <a onClick={() => handleDelete({ id: record.id })}>删除</a>
        </Space>
      )
    }
  ]

  return <Table columns={columns} dataSource={projectServerList} rowKey="id" pagination={false} />
}

export default ServerList
