import { PageContainer } from '@ant-design/pro-layout'
import { Link } from 'umi'
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
    {
      path: '/project/settings',
      breadcrumbName: '应用配置'
    }
  ]
  if (projectName) {
    routes.splice(1, 0, {
      path: '',
      breadcrumbName: projectName
    })
  }

  return (
    <PageContainer
      loading={pageLoading}
      waterMarkProps={{}}
      header={{
        title: null,
        breadcrumb: {
          routes,
          itemRender({ path, breadcrumbName }) {
            return location.pathname === path || !path ? (
              <span>{breadcrumbName}</span>
            ) : (
              <Link to={path}>{breadcrumbName}</Link>
            )
          }
        }
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
