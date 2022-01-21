import { PageContainer } from '@ant-design/pro-layout'
import ProForm, { ProFormText } from '@ant-design/pro-form'
import { Card, Typography, message } from 'antd'
import { Link } from 'umi'
import { useEffect, useState } from 'react'
import Editor from 'react-simple-code-editor'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import 'highlight.js/styles/base16/atelier-savanna-light.css'

import { queryTemplate, addTemplate, modifyTemplate } from '@/services/template'
import styles from './index.less'

hljs.registerLanguage('javascript', javascript)

const TemplateDetail = props => {
  const { id, name } = props.location.query || {}

  const [code, setCode] = useState(`module.exports = {\n  name: '',\n  description: ''\n}`)
  const [templateDetail, setTemplateDetail] = useState({})
  const [pageLoading, setPageLoading] = useState(true)

  useEffect(async () => {
    if (!id) {
      setPageLoading(false)
      return
    }

    const { data, success } = await queryTemplate({ id })
    if (success) {
      setTemplateDetail(data)
      setCode(data.config)
      setPageLoading(false)
    }
  }, [])

  // 面包屑导航自定义
  const routes = [
    {
      path: '/template/list',
      breadcrumbName: '模板列表'
    },
    {
      path: '/template/detail',
      breadcrumbName: '模板详情'
    }
  ]
  if (name) {
    routes.splice(1, 0, {
      path: '',
      breadcrumbName: name
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
      <Card>
        <ProForm
          layout="vertical"
          submitter={{
            searchConfig: {
              submitText: '保存'
            }
          }}
          onFinish={async values => {
            const params = { config: code, ...values }
            let reqMethod = addTemplate
            if (id) {
              params.id = id
              reqMethod = modifyTemplate
            }
            const result = await reqMethod(params)
            const { success, data } = result || {}
            if (success) {
              window.location.href = `/template/detail?id=${data?.id}&name=${data?.name}`
              message.success('配置模板保存成功，正在刷新页面...')
            }
          }}
          initialValues={{ name, description: templateDetail.description }}
        >
          <ProFormText width="xl" name="name" label="配置模板名称" placeholder="请输入模板名称" />
          <ProFormText width="xl" name="description" label="配置模板描述" placeholder="请输入模板描述" />
          <Typography.Text className={styles.editorTitle}>配置模板</Typography.Text>
          <Editor
            value={code}
            onValueChange={code => setCode(code)}
            highlight={code => hljs.highlight(code, { language: 'javascript' }).value}
            padding={10}
            className={styles.codeEditor}
          />
        </ProForm>
      </Card>
    </PageContainer>
  )
}

export default TemplateDetail
