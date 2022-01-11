import { ProFormText, ModalForm, ProFormSelect } from '@ant-design/pro-form'
import { Button, message } from 'antd'
import { useState, useEffect } from 'react'
import { useRequest } from 'umi'
import { PlusOutlined } from '@ant-design/icons'
import { addProjectServer } from '@/services/project'
import { queryServerList } from '@/services/server'

const AddProjectServer = props => {
  // TODO: type = add 只添加、all 添加、修改
  const { type, mode, projectId } = props
  console.log(type)
  const [serverModalVisible, setServerModalVisible] = useState(false)
  const [serverList, setServerList] = useState([])
  const { data: servers, loading } = useRequest(() => {
    return queryServerList({
      environment: mode
    })
  })

  useEffect(() => {
    if (servers && servers.length) {
      const list = servers.map(item => {
        return {
          value: item.id,
          label: `${item.name}[${item.ip}]`,
          disabled: !item.status
        }
      })
      setServerList(list)
    }
  }, [servers])

  // 新增机器弹窗
  const handleTriggerAddModal = () => {
    setServerModalVisible(true)
  }

  // 新增机器信息提交
  const handleAddServer = async values => {
    const { server, output } = values

    try {
      const { success, data, errorMessage } = await addProjectServer({
        project: projectId,
        environment: mode,
        server: parseInt(server),
        output
      })

      if (success) {
        message.success('添加成功！')
        props.onChange('add', data)
        setServerModalVisible(false)
      } else {
        message.error(errorMessage)
      }
    } catch (err) {
      console.error('handleAddServer error: ', err)
      message.error(err.message)
    }
  }

  return (
    <>
      <Button style={{ marginTop: '20px' }} type="primary" onClick={handleTriggerAddModal}>
        <PlusOutlined />
        新增机器
      </Button>
      <ModalForm
        title={`新增机器`}
        width={500}
        layout="horizontal"
        visible={serverModalVisible}
        modalProps={{ destroyOnClose: true }}
        onVisibleChange={setServerModalVisible}
        onFinish={handleAddServer}
        initialValues={{}}
      >
        <ProFormSelect
          name="server"
          label="选择机器"
          options={serverList}
          placeholder="请选择机器"
          required
          loading={loading}
          rules={[{ required: true, message: '请选择一个机器！' }]}
        />
        <ProFormText
          name="output"
          label="部署目录"
          placeholder="请输入部署目录"
          required
          rules={[{ required: true, message: '请输入部署目录！' }]}
        />
      </ModalForm>
    </>
  )
}

export default AddProjectServer
