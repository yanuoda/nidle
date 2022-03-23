import ProCard from '@ant-design/pro-card'
import ProForm, { ProFormText, ProFormRadio } from '@ant-design/pro-form'
import { message } from 'antd'

import { saveAndSyncProject } from '@/services/project'

/* 基本信息 */
const BasicInfo = props => {
  const { projectData } = props
  const { name, repositoryUrl, description } = projectData
  return (
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
          const { id, name, repositoryType } = data || {}
          if (success) {
            window.location.href = `/project/settings?id=${id}&type=${repositoryType}&name=${name}`
            message.success('应用信息保存成功，正在刷新页面...')
          }
        }}
        initialValues={{ name, repositoryUrl, description }}
      >
        <ProFormRadio.Group
          label="仓库平台"
          name="repositoryType"
          initialValue="GitLab"
          options={['GitLab', 'GitHub']}
        />
        <ProFormText
          width="xl"
          name="repositoryUrl"
          label="Git Repo"
          placeholder="请输入 Git 地址"
          required
          rules={[{ required: true, message: '请输入 Git 地址' }]}
        />
        <ProFormText
          width="xl"
          name="name"
          label="应用名称"
          placeholder="请输入名称"
          rules={[
            { required: true, message: '请输入应用名称' },
            { pattern: '^[A-Za-z0-9-]{3,30}$', message: '请输入3-30位 英文字母、数字、-的组合' }
          ]}
        />
        <ProFormText width="xl" name="description" label="应用描述" placeholder="请输入应用描述" />
      </ProForm>
    </ProCard>
  )
}

export default BasicInfo
