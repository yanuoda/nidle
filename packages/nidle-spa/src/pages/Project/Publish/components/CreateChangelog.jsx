import { useState } from 'react'
import { useRequest, history } from 'umi'
import { Row, Col, Button } from 'antd'
import ProForm, { ModalForm, ProFormSelect, ProFormText } from '@ant-design/pro-form'
import { PlusOutlined } from '@ant-design/icons'

import { fetchBranches, create } from '@/services/changelog'
import { mode as modeOptions } from '@/dicts/app'

const publishTypes = [
  {
    label: '通用发布',
    value: 'normal'
  },
  {
    label: 'webhook自动部署',
    value: 'webhook'
  }
]

const CreateChangelog = ({ projectId }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isBranchLoading, setIsBranchLoading] = useState(false)
  const [searchInput, setSearchInput] = useState()

  const { data: branchesOptions } = useRequest(async () => {
    setIsBranchLoading(true)
    const res = await fetchBranches(projectId, searchInput || undefined)
    setIsBranchLoading(false)
    return res
  }, {
    debounceInterval: 300,
    refreshDeps: [searchInput],
  })

  const onFinish = async values => {
    setIsLoading(true)
    const { data, success, errorMessage } = await create({ ...values, projectId })
    setIsLoading(false)
    if (success === true) {
      history.push(`/project/${projectId}/changelog/detail?id=${data.changelog.id}`)
    }
    return true
  }

  return (
    <ModalForm
      title="新建发布"
      width={500}
      layout="vertical"
      trigger={
        <Button type="primary" loading={isLoading}>
          <PlusOutlined />
          新建发布
        </Button>
      }
      initialValues={{
        type: 'normal',
        mode: modeOptions[0].value
      }}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true
      }}
      onFinish={onFinish}
    >
      <Row gutter={30}>
        <Col flex="50%">
          <ProFormSelect
            options={publishTypes}
            name="type"
            label="发布类型"
            allowClear={false}
            rules={[{ required: true, message: '请选择发布类型' }]}
          />
        </Col>
        <Col flex="50%">
          <ProFormSelect
            options={modeOptions}
            name="mode"
            label="发布环境"
            allowClear={false}
            rules={[{ required: true, message: '请选择发布环境' }]}
          />
        </Col>
      </Row>
      <ProFormSelect
        fieldProps={{
          showSearch: true,
          filterOption: false,
          onSearch: setSearchInput,
          options: branchesOptions || [],
          allowClear: false,
          loading: isBranchLoading,
        }}
        name="branch"
        label="分支"
        rules={[{ required: true, message: '请选择分支' }]}
      />
      <ProFormText name="description" label="描述" />
    </ModalForm>
  )
}

export default CreateChangelog
