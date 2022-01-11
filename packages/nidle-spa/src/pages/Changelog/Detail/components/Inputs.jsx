import ProCard from '@ant-design/pro-card'
import { Table } from 'antd'
import { useState, useEffect } from 'react'
import { Link, useRequest } from 'umi'
import { getProjectServer } from '@/services/project'
import AddProjectServer from '@/pages/Project/Settings/components/addProjectServer'
import InputAnswer from './Input'

const Inputs = props => {
  const { projectId, mode, readonly, inputs, config } = props
  const [serverList, setServerList] = useState([])
  let columns = [
    {
      title: '机器名',
      dataIndex: ['Server', 'name']
    },
    {
      title: 'IP',
      dataIndex: ['Server', 'ip']
    },
    {
      title: '目录',
      dataIndex: 'output'
    }
  ]

  if (!readonly) {
    const { data: servers } = useRequest(() => {
      return getProjectServer({
        id: projectId,
        mode
      })
    })

    useEffect(() => {
      if (servers && servers.length) {
        setServerList(servers)
      }
    }, [servers])

    columns = columns.concat([
      {
        title: '使用状态',
        dataIndex: 'changelog',
        render: text => {
          return text ? (
            <Link to={`/project/${projectId}/changelog/detail?id=${text}`} target="_blank">
              被占用
            </Link>
          ) : (
            '空闲'
          )
        }
      },
      {
        title: '服务器状态',
        dataIndex: ['Server', 'status'],
        render: text => {
          return text === 1 ? '启用' : '禁用'
        }
      }
    ])
  } else {
    columns[0].dataIndex = 'ip'
    columns[1].dataIndex = 'ip'
    useEffect(() => {
      setServerList(config.privacy.server)
    }, [config])
  }

  const handlerAddServer = (type, server) => {
    setServerList(serverList.concat(server))
  }

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      props.onChange(
        'server',
        selectedRows.map(item => {
          return {
            id: item.id,
            output: item.output,
            serverId: item.server
          }
        })
      )
    },
    getCheckboxProps: record => ({
      disabled: readonly || !record.Server.status || record.changelog
    })
  }

  return (
    <>
      <ProCard title="服务器管理" headerBordered collapsible bordered type="inner">
        <Table
          columns={columns}
          dataSource={serverList}
          rowKey="id"
          pagination={false}
          rowSelection={readonly ? null : rowSelection}
        />
        {readonly || (
          <AddProjectServer type="add" projectId={projectId} mode={mode} onChange={handlerAddServer}></AddProjectServer>
        )}
      </ProCard>
      {inputs && inputs.length ? (
        <ProCard title="插件配置" headerBordered collapsible bordered type="inner">
          <InputAnswer inputs={inputs}></InputAnswer>
        </ProCard>
      ) : null}
    </>
  )
}

export default Inputs
