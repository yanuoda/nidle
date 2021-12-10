import { PageContainer } from '@ant-design/pro-layout'
import ProCard from '@ant-design/pro-card'
import ProForm, { ProFormText, ProFormTextArea, ModalForm, ProFormSelect } from '@ant-design/pro-form'
import { Tabs, Button, List, Avatar, Skeleton, message } from 'antd'
import { Link, useModel } from 'umi'
import { useState, useEffect } from 'react'
import { PlusOutlined, UserOutlined } from '@ant-design/icons'

import ConfigBlock from './components/ConfigBlock'
import ServerList from './components/ServerList'
import { queryServerList } from '@/services/server'
import {
  queryProjectDetail,
  saveAndSyncProject,
  saveProjectContacts,
  addProjectServer,
  delProjectServer,
  modifyProjectServer
} from '@/services/project'
import styles from './index.less'

const ProjectSettings = props => {
  // 获取环境配置信息
  const { initialState } = useModel('@@initialState')
  const { environmentList } = initialState || []

  const { name: projectName, id } = props.location.query
  const [pageLoading, setPageLoading] = useState(true)
  const [projectData, setProjectData] = useState({})
  // 所有的服务器列表
  const [serverList, setServerList] = useState([])
  const [serverListMap, setServerListMap] = useState({})
  // 应用服务器
  const [servers, setServers] = useState({})

  useEffect(async () => {
    // 请求项目数据
    if (id) {
      const res = await queryProjectDetail({ id })
      const { success, data } = res || {}
      if (success) {
        setProjectData(data)
        setServers(data.serverList)
      }
    }

    // 请求服务器数据
    const serverRes = await queryServerList()
    const { success: serverSuccess, data: serverData } = serverRes || {}
    setServerList(serverData)
    // 按环境区分机器
    const serverMap = {}
    serverData.forEach(({ id, ip, environment }) => {
      if (!serverMap[environment]) {
        serverMap[environment] = Object.create(null)
      }
      serverMap[environment][id] = ip
    })
    if (serverSuccess) {
      setServerListMap(serverMap)
    }

    setPageLoading(false)
  }, [])

  // 面包屑导航自定义
  const routes = [
    {
      path: '/project/list',
      breadcrumbName: '应用列表'
    },
    {
      path: '/project/settings',
      breadcrumbName: '应用配置'
    }
  ]
  if (projectName) {
    routes.splice(1, 0, {
      path: '',
      breadcrumbName: projectName
    })
  }

  /* 基本信息 */
  const { name, repositoryUrl, description } = projectData
  const BasicInfo = (
    <ProCard title="基础信息" headerBordered collapsible bordered type="inner">
      <ProForm
        layout="vertical"
        submitter={{
          searchConfig: {
            submitText: '保存'
          }
        }}
        onFinish={async values => {
          const params = projectData.id ? { id: projectData.id, ...values } : values
          const result = await saveAndSyncProject(params)
          const { success, data } = result || {}
          const { id, name } = data || {}
          if (success) {
            window.location.href = `/project/settings?id=${id}&name=${name}`
            message.success('应用信息保存成功，正在刷新页面...')
          }
        }}
        initialValues={{ name, repositoryUrl, description }}
      >
        <ProFormText
          width="xl"
          name="repositoryUrl"
          label="Git Repo"
          placeholder="请输入 Git 地址"
          required
          rules={[{ required: true, message: '请输入 Git 地址' }]}
        />
        <ProFormText width="xl" name="name" label="应用名称" placeholder="请输入名称" />
        <ProFormText width="xl" name="description" label="应用描述" placeholder="请输入应用描述" />
      </ProForm>
    </ProCard>
  )

  /* 发布配置 */
  const ConfigInfo = (
    <ProCard title="发布配置" headerBordered collapsible bordered type="inner">
      {environmentList.length > 0 && (
        <Tabs defaultActiveKey={environmentList[0]?.key}>
          {environmentList.map(env => (
            <Tabs.TabPane tab={env.name} key={env.key}>
              <ConfigBlock configRaw={env.name} />
            </Tabs.TabPane>
          ))}
        </Tabs>
      )}
    </ProCard>
  )

  /* 服务器信息 */
  const [serverTab, setServerTab] = useState(environmentList.length > 0 ? environmentList[0]?.key : '')
  const [serverModalVisible, setServerModalVisible] = useState(false)
  const [currentEditServer, setCurrentEditServer] = useState(null)

  const addServer = async params => {
    const addRes = await addProjectServer(params)
    const { success, data } = addRes || {}

    if (success) {
      const currentTab = serverTab
      setServers(prevServers => ({
        ...prevServers,
        [currentTab]: (prevServers[currentTab] || []).concat(data)
      }))
    }

    return success
  }
  const delServer = async params => {
    const delRes = await delProjectServer(params)
    const { success } = delRes || {}

    if (success) {
      const currentTab = serverTab
      setServers(prevServers => ({
        ...prevServers,
        [currentTab]: prevServers[currentTab].filter(item => params.id !== item.id)
      }))
      message.success('删除成功！')
    }
  }
  const modifyServer = async params => {
    const delRes = await modifyProjectServer(params)
    const { success } = delRes || {}

    if (success) {
      const currentTab = serverTab
      setServers(prevServers => ({
        ...prevServers,
        [currentTab]: prevServers[currentTab].map(item => (params.id === item.id ? params : item))
      }))
      message.success('修改成功！')
    }

    return success
  }
  // 新增/编辑机器信息提交
  const handleAddOrModifyServer = async values => {
    const { server, output } = values
    const handleMethod = currentEditServer ? modifyServer : addServer
    const params = {
      project: projectData.id,
      environment: serverTab,
      server: parseInt(server),
      output
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

  const ServerInfo = (
    <ProCard title="服务器管理" headerBordered collapsible bordered type="inner">
      {environmentList.length > 0 && (
        <>
          <Tabs defaultActiveKey={environmentList[0]?.key} onChange={setServerTab}>
            {environmentList.map(env => (
              <Tabs.TabPane tab={env.name} key={env.key}>
                <ServerList
                  data={servers[env.key] || []}
                  serverList={serverList.filter(({ environment }) => environment === env.key)}
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
            layout="horizontal"
            visible={serverModalVisible}
            modalProps={{ destroyOnClose: true }}
            onVisibleChange={setServerModalVisible}
            onFinish={handleAddOrModifyServer}
            initialValues={{
              server: currentEditServer?.server ? `${currentEditServer.server}` : null,
              output: currentEditServer?.output
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
          </ModalForm>
        </>
      )}
    </ProCard>
  )

  /* 项目成员 */
  const { memberList } = projectData
  const MemberInfo = (
    <ProCard title="项目成员" headerBordered collapsible bordered type="inner">
      <List
        itemLayout="horizontal"
        dataSource={memberList}
        renderItem={item => (
          <List.Item>
            <Skeleton avatar title={false} loading={item.loading} active>
              <List.Item.Meta
                avatar={<Avatar src={item.avatar_url} icon={<UserOutlined />} />}
                title={
                  <>
                    <a href={item.web_url} target="_blank" rel="noreferrer">
                      {item.name}
                    </a>
                    <span className={styles.memberUsername}> @{item.username}</span>
                  </>
                }
              />
              <div>{item.role}</div>
            </Skeleton>
          </List.Item>
        )}
      />
    </ProCard>
  )

  /* 通知管理 */
  const ContactsInfo = (
    <ProCard title="通知管理" headerBordered collapsible bordered type="inner">
      <ProForm
        layout="vertical"
        submitter={{
          searchConfig: { submitText: '保存' }
        }}
        onFinish={async values => {
          const result = await saveProjectContacts({
            id: projectData.id,
            ...values
          })
          if (result?.success) {
            message.success('保存成功！')
          }
        }}
        initialValues={{
          postEmails: projectData.postEmails
        }}
      >
        <ProFormTextArea
          width="xl"
          name="postEmails"
          label="邮件通知联系人"
          placeholder="通知联系人邮箱，以英文分号 ; 分隔"
          fieldProps={{
            style: { width: '100%' }
          }}
        />
      </ProForm>
    </ProCard>
  )

  return (
    <PageContainer
      loading={pageLoading}
      waterMarkProps={{}}
      header={{
        title: null,
        breadcrumb: {
          routes,
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
      {BasicInfo}
      {/* 只有存在 id 的时候才展示其他板块 */}
      {id && (
        <>
          {ConfigInfo}
          {ServerInfo}
          {MemberInfo}
          {ContactsInfo}
        </>
      )}
    </PageContainer>
  )
}

export default ProjectSettings
