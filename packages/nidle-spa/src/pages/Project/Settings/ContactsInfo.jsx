import ProCard from '@ant-design/pro-card'
import ProForm, { ProFormTextArea } from '@ant-design/pro-form'
import { message } from 'antd'

import { saveProjectContacts } from '@/services/project'

/* 通知管理 */
const ContactsInfo = props => {
  const { projectData } = props
  return (
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
        autoFocus={false}
        autoFocusFirstInput={false}
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
}

export default ContactsInfo
