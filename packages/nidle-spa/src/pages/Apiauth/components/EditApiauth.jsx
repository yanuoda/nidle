import { useRef, useEffect } from 'react'
import { Row, Col, Modal, Space, message } from 'antd'
import ProForm, { ProFormText, ProFormRadio } from '@ant-design/pro-form'

import { addApiauthList, modifyApiauthList } from '@/services/apiauth'

const EditApiauth = ({ open, editData, onClose }) => {
  const modalFormRef = useRef()

  const modalFormSubmit = async values => {
    const params = { ...values }
    let reqMethod = addApiauthList
    if (editData.id) {
      params.id = editData.id
      reqMethod = modifyApiauthList
    }
    console.log(params)
    const result = await reqMethod(params)
    const { success } = result || {}
    if (success) {
      message.success('保存成功')
      modalClose(true)
    }
  }
  const modalClose = refresh => {
    onClose?.(refresh)
  }

  useEffect(() => {
    modalFormRef.current?.resetFields()
    if (editData.id) {
      modalFormRef.current?.setFieldsValue(editData)
    } else {
      modalFormRef.current?.setFieldsValue({ environment: editData.environment, status: 1 })
    }
  }, [editData])

  return (
    <>
      <Modal
        title={`${editData.id ? '编辑' : '新增'}接口调用权限配置`}
        open={open}
        footer={null}
        onCancel={() => modalClose()}
      >
        <ProForm
          formRef={modalFormRef}
          layout="vertical"
          submitter={{
            render(props, doms) {
              return <Space style={{ width: '100%', justifyContent: 'end' }}>{doms}</Space>
            }
          }}
          onFinish={modalFormSubmit}
        >
          <Row gutter={30}>
            <Col flex="50%">
              <ProFormText name="name" label="名称" rules={[{ required: true, message: '请输入名称' }]} />
            </Col>
            <Col flex="50%">
              <ProFormRadio.Group
                name="status"
                label="状态"
                options={[
                  { label: '启用', value: 1 },
                  { label: '禁用', value: 0 }
                ]}
                radioType="button"
              />
            </Col>
          </Row>
          <ProFormText name="description" label="描述" />
        </ProForm>
      </Modal>
    </>
  )
}

export default EditApiauth
