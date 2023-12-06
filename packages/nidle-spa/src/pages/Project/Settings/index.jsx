import { PageContainer } from '@ant-design/pro-layout'
import { Button } from 'antd'
import { Link, history } from 'umi'
import { useState, useEffect } from 'react'

import BasicInfo from './BasicInfo'
import ConfigInfo from './ConfigInfo'
import ContactsInfo from './ContactsInfo'
import MemberInfo from './MemberInfo'
import ServerInfo from './ServerInfo'
import { queryProjectDetail } from '@/services/project'

const ProjectSettings = props => {
  const { name: projectName, id } = props.location.query
  const [pageLoading, setPageLoading] = useState(true)
  const [projectData, setProjectData] = useState({})

  useEffect(async () => {
    // 请求项目数据
    if (id) {
      const res = await queryProjectDetail({ id })
      const { success, data } = res || {}
      if (success) {
        setProjectData(data)
      }
    }

    setPageLoading(false)
  }, [])

  // 面包屑导航自定义
  const routes = [
    {
      path: '/project/list',
      breadcrumbName: '应用列表'
    },
    undefined,
    {
      breadcrumbName: '应用配置'
    }
  ]
  if (id) {
    routes[1] = { breadcrumbName: projectName || id }
  }

  return (
    <PageContainer
      loading={pageLoading}
      waterMarkProps={{}}
      header={{
        title: id ? `应用：${projectName}` : '新增应用',
        breadcrumb: {
          routes: routes.filter(Boolean),
          itemRender({ path, breadcrumbName, extraJump }) {
            if (path) return <Link to={path}>{breadcrumbName}</Link>
            return <span>{breadcrumbName}</span>
          }
        },
        extra: id ? [
          <Button
            type="default"
            onClick={() => {
              history.push(`/project/publish?id=${id}&name=${projectName}`)
            }}
          >
            应用发布记录
          </Button>,
          <Button
            key="projectWebhooks"
            type="default"
            onClick={() => {
              history.push(`/project/webhooks?id=${id}&name=${projectName}`)
            }}
          >
            应用webhooks
          </Button>,
        ] : null,
      }}
    >
      <BasicInfo projectData={projectData} />
      {/* 只有存在 id 的时候才展示其他板块 */}
      {id && (
        <>
          <ConfigInfo projectData={projectData} />
          <ServerInfo projectData={projectData} />
          <MemberInfo projectData={projectData} />
          <ContactsInfo projectData={projectData} />
        </>
      )}
    </PageContainer>
  )
}

export default ProjectSettings
