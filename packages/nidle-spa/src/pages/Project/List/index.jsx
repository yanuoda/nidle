import { useEffect, useState } from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import ProTable from '@ant-design/pro-table'
import { Button, Tag } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Link } from 'umi'

import { queryProjectList } from '@/services/project'

const OFFEN_USE_PROJECTS_KEY = 'OFFEN_USE_PROJECTS_KEY'

const ProjectList = () => {
  const [offenUseProjects, setoffenUseProjects] = useState(
    JSON.parse(localStorage.getItem(OFFEN_USE_PROJECTS_KEY) || '[]')
  )

  const addOffenUse = (_id, name) => {
    setoffenUseProjects(_arr => {
      if (_arr.find(({ id }) => id === _id)) return _arr
      return [..._arr, { id: _id, name }]
    })
  }
  const removeOffenUse = _id => {
    setoffenUseProjects(_arr => _arr.filter(({ id }) => id !== _id))
  }

  const renderTags = () => {
    if (!offenUseProjects.length) {
      return <Tag style={{ borderStyle: 'dashed', pointerEvents: 'none' }}>操作栏添加</Tag>
    }
    return offenUseProjects.map(({ id, name }) => (
      <Tag key={id} closable onClose={() => removeOffenUse(id)}>
        <Link to={`/project/publish?id=${id}&name=${name}`}>{name}</Link>
      </Tag>
    ))
  }

  useEffect(() => {
    localStorage.setItem(OFFEN_USE_PROJECTS_KEY, JSON.stringify(offenUseProjects))
  }, [offenUseProjects])

  return (
    <PageContainer
      header={{
        title: null
      }}
    >
      <ProTable
        columns={[
          {
            title: '应用',
            dataIndex: 'name',
            align: 'center',
            render: (dom, { repositoryUrl, name }) => {
              return (
                <a href={repositoryUrl} target="_blank" rel="noreferrer">
                  {name}
                </a>
              )
            }
          },
          {
            title: '描述',
            dataIndex: 'description',
            align: 'center'
          },
          {
            title: '负责人',
            dataIndex: 'owner',
            align: 'center'
          },
          {
            title: '仓库平台',
            dataIndex: 'repositoryType',
            align: 'center'
          },
          {
            title: '操作',
            dataIndex: 'option',
            valueType: 'option',
            align: 'center',
            width: 300,
            render: (dom, { id, name }) => [
              <Link key={`settings-${id}`} to={`/project/settings?id=${id}&name=${name}`}>
                设置
              </Link>,
              <Link key={`publish-${id}`} to={`/project/publish?id=${id}&name=${name}`}>
                发布记录
              </Link>,
              <Button key={`offen-use-${id}`} type="link" onClick={() => addOffenUse(id, name)}>
                添加常用
              </Button>
            ]
          }
        ]}
        request={queryProjectList}
        rowKey="id"
        bordered
        search={{
          labelWidth: 'auto'
        }}
        pagination={{
          pageSize: 10
        }}
        toolBarRender={() => [
          <div key="offenUse">常用：{renderTags()}</div>,
          <Link key="newProject" to={`/project/settings`}>
            <Button key="button" icon={<PlusOutlined />} type="primary">
              新建
            </Button>
          </Link>
        ]}
      />
    </PageContainer>
  )
}

export default ProjectList
