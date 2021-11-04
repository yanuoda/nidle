import { Card, Typography } from 'antd'
import { PageContainer } from '@ant-design/pro-layout'

export default function Admin() {
  return (
    <PageContainer>
      <Card>
        <Typography.Text>这个页面只有 admin 权限才能查看</Typography.Text>
      </Card>
    </PageContainer>
  )
}
