import ProForm, { ProFormText } from '@ant-design/pro-form'
import { message } from 'antd'
import { useState, useEffect } from 'react'

import { queryServerDetail, addServer, modifyServer } from '@/services/server'

const ServerSettings = props => {
  const { id, environment } = props.location.query

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
  }, [])

  /* 基本信息 */
  const { name, ip, username, password, description } = server
  return (
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
          message.success('服务器信息保存成功！')
        }
      }}
      initialValues={{ name, ip, username, password, description, environment }}
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
  )
}

export default ServerSettings
