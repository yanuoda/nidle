import { PageContainer } from '@ant-design/pro-layout'
import ProCard from '@ant-design/pro-card'
import { Tabs, Button, message } from 'antd'
import { useState, useEffect } from 'react'
import { Link, history, useRequest } from 'umi'
import { create, start, detail as fetchDetail, fetchLog } from '@/services/changelog'
import Steps from './components/Steps'
import Log from './components/Log'
import Inputs from './components/Inputs'
import Highlight from '@/components/Highlight'
import { status } from '@/dicts/changelog'
import { mode } from '@/dicts/app'
import { dictsToMap } from '@/utils/filter'
import './index.less'

const statusMap = dictsToMap(status)
const modeMap = dictsToMap(mode)

const App = props => {
  const [actionLoading, setActionLoading] = useState(false)
  const [config, setConfig] = useState({}) // 配置
  const [changelog, setChangelog] = useState({}) // 发布记录实例
  const [inputs, setInputs] = useState([]) // 输入配置
  const [current, setCurrent] = useState({ progress: 'start', stage: '' }) // 进度
  const [tabActive, setTabActive] = useState('inputs') // Tab Active
  const [logs, setLogs] = useState({}) // 日志
  const [serverList, setServerList] = useState([]) // 已选择发布服务器
  const [inputAnswers, setInputAnswers] = useState(null)
  // TODO: mode
  const { branch, projectName, id, mode = 'development' } = props.location.query
  const { id: projectId } = props.match.params

  const { data: detail, loading } = useRequest(() => {
    return id
      ? fetchDetail({
          id
        })
      : create({
          branch,
          projectId,
          mode
        })
  })

  useEffect(() => {
    if (detail) {
      const { config, changelog, inputs } = detail

      setConfig(config)
      setChangelog(changelog)
      setInputs(inputs)

      if (!id && changelog.id) {
        // 创建完跳到详情页，避免用户刷新页面重复创建
        history.replace(
          `/project/${projectId}/changelog/detail?branch=${branch}&id=${changelog.id}&projectName=${projectName}`
        )
      }
    }
  }, [detail])

  useEffect(() => {
    if (changelog) {
      let progress = 'start'

      if (changelog.statusEnum === 2) {
        progress = 'success'
      } else if (changelog.statusEnum !== 0) {
        progress = changelog.stage
      }

      setCurrent({ progress, stage: changelog.stage })
    }
  }, [changelog])

  let interval

  useEffect(() => {
    const { statusEnum } = changelog

    if (statusEnum === 0) {
      setTabActive('inputs')
      return
    }

    setTabActive('log')
    if (statusEnum === 1) {
      interval = setInterval(async () => {
        getLogs()
      }, 2000)

      return () => {
        clearInterval(interval)
      }
    } else if (statusEnum > 1) {
      getLogs()
    }
  }, [changelog.statusEnum])

  const getLogs = async () => {
    const { data, success, errorMessage } = await fetchLog({
      logPath: config.log.all,
      id: changelog.id,
      type: 'all'
    })

    if (success === true) {
      setLogs(data)
      setChangelog({
        ...changelog,
        status: data.status,
        statusEnum: data.statusEnum,
        stage: data.stage
      })

      if (data.statusEnum > 1 && interval) {
        clearInterval(interval)
      }
    } else {
      message.error(errorMessage)
    }
  }

  // 面包屑导航自定义
  const routes = [
    {
      path: '/project/list',
      breadcrumbName: '应用管理'
    },
    {
      // TODO
      path: '',
      breadcrumbName: projectName || changelog.projectName || '应用'
    },
    {
      path: '',
      breadcrumbName: id ? '发布详情' : '新建发布'
    }
  ]
  const handlerNildeAction = async () => {
    setActionLoading(true)

    try {
      if (changelog.statusEnum === 1) {
        // 发布中取消
        console.log('取消')
        setActionLoading(false)
      } else {
        if (!serverList || !serverList.length) {
          message.error('请选择发布服务器')
          setActionLoading(false)
          return
        }

        // 开始、重新开始
        if (changelog.statusEnum === 3) {
          // TODO: 重新开始，创建新的发布记录
        }

        const { success, errorMessage } = await start({
          id: changelog.id,
          configPath: changelog.configPath,
          inputs,
          servers: serverList
        })

        if (success === true) {
          message.success('发布任务开始', function () {
            setChangelog({
              ...changelog,
              status: 'PENDING',
              statusEnum: 1
            })
            setActionLoading(false)
          })
        } else {
          setActionLoading(false)
          message.error(errorMessage)
        }
      }
    } catch (err) {
      setActionLoading(false)
      message.error(err.message)
    }
  }
  const handlerStepsChange = stage => {
    setCurrent({ progress: current.progress, stage })
  }

  const BaseInfo = (
    <ProCard
      title="基础信息"
      hoverable
      extra={
        changelog.statusEnum !== 2 && (
          <Button
            type={changelog.statusEnum === 1 ? 'warning' : 'primary'}
            onClick={() => handlerNildeAction()}
            loading={actionLoading}
          >
            {changelog.statusEnum === 1 ? '取消' : changelog.statusEnum !== 0 ? '重新开始' : '开始'}
          </Button>
        )
      }
    >
      <table className="mod-baseinfo">
        <tbody>
          <tr>
            <th>分支:</th>
            <td>{changelog.branch}</td>
            <th>CommitId:</th>
            <td>{changelog.commitId || '-'}</td>
            <th>发起人:</th>
            <td>{config.repository && config.repository.userName}</td>
          </tr>
          <tr>
            <th>持续时间:</th>
            <td>{logs.duration || '-'}</td>
            <th>状态:</th>
            <td>{statusMap[changelog.status + ''] || changelog.status}</td>
            <th>环境:</th>
            <td>{modeMap[changelog.environment] || changelog.environment}</td>
          </tr>
        </tbody>
      </table>
    </ProCard>
  )

  const handlerInput = (type, values) => {
    if (type === 'server') {
      setServerList(values)
    } else if (type === 'input') {
      setInputAnswers(values)
      console.log(inputAnswers)
    }
  }

  const TabContainer = (
    <ProCard style={{ marginTop: '20px' }}>
      <Tabs
        activeKey={tabActive}
        onChange={activeKey => {
          setTabActive(activeKey)
        }}
      >
        {changelog.statusEnum && (
          <Tabs.TabPane key="log" tab="日志">
            {logs.stages && <Log type="all" logs={logs} current={current}></Log>}
          </Tabs.TabPane>
        )}
        <Tabs.TabPane key="inputs" tab="Inputs">
          <Inputs
            projectId={projectId}
            changelogId={parseInt(id)}
            mode={mode}
            readonly={changelog.statusEnum !== 0 && changelog.statusEnum !== 3}
            config={config}
            inputs={inputs}
            onChange={handlerInput}
          ></Inputs>
        </Tabs.TabPane>
        {config && (
          <Tabs.TabPane key="config" tab="配置">
            <Highlight configRaw={JSON.stringify(config, '', 2)} type="javascript"></Highlight>
          </Tabs.TabPane>
        )}
      </Tabs>
    </ProCard>
  )

  return (
    <PageContainer
      loading={loading}
      waterMarkProps={{}}
      header={{
        title: null,
        breadcrumb: {
          routes,
          itemRender({ path, breadcrumbName }) {
            return !path ? <span>{breadcrumbName}</span> : <Link to={path}>{breadcrumbName}</Link>
          }
        }
      }}
    >
      {BaseInfo}
      <Steps
        status={changelog.status}
        progress={current.progress}
        stage={current.stage}
        stages={config.stages}
        onChange={handlerStepsChange}
      ></Steps>
      {TabContainer}
    </PageContainer>
  )
}

export default App
