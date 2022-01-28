import { PageContainer } from '@ant-design/pro-layout'
import ProForm, { ProFormText } from '@ant-design/pro-form'
import { Card } from 'antd'
import { message } from 'antd'
import md5 from 'js-md5'

import { modifyPassword } from '@/services/user'

const ModifyPassword = () => {
  return (
    <PageContainer waterMarkProps={{}} header={{ title: null }}>
      <Card>
        <ProForm
          layout="vertical"
          submitter={{
            searchConfig: {
              submitText: '修改'
            }
          }}
          onFinish={async values => {
            const { oldPassword, newPassword, confirmPassword } = values
            if (newPassword !== confirmPassword) {
              message.error('新密码前后两次输入不相符，请确认后重试！')
              return
            }
            const { success } = await modifyPassword({ oldPassword: md5(oldPassword), newPassword: md5(newPassword) })
            if (success) {
              message.success('密码修改成功，正在跳转重新登录...')
              window.location.href = '/user/login'
            }
          }}
        >
          <ProFormText.Password
            width="xl"
            name="oldPassword"
            label="旧密码"
            required
            rules={[{ required: true, message: '请输入旧密码' }]}
          />
          <ProFormText.Password
            width="xl"
            name="newPassword"
            label="新密码"
            required
            rules={[{ required: true, message: '请输入新密码' }]}
          />
          <ProFormText.Password
            width="xl"
            name="confirmPassword"
            label="确认密码"
            required
            rules={[{ required: true, message: '请再其次输入新密码' }]}
          />
        </ProForm>
      </Card>
    </PageContainer>
  )
}

export default ModifyPassword
