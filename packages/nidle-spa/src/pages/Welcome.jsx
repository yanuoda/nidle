import { PageContainer } from '@ant-design/pro-layout'
import { Card, Typography } from 'antd'

export default function Welcome() {
  return (
    <PageContainer>
      <Card>
        <Typography.Text strong>Welcome to Nidle!</Typography.Text>
      </Card>
    </PageContainer>
  )
}
