import { PageContainer } from '@ant-design/pro-layout'
import ProCard from '@ant-design/pro-card'
import ProForm, { ProFormText } from '@ant-design/pro-form'
import { message } from 'antd'
import { useState, useEffect } from 'react'
import { Link, useModel } from 'umi'

import { queryServerDetail, addServer, modifyServer } from '@/services/server'

const ServerSettings = props => {
  const { initialState } = useModel('@@initialState')
  const { environmentList } = initialState || { environmentList: [] }
  const { name: projectName, id, environment } = props.location.query
  const environmentName = environmentList.find(item => {
    return item.key === props.location.query.environment
  }).name
  const [pageLoading, setPageLoading] = useState(true)

  // 应用服务器
  const [server, setServer] = useState({})

  useEffect(async () => {
    // 获取服务器详情数据
    if (id) {
      const res = await queryServerDetail({ id })
      const { success, data } = res || {}
      if (success) {
        setServer(data)
      }
    }

    setPageLoading(false)
  }, [])

  // 面包屑导航自定义
  const routes = [
    {
      path: '/server/list',
      breadcrumbName: '服务器列表'
    }
  ]
  // if (projectName) {
  routes.splice(1, 0, {
    path: '',
    breadcrumbName: `${projectName || '新增'} [${environmentName}]`
  })
  // }

  /* 基本信息 */
  const { name, ip, username, password, repositoryUrl, description } = server
  const BasicInfo = (
    <ProCard title="服务器信息" headerBordered collapsible bordered type="inner">
      <ProForm
        layout="vertical"
        submitter={{
          searchConfig: {
            submitText: '保存'
          }
        }}
        onFinish={async values => {
          values = { ...values, environment }
          const params = server.id ? { id: server.id, ...values } : values
          const result = server.id ? await modifyServer(params) : await addServer(params)
          const { success } = result || {}
          if (success) {
            window.location.href = `/server/list`
            message.success('应用信息保存成功，正在刷新页面...')
          }
        }}
        initialValues={{ name, ip, username, password, repositoryUrl, description, environment }}
      >
        <ProFormText
          width="xl"
          name="name"
          label=""
          placeholder="请输入服务器名称"
          required
          rules={[{ required: true, message: '请输入服务器名称' }]}
        />
        <ProFormText
          width="xl"
          name="ip"
          label=""
          placeholder="请输入IP地址"
          required
          rules={[{ required: true, message: '请输入IP地址' }]}
        />
        <ProFormText
          width="xl"
          name="username"
          label=""
          placeholder="请输入用户名"
          required
          rules={[{ required: true, message: '请输入用户名' }]}
        />
        <ProFormText.Password
          width="xl"
          name="password"
          type="password"
          label=""
          placeholder="请输入密码"
          required
          rules={[{ required: true, message: '请输入密码' }]}
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
    </PageContainer>
  )
}

export default ServerSettings
