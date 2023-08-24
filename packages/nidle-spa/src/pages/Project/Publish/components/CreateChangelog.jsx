import { useState } from 'react'
import { useRequest, history } from 'umi'
import { Button } from 'antd'
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
      <ProForm.Group>
        <ProFormSelect
          options={publishTypes}
          width="300px"
          name="type"
          label="发布类型"
          rules={[{ required: true, message: '请选择发布类型' }]}
        />
        <ProFormSelect
          options={options || []}
          width="300px"
          name="branch"
          label="分支"
          rules={[{ required: true, message: '请选择分支' }]}
        />
        <ProFormSelect
          options={modeOptions}
          width="300px"
          name="mode"
          label="发布环境环境"
          rules={[{ required: true, message: '请选择发布环境' }]}
        />
        <ProFormText
          width="300px"
          name="description"
          label="描述"
        />
      </ProForm.Group>
    </ModalForm>
  )
}

export default CreateChangelog
