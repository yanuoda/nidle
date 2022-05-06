import { GitlabFilled, GithubFilled, LockOutlined, UserOutlined } from '@ant-design/icons'
import { message } from 'antd'
import { ProFormText, LoginForm } from '@ant-design/pro-form'
import { history, useModel } from 'umi'
import { login } from '@/services/user'
import md5 from 'js-md5'
import styles from './index.less'

const Login = () => {
  const { initialState, setInitialState } = useModel('@@initialState')

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.()

    if (userInfo) {
      await setInitialState(s => ({ ...s, currentUser: userInfo }))
    }
  }

  const handleSubmit = async values => {
    const { name, password } = values
    try {
      // 登录
      const data = { name, password: md5(password) }
      const res = await login({ data })

      if (res.success) {
        message.success('登录成功！')
        await fetchUserInfo()
        /** 此方法会跳转到 redirect 参数所在的位置 */

        if (!history) return
        const { query } = history.location
        const { redirect } = query
        history.push(redirect || '/')
      }
    } catch (error) {
      console.error('登录失败，请重试！')
    }
  }

  const goOAuth = type => {
    window.location.href = `/api/oauth?type=${type}`
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm
          logo={<img alt="logo" src="/logo.png" />}
          title="Nidle"
          subTitle={'基于 Node 的自动化部署框架'}
          actions={[
            '其他登录方式 :',
            <GitlabFilled key="GitlabFilled" className={styles.icon} onClick={() => goOAuth('gitlab')} />,
            <GithubFilled key="GithubFilled" className={styles.icon} onClick={() => goOAuth('github')} />
          ]}
          onFinish={async values => {
            await handleSubmit(values)
          }}
        >
          <ProFormText
            name="name"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined className={styles.prefixIcon} />
            }}
            placeholder={'请输入用户名！'}
            rules={[
              {
                required: true,
                message: '用户名是必填项！'
              }
            ]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined className={styles.prefixIcon} />
            }}
            placeholder={'请输入密码！'}
            rules={[
              {
                required: true,
                message: '密码是必填项！'
              }
            ]}
          />
        </LoginForm>
      </div>
    </div>
  )
}

export default Login
