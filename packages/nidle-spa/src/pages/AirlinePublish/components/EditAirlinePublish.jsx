import { useState, useRef, useEffect } from 'react'
import { Row, Col, Modal, Space, Button, Select, message } from 'antd'
import ProTable from '@ant-design/pro-table'
import ProForm, { ProFormText, ProFormRadio, ProFormSelect } from '@ant-design/pro-form'

import { mode as modeOptions } from '@/dicts/app'
import { addAirlinePublishList, modifyAirlinePublishList } from '@/services/airline-publish'
import { queryProjectList, getProjectServer } from '@/services/project'

const EditAirlinePublish = ({ open, editData, onClose }) => {
  const [serverPathModalOpen, setServerPathModalOpen] = useState(false)
  const [projectOpts, setProjectOpts] = useState([])
  const [projectServerData, setProjectServerData] = useState({
    project: undefined,
    env: modeOptions[0].value
  })
  const modalFormRef = useRef()

  const openServerPathModal = async () => {
    setServerPathModalOpen(true)
    if (projectOpts.length === 0) {
      const { data } = await queryProjectList({ pageSize: 99 })
      setProjectOpts(data.map(({ id, name }) => ({ label: name, value: id })))
    }
  }
  const setProjectServerDataByKey = (key, val) => {
    setProjectServerData(_obj => ({ ..._obj, [key]: val }))
  }
  const selectedServerPath = record => {
    modalFormRef.current.setFieldsValue({
      environment: projectServerData.env,
      projectServer: record.id,
      projectServerOutput: record.output
    })
    setServerPathModalOpen(false)
  }

  const modalFormSubmit = async values => {
    const params = { ...values }
    let reqMethod = addAirlinePublishList
    if (editData.id) {
      params.id = editData.id
      reqMethod = modifyAirlinePublishList
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
        title={`${editData.id ? '编辑' : '新增'}航司服务器关系`}
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
            {/* <Col flex="50%">
              <ProFormText name="airline" label="航司" rules={[{ required: true, message: '请输入航司' }]} />
            </Col> */}
            <Col flex="50%">
              <ProFormSelect
                name="airline"
                label="航司"
                rules={[{ required: true, message: '请选择航司' }]}
                options={['8L', '9H', 'FU', 'GS', 'GX', 'HU', 'JD', 'PN', 'UQ', 'Y8']}
              />
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
          <div style={{ display: 'none' }}>
            <ProFormText name="environment" label="environment" />
            <ProFormText name="projectServer" label="projectServer" />
          </div>
          <ProFormText
            name="projectServerOutput"
            label={
              <Space>
                <span>服务器发布路径</span>
                <Button size="small" onClick={openServerPathModal}>
                  选择路径
                </Button>
              </Space>
            }
            placeholder=""
            rules={[{ required: true, message: '请选择路径' }]}
            disabled
          />
          <ProFormText name="relativePath" label="相对路径" placeholder="支持 ../xx " />
          <ProFormText name="description" label="描述" />
        </ProForm>
      </Modal>
      {/* 选择服务器发布路径 */}
      <Modal
        title="选择服务器发布路径"
        width={1000}
        bodyStyle={{ padding: '24px 0 0 0' }}
        open={serverPathModalOpen}
        onCancel={() => setServerPathModalOpen(false)}
        footer={null}
      >
        <Row align="middle" gutter={10}>
          <Col style={{ paddingLeft: 30 }}>项目</Col>
          <Col span={5}>
            <Select
              value={projectServerData.project}
              options={projectOpts || []}
              onChange={val => setProjectServerDataByKey('project', val)}
              placeholder="请选择项目"
              showSearch
              filterOption={(input, option) => {
                return (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }}
              style={{ width: '100%' }}
            />
          </Col>
          <Col style={{ paddingLeft: 30 }}>所属环境</Col>
          <Col span={5}>
            <Select
              value={projectServerData.env}
              options={modeOptions}
              onChange={val => setProjectServerDataByKey('env', val)}
              disabled={!projectServerData.project}
              style={{ width: '100%' }}
            />
          </Col>
        </Row>
        <ProTable
          columns={[
            {
              title: '机器名',
              dataIndex: 'name',
              key: 'name',
              width: 120
            },
            {
              title: 'IP',
              dataIndex: 'ip',
              key: 'ip',
              width: 120
            },
            {
              title: '路径',
              dataIndex: 'output',
              key: 'output'
            },
            {
              title: '描述',
              dataIndex: 'description',
              key: 'description'
            },
            {
              title: '操作',
              key: 'action',
              width: 100,
              render: (text, record) => (
                <Button type="link" onClick={() => selectedServerPath(record)}>
                  选择路径
                </Button>
              )
            }
          ]}
          request={getProjectServer}
          params={{ id: projectServerData.project, mode: projectServerData.env }}
          postData={data => {
            return data.map(({ id, Server, output, description }) => ({
              id,
              name: Server.name,
              ip: Server.ip,
              output,
              description
            }))
          }}
          manualRequest
          rowKey="id"
          pagination={{ pageSize: 10 }}
          search={false}
        />
      </Modal>
    </>
  )
}

export default EditAirlinePublish
