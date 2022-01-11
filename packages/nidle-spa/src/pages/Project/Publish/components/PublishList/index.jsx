import { useState } from 'react'
import ProTable from '@ant-design/pro-table'
import { ModalForm, ProFormSelect } from '@ant-design/pro-form'
import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

const PublishList = props => {
  const { columns, data, branches, showAddBtn } = props
  const [modalVisible, setModalVisible] = useState(false)
  // TODO: 发布日常
  const handleCreatePublish = () => {}
  const showCreateModal = () => setModalVisible(true)

  return (
    <>
      <ProTable
        columns={columns}
        dataSource={data}
        rowKey="id"
        bordered
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1200 }}
        search={false}
        toolBarRender={() => [
          showAddBtn ? (
            <Button onClick={showCreateModal} key="button" icon={<PlusOutlined />} type="primary">
              新建
            </Button>
          ) : null
        ]}
      />
      {showAddBtn ? (
        <ModalForm
          title="新建发布"
          width={500}
          layout="horizontal"
          visible={modalVisible}
          modalProps={{ destroyOnClose: true }}
          onVisibleChange={setModalVisible}
          onFinish={handleCreatePublish}
        >
          <ProFormSelect
            name="branch"
            label="选择分支"
            valueEnum={branches}
            placeholder="请选择发布分支"
            required
            rules={[{ required: true, message: '请选择发布分支！' }]}
          />
        </ModalForm>
      ) : null}
    </>
  )
}

export default PublishList
