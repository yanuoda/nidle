import ProCard from '@ant-design/pro-card'
import { ProFormText, ModalForm, ProFormSelect } from '@ant-design/pro-form'
import { Tabs, Button, message } from 'antd'
import { useState, useEffect } from 'react'
import { PlusOutlined } from '@ant-design/icons'

import ServerList from './components/ServerList'
import { queryServerList } from '@/services/server'
import { addProjectServer, delProjectServer, modifyProjectServer } from '@/services/project'
import { mode as environmentList } from '@/dicts/app'
import styles from './index.less'

/* 服务器信息 */
const ServerInfo = props => {
  const { projectData } = props

  const [serverTab, setServerTab] = useState(environmentList.length > 0 ? environmentList[0]?.value : '')
  const [serverModalVisible, setServerModalVisible] = useState(false)
  const [currentEditServer, setCurrentEditServer] = useState(null)
  const [projectServers, setProjectServers] = useState({})
  // 所有的服务器列表
  const [serverList, setServerList] = useState([])
  const [serverListMap, setServerListMap] = useState({})

  // 获取应用服务器数据
  useEffect(() => {
    setProjectServers(props.projectData.serverList || {})
  }, [props.projectData])

  // 请求所有的服务器数据
  useEffect(async () => {
    const serverRes = await queryServerList()
    const { success, data } = serverRes || {}
    setServerList(data)
    // 按环境区分机器
    const serverMap = {}
    data.forEach(({ id, ip, environment }) => {
      if (!serverMap[environment]) {
        serverMap[environment] = Object.create(null)
      }
      serverMap[environment][id] = ip
    })
    if (success) {
      setServerListMap(serverMap)
    }
  }, [])

  const addServer = async params => {
    const addRes = await addProjectServer(params)
    const { success, data } = addRes || {}

    if (success) {
      const currentTab = serverTab
      setProjectServers(prevServers => ({
        ...prevServers,
        [currentTab]: (prevServers[currentTab] || []).concat(data)
      }))
      message.success('添加成功！')
    }

    return success
  }
  const delServer = async params => {
    const delRes = await delProjectServer(params)
    const { success } = delRes || {}

    if (success) {
      const currentTab = serverTab
      setProjectServers(prevServers => ({
        ...prevServers,
        [currentTab]: prevServers[currentTab].filter(item => params.id !== item.id)
      }))
      message.success('删除成功！')
    }
  }
  const modifyServer = async params => {
    const modifyRes = await modifyProjectServer(params)
    const { success, data } = modifyRes || {}

    if (success) {
      const currentTab = serverTab
      setProjectServers(prevServers => ({
        ...prevServers,
        [currentTab]: prevServers[currentTab].map(item => (data.id === item.id ? data : item))
      }))
      message.success('修改成功！')
    }

    return success
  }
  // 新增/编辑机器信息提交
  const handleAddOrModifyServer = async values => {
    const { server, output, description } = values
    const handleMethod = currentEditServer ? modifyServer : addServer
    const params = {
      project: projectData.id,
      environment: serverTab,
      server: parseInt(server),
      output,
      description
    }
    // 编辑
    if (currentEditServer) {
      params.id = currentEditServer.id
    }
    const success = await handleMethod(params)
    if (success) {
      setServerModalVisible(false)
    }
  }
  // 新增机器弹窗
  const handleTriggerAddModal = () => {
    setCurrentEditServer(null)
    setServerModalVisible(true)
  }
  // 编辑机器弹窗
  const handleTriggerModifyModal = currentServer => {
    setCurrentEditServer(currentServer)
    setServerModalVisible(true)
  }

  return (
    <ProCard title="服务器管理" headerBordered collapsible bordered type="inner">
      {environmentList.length > 0 && (
        <>
          <Tabs defaultActiveKey={environmentList[0]?.value} onChange={setServerTab}>
            {environmentList.map(env => (
              <Tabs.TabPane tab={env.label} key={env.value}>
                <ServerList
                  data={projectServers[env.value] || []}
                  serverList={serverList.filter(({ environment }) => environment === env.value)}
                  modifyMethod={handleTriggerModifyModal}
                  delMethod={delServer}
                />
              </Tabs.TabPane>
            ))}
          </Tabs>
          <Button className={styles.addServerBtn} type="primary" onClick={handleTriggerAddModal}>
            <PlusOutlined />
            新增机器
          </Button>
          <ModalForm
            title={`${currentEditServer ? '编辑' : '新增'}机器`}
            width={500}
            layout="vertical"
            visible={serverModalVisible}
            modalProps={{ destroyOnClose: true }}
            onVisibleChange={setServerModalVisible}
            onFinish={handleAddOrModifyServer}
            initialValues={{
              server: currentEditServer?.server ? `${currentEditServer.server}` : null,
              output: currentEditServer?.output,
              description: currentEditServer?.description
            }}
          >
            <ProFormSelect
              name="server"
              label="选择机器"
              valueEnum={serverListMap[serverTab]}
              placeholder="请选择机器"
              required
              rules={[{ required: true, message: '请选择一个机器！' }]}
            />
            <ProFormText
              name="output"
              label="部署目录"
              placeholder="请输入部署目录"
              required
              rules={[{ required: true, message: '请输入部署目录！' }]}
            />
            <ProFormText name="description" label="描述" />
          </ModalForm>
        </>
      )}
    </ProCard>
  )
}

export default ServerInfo
