import { useState, useEffect } from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import { 
  Card,
  Radio,
  Button,
  Row,
  Col,
  Empty,
  Space,
  Typography,
  notification,
} from 'antd'
import { SyncOutlined, SearchOutlined } from '@ant-design/icons'
import { Link, useRequest } from 'umi'

import { NOTIFICATION_SETTING_KEY, OFFEN_USE_PROJECTS_KEY } from '@/config'
import { getChangelogs } from '@/services/changelog'
import { getFormatDate } from '@/utils'
import { dictsToMap } from '@/utils/filter'
import { mode as modes } from '@/dicts/app'

const modeMap = dictsToMap(modes)

export default function Welcome() {
  const [notificationSetting, setnotificationSetting] = useState(
    JSON.parse(localStorage.getItem(NOTIFICATION_SETTING_KEY) || '{}')
  )
  const offenUseProjects = JSON.parse(localStorage.getItem(OFFEN_USE_PROJECTS_KEY) || '[]')

  const [statusTimestamp, setStatusTimestamp] = useState(Date.now())
  const { loading, data = [] } = useRequest(async () => {
    const res = await getChangelogs({ status: 'PENDING' })
    return res
  }, {
    refreshDeps: [statusTimestamp],
  })

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

  const renderLoadingTasks = () => {
    if (data.length === 0) {
      return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
    }
    const cards = data.map((changelog) => (
      <Col span={6} key={changelog.id}>
        <Card
          type="inner"
          style={{ marginBottom: 24 }}
          title={(
            <Link to={`/project/${changelog.project}/changelog/detail?id=${changelog.id}`}>
              {`[${changelog.id}] ${changelog.projectName} | ${changelog.branch}`}
            </Link>
          )}
        >
          <Row>
            <Col span={12}>发布环境：{modeMap[changelog.environment]}</Col>
            <Col span={12}>发布类型：{changelog.type}</Col>
            <Col span={24}>创建时间：{getFormatDate(changelog.createdTime)}</Col>
            <Col span={24}>发布描述：{changelog.description}</Col>
          </Row>
        </Card>
      </Col>
    ))
    return <Row gutter={24}>{cards}</Row>
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
      <Card
        style={{ marginTop: 15 }}
        title={
          <Space>
            <span>运行中的任务</span>
            <Button
              size="small"
              icon={<SyncOutlined />}
              loading={loading}
              onClick={() => setStatusTimestamp(Date.now())}
            >刷新</Button>
            <Typography.Text type="secondary">{getFormatDate(statusTimestamp)}</Typography.Text>
          </Space>
        }
        extra={<Button type="link" onClick={() => window.open('/queues/queue/changelog')}>任务队列面板</Button>}
      >
        {renderLoadingTasks()}
      </Card>
    </PageContainer>
  )
}
