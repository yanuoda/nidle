import { PageContainer } from '@ant-design/pro-layout'
import { Card } from 'antd'
import { Button } from 'antd'
import { useModel } from 'umi'

const associatedAccount = () => {
  const { initialState } = useModel('@@initialState')
  const type = initialState?.currentUser?.githubUserId ? 'gitlab' : 'github'
  const handleRelevance = () => {
    console.log(initialState)
    console.log(type)
    window.location.href = `/api/oauth?type=${type}`
  }

  return (
    <PageContainer waterMarkProps={{}} header={{ title: '关联账号' }}>
      <Card>
        <Button type="primary" onClick={handleRelevance}>{`关联 ${type} 账号`}</Button>
      </Card>
    </PageContainer>
  )
}

export default associatedAccount
