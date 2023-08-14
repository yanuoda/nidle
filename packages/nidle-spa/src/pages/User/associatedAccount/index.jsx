import { PageContainer } from '@ant-design/pro-layout'
import { Card, Typography, Space } from 'antd'
import { Button } from 'antd'
import { SmileOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { useModel } from 'umi'

const associatedAccount = () => {
  const { initialState } = useModel('@@initialState')
  const [actionLoading, setActionLoading] = useState(false)
  const handleRelevance = type => {
    setActionLoading(true)
    window.location.href = `/api/oauth?type=${type}`
  }

  return (
    <PageContainer waterMarkProps={{}} header={{ title: '关联账号' }}>
      <Card>
        <Space direction="vertical">
          {!initialState?.currentUser?.githubUserId ? (
            <Button type="primary" loading={actionLoading} onClick={() => handleRelevance('github')}>
              关联 github 账号
            </Button>
          ) : (
            <Typography.Text type="success">
              <SmileOutlined /> 您已关联 github 账号
            </Typography.Text>
          )}
          {!initialState?.currentUser?.gitlabUserId ? (
            <Button type="primary" loading={actionLoading} onClick={() => handleRelevance('gitlab')}>
              关联 gitlab 账号
            </Button>
          ) : (
            <Typography.Text type="success">
              <SmileOutlined /> 您已关联 gitlab 账号
            </Typography.Text>
          )}
        </Space>
      </Card>
    </PageContainer>
  )
}

export default associatedAccount
