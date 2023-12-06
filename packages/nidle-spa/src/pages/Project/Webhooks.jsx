import { useState } from 'react'
import { PageContainer } from '@ant-design/pro-layout'
// import ProTable from '@ant-design/pro-table'
import { Button, Row, Col, Card, Modal, Table } from 'antd'
// import { PlusOutlined } from '@ant-design/icons'
import { Link, history, useRequest } from 'umi'

import { getWebhooks, invokeWebhooks } from '@/services/project'
import { dictsToMap } from '@/utils/filter'
import { mode as modes } from '@/dicts/app'

const modeMap = dictsToMap(modes)

const Webhooks = (props) => {
  const { name: projectName, id: projectId } = props.location.query
  const { loading, data = {} } = useRequest(async () => {
    return await getWebhooks({ id: projectId })
  })

  const [activeBranch,  setActiveBranch] = useState('')
  const [modalOpen,  setModalOpen] = useState(false)

  const onWebhookClick = (branch) => {
    setActiveBranch(branch)
    setModalOpen(true)
  }
  const getEnvStr = (changelogs) => {
    const envSet = new Set(changelogs.map(({ environment }) => environment))
    return Array.from(envSet).map((env) => modeMap[env]).join('、')
  }

  const onSubmit = async () => {
    const { data, success, errorMessage } = await invokeWebhooks({ id: projectId, branch: activeBranch });
    if (success === true) {
      message.success('触发成功')
    } else {
      message.error(errorMessage)
    }
  }

  const renderWebhook = (branchGroup) => {
    return Object.entries(branchGroup).map(([branch, changelogs]) => (
      <Col span={6} key={branch}>
        <Card
          // type="inner"
          title={branch}
          style={{ marginBottom: 24 }}
          extra={<Button onClick={() => onWebhookClick(branch)}>手动触发</Button>}
        >
          <Row>
            <Col span={12}>可响应的发布：{changelogs.length} 个</Col>
            <Col span={24}>涉及的发布环境：{getEnvStr(changelogs)}</Col>
          </Row>
        </Card>
      </Col>
    ))
  }

  return (
    <PageContainer
      header={{
        title: `应用：${projectName}`,
        breadcrumb: {
          routes: [
            {
              path: '/project/list',
              breadcrumbName: '应用列表'
            },
            {
              breadcrumbName: projectName || projectId
            },
            {
              breadcrumbName: 'webhooks'
            }
          ],
          itemRender({ path, breadcrumbName }) {
            if (path) return <Link to={path}>{breadcrumbName}</Link>
            return <span>{breadcrumbName}</span>
          }
        },
        extra: projectId ? [
          <Button
            type="default"
            onClick={() => {
              history.push(`/project/publish?id=${projectId}&name=${projectName}`)
            }}
          >
            应用发布记录
          </Button>,
          <Button
            key="projectSettings"
            type="default"
            onClick={() => {
              history.push(`/project/settings?id=${projectId}&name=${projectName}`)
            }}
          >
            应用设置
          </Button>,
        ] : null,
      }}
    >
      <Row gutter={24}>{renderWebhook(data)}</Row>
      <Modal
        title="将触发以下任务"
        style={{ top: 60 }}
        width={800}
        open={modalOpen}
        onOk={onSubmit}
        onCancel={() => setModalOpen(false)}
        closable
      >
        <Table
          rowKey="id"
          dataSource={data[activeBranch]}
          columns={[
            {      
              title: '发布环境',
              dataIndex: 'environment',
              width: 120,
              render: (text) => modeMap[text],
            },
            {      
              title: 'CommitId',
              dataIndex: 'commitId',
              width: 120,
              render: (_, { commitId, commitUrl }) => {
                return (
                  <a href={commitUrl} target="_blank" rel="noreferrer">
                    {(commitId || '').slice(0, 10)}
                  </a>
                )
              },
            },
            {
              title: '描述',
              dataIndex: 'description',
            },
            {
              title: '操作',
              dataIndex: 'option',
              valueType: 'option',
              width: 100,
              render: (_, record, index) => {
                return (
                  <Link key="publish" to={`/project/${projectId}/changelog/detail?id=${record.id}`}>
                    <Button type="link" style={{ padding: '4px 0' }}>发布详情</Button>
                  </Link>
                )
              },
            },
          ]}
        />
      </Modal>
    </PageContainer>
  )
}

export default Webhooks
