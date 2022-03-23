import { useRequest, history } from 'umi'
import { Button } from 'antd'
import ProForm, { ModalForm, ProFormSelect } from '@ant-design/pro-form'
import { PlusOutlined } from '@ant-design/icons'

import { fetchBranches } from '@/services/changelog'

const CreateChangelog = props => {
  const { data: options } = useRequest(() => {
    return fetchBranches(props.projectId, props.projectType)
  })

  return (
    <ModalForm
      title="新建发布"
      width={500}
      layout="horizontal"
      trigger={
        <Button type="primary">
          <PlusOutlined />
          新建发布
        </Button>
      }
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true
      }}
      onFinish={values => {
        history.push(
          `/project/${props.projectId}/changelog/detail?branch=${values.branch}&projectName=${props.projectName}&projectType=${props.projectType}`
        )
        return true
      }}
    >
      <ProForm.Group>
        <ProFormSelect
          options={options || []}
          width="md"
          name="branch"
          label="分支"
          rules={[{ required: true, message: '请选择分支' }]}
        />
      </ProForm.Group>
    </ModalForm>
  )
}

export default CreateChangelog
