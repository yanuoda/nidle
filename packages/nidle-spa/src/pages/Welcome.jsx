import { useState, useEffect } from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import { Card, Radio, Button, notification } from 'antd'
import { Link } from 'umi'

import { NOTIFICATION_SETTING_KEY, OFFEN_USE_PROJECTS_KEY } from '@/config'

export default function Welcome() {
  const [notificationSetting, setnotificationSetting] = useState(
    JSON.parse(localStorage.getItem(NOTIFICATION_SETTING_KEY) || '{}')
  )
  const offenUseProjects = JSON.parse(localStorage.getItem(OFFEN_USE_PROJECTS_KEY) || '[]')

  const setnotificationMode = val => {
    setnotificationSetting(_setting => ({ ..._setting, mode: val }))
  }

  const renderShortcut = () => {
    if (!offenUseProjects.length) {
      return '暂无'
    }
    return offenUseProjects.map(({ id, name }) => (
      <Link key={id} to={`/project/publish?id=${id}&name=${name}`}>
        <Button key={id} type="link">
          {name}
        </Button>
      </Link>
    ))
  }

  useEffect(() => {
    localStorage.setItem(NOTIFICATION_SETTING_KEY, JSON.stringify(notificationSetting))
  }, [notificationSetting])

  return (
    <PageContainer>
      <Card title="通知设置">
        <Radio.Group
          optionType="button"
          buttonStyle="solid"
          options={[
            { label: '接收所有通知', value: 'all' },
            { label: '屏蔽所有通知', value: 'block' },
            { label: '只接收"常用"的应用', value: 'offenUse' }
          ]}
          onChange={e => setnotificationMode(e.target.value)}
          value={notificationSetting.mode || 'all'}
        />
      </Card>
      <Card title="快捷入口" style={{ marginTop: 15 }}>
        {renderShortcut()}
      </Card>
    </PageContainer>
  )
}
