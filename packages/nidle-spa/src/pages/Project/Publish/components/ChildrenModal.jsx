import { useState, useRef } from 'react'
import ProTable from '@ant-design/pro-table'
import {  Modal, Button, message } from 'antd'

import { getChildPublishList } from '@/services/publish'

import useColumns from '../hooks/useColumns'

const ChildrenModal = ({
  open,
  params,
  onClose,
}) => {
  const actionRef = useRef()

  const columns = useColumns({
    onReload: () => {
      actionRef?.current.reload();
    },
  })

  const handleCancel = () => {
    onClose && onClose();
  };

  return (
    <Modal
      title="历史记录"
      style={{ top: 60 }}
      width={1600}
      bodyStyle={{ padding: 0 }}
      open={open}
      footer={null}
      onCancel={handleCancel}
      closable
      destroyOnClose
    >
      <ProTable
        actionRef={actionRef}
        columns={columns}
        params={params || {}}
        request={getChildPublishList}
        rowKey="id"
        bordered
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1500 }}
        search={false}
      />
    </Modal>
  )
}

export default ChildrenModal