import { useState } from 'react'
import { useRequest, history } from 'umi'
import { Row, Col, Button } from 'antd'
import ProForm, { ModalForm, ProFormSelect, ProFormText } from '@ant-design/pro-form'
import { PlusOutlined } from '@ant-design/icons'

import { fetchBranches, create } from '@/services/changelog'

const publishTypes = [
  {
    label: '通用发布',
    value: 'normal'
  },
  {
    lable: 'webhook自动集成',
    value: 'webhook'
  }
]
const modeOptions = [
  {
    value: 'development',
    label: '测试环境'
  },
  {
    value: 'pre',
    label: '预发布环境'
  },
  {
    value: 'production',
    label: '生产环境'
  }
]

const CreateChangelog = props => {
  const [isLoading, setIsLoading] = useState(false)
  const { data: options } = useRequest(() => {
    return fetchBranches(props.projectId)
  })

  const onFinish = async values => {
    setIsLoading(true)
    const { data, success, errorMessage } = await create({ ...values, projectId: props.projectId })
    setIsLoading(false)
    if (success === true) {
      history.push(`/project/${props.projectId}/changelog/detail?id=${data.changelog.id}`)
    }
    // history.push(
    //   `/project/${props.projectId}/changelog/detail?branch=${values.branch}&type=${values.type}&projectName=${props.projectName}&mode=${values.mode}`
    // )
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
        <Col flex={1}>
          <ProFormSelect
            options={publishTypes}
            name="type"
            label="发布类型"
            allowClear={false}
            rules={[{ required: true, message: '请选择发布类型' }]}
          />
        </Col>
        <Col flex={1}>
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
        options={options || []}
        name="branch"
        label="分支"
        allowClear={false}
        rules={[{ required: true, message: '请选择分支' }]}
      />
      <ProFormText name="description" label="描述" />
    </ModalForm>
  )
}

export default CreateChangelog
