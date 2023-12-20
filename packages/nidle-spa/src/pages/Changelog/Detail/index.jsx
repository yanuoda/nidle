import { PageContainer } from '@ant-design/pro-layout'
import ProCard from '@ant-design/pro-card'
import { Tabs, Button, Space, Modal, message, Input, BackTop } from 'antd'
import { useState, useEffect, useRef } from 'react'
import { Link, history } from 'umi'
import { create, start, quit, detail as fetchDetail, fetchLog, updateChangelog } from '@/services/changelog'
import Steps, { PROGRESS_TYPES } from './components/Steps'
import Log from './components/Log'
import Inputs from './components/Inputs'
import Highlight from '@/components/Highlight'
import { status } from '@/dicts/changelog'
import { mode as modes } from '@/dicts/app'
import { getFormatDate } from '@/utils'
import { dictsToMap, getDuration } from '@/utils/filter'
import { ChangelogContext } from './context'
import './index.less'

const statusMap = dictsToMap(status)
const modeMap = dictsToMap(modes)
const intervalTime = 2000

const App = props => {
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  const [detail, setDetail] = useState() // 详情
  const [config, setConfig] = useState({}) // 配置 - may not need, just `detail.config`
  const [changelog, setChangelog] = useState({}) // 发布记录实例
  const [inputs, setInputs] = useState() // 输入配置 - may not need, just `detail.inputs`
  const [next, setNext] = useState({}) // 下一步

  const [logs, setLogs] = useState({}) // 日志
  const [current, setCurrent] = useState({ progress: PROGRESS_TYPES.start, stage: '' }) // 进度
  const [tabActive, setTabActive] = useState('inputs') // Tab Active
  const [inputAnswers, setInputAnswers] = useState(null) // inputs answer

  const [isEditDesc, setIsEditDesc] = useState(false)
  const [isEditDescLoading, setIsEditDescLoading] = useState(false)
  const [descInputVal, setDescInputVal] = useState()

  const { branch, type = 'normal', id, mode = modes[0].value, action } = props.location.query
  const { id: projectId } = props.match.params

  // 获取详情
  const getDetail = async () => {
    setLoading(true)
    const { data, success, errorMessage } = await fetchDetail({
      id
    })
    if (success === true) {
      setDetail(data)
    } else {
      message.error(errorMessage)
    }
    setLoading(false)
  }

  // 创建发布记录
  const createChangelog = async params => {
    setLoading(true)
    const { data, success, errorMessage } = await create(params)

    if (success === true) {
      message.success('新建发布成功')
      setDetail(data)
      setInputAnswers(null)

      // 创建完跳到详情页，避免用户刷新页面重复创建
      history.replace(`/project/${projectId}/changelog/detail?id=${data.changelog.id}`)

      // if (params.id) {
      //   message.success('新建发布成功，即将刷新页面。', function () {
      //     location.reload()
      //   })

      //   return
      // }

      setLoading(false)
      return true
    } else {
      message.error(errorMessage)
      setLoading(false)
      return false
    }
  }

  // 更新描述
  const updateDesc = async () => {
    setIsEditDescLoading(true)
    const { success } = await updateChangelog({ id: changelog.id, description: descInputVal }).catch(() => ({
      success: false
    }))
    if (success === true) {
      setChangelog(_obj => ({ ..._obj, description: descInputVal }))
      message.success('更新成功')
    }
    setIsEditDesc(false)
    setTimeout(() => {
      setIsEditDescLoading(false)
    }, 1)
  }

  // 页面进入初始化请求
  useEffect(async () => {
    if (!id) {
      await createChangelog({
        branch,
        type,
        mode,
        projectId
      })
    } else if (action === 'CREATE') {
      await createChangelog({
        id,
        branch,
        type,
        mode,
        projectId
      })
    } else {
      await getDetail()
    }
  }, [id])

  // 详情改变相关state
  useEffect(() => {
    if (detail) {
      const { config, changelog, inputs, next } = detail

      setConfig(config)
      setChangelog(changelog)
      setInputs(inputs || null)
      setNext(next)
      setLogs({})
    }
  }, [detail])

  // 进度条
  useEffect(() => {
    if (changelog) {
      let progress = PROGRESS_TYPES.start

      if (changelog.statusEnum === 2) {
        progress = PROGRESS_TYPES.success
      } else if (changelog.statusEnum === 4) {
        // 退出发布的状态
        progress = changelog.stage || (logs.duration ? PROGRESS_TYPES.success : PROGRESS_TYPES.start)
      } else if (changelog.statusEnum !== 0) {
        progress = changelog.stage
      }

      setCurrent({ progress, stage: changelog.stage })
    }
  }, [changelog])

  let interval

  // tab & 日志
  useEffect(() => {
    const { statusEnum, logPath } = changelog

    if (statusEnum === 0) {
      setTabActive('inputs')
      return
    }

    if (!logPath) {
      setTabActive('config')
      return
    }

    setTabActive('log')
    if (statusEnum === 1) {
      // 进行中，轮询日志
      interval = setInterval(async () => {
        getLogs()
      }, intervalTime)

      return () => {
        clearInterval(interval)
      }
    } else if (statusEnum > 1) {
      getLogs()
    }
  }, [changelog.statusEnum, changelog.id])

  const logsRef = useRef(logs)
  useEffect(() => {
    logsRef.current = logs
  }, [logs])

  // 日志请求
  const getLogs = async () => {
    const { data, success, errorMessage } = await fetchLog({
      logPath: config.log.all,
      id: changelog.id,
      type: 'all'
    })

    if (success === true) {
      if (!data) {
        setLogs({})
        // 说明此时任务在队列中等待
        setCurrent(_obj => ({ ..._obj, progress: PROGRESS_TYPES.waiting }))
        return
      }

      if (data.statusEnum > 1 && interval) {
        clearInterval(interval)
      }

      // 校准duration: 解决运行慢日志长时间没写入问题
      if (interval && logsRef.current.duration && logsRef.current.duration >= data.duration) {
        data.duration = logsRef.current.duration + intervalTime
        const last = data.stages.length - 1

        try {
          if (data.stages[last] && data.stages[last].steps.length) {
            data.stages[last].steps[data.stages[last].steps.length - 1].duration =
              logsRef.current.stages[last].steps[data.stages[last].steps.length - 1].duration + intervalTime
            data.stages[last].duration = logsRef.current.stages[last].duration + intervalTime
          }
        } catch (err) {
          console.error(err)
        }
      }

      setLogs(data)
      setChangelog({
        ...changelog,
        status: data.status,
        statusEnum: data.statusEnum,
        stage: data.stage
      })
      setNext(data.next)
    } else {
      message.error(errorMessage)

      if (interval) {
        clearInterval(interval)
      }
    }
  }

  // 面包屑导航自定义
  const routes = [
    {
      path: '/project/list',
      breadcrumbName: '应用管理'
    },
    {
      path: changelog ? `/project/publish?id=${changelog.project}&name=${changelog.projectName}` : '',
      breadcrumbName: changelog.projectName || '应用'
    },
    {
      path: '',
      breadcrumbName: id ? '发布详情' : '新建发布'
    }
  ]

  // 下一步
  const handlerNildeAction = async () => {
    try {
      if (next.next === 'START') {
        setActionLoading(true)
        // 开始构建
        if (inputs.length && !inputAnswers) {
          message.error('请先完成并保存Inputs配置！')
          setActionLoading(false)
          return
        }

        const { success, errorMessage } = await start({
          id: changelog.id,
          configPath: changelog.configPath,
          inputs,
          options: inputAnswers
        })

        if (success === true) {
          message.success('发布任务开始')
          setChangelog({
            ...changelog,
            status: 'PENDING',
            statusEnum: 1
          })
          setActionLoading(false)
        } else {
          setActionLoading(false)
          message.error(errorMessage)
        }
      } else if (next.next === 'CREATE') {
        // 新建发布记录
        setActionLoading(true)
        const success = await createChangelog({
          id: changelog.id,
          type: changelog.type,
          branch: changelog.branch,
          projectId: changelog.project,
          mode: next.environment.value
        })

        if (success === true) {
          // message.success(`创建${next.label}成功`)
        }
        setActionLoading(false)
      } else if (next.next === 'WAITING.CODEREVIEW') {
        window.open(`${config.repository.url}/merge_requests`)
      }
    } catch (err) {
      setActionLoading(false)
      message.error(err.message)
    }
  }

  // 退出发布
  const handlerNildeQuit = () => {
    Modal.confirm({
      title: '确定退出发布?',
      content: (
        <div>
          请确定是否以下原因退出发布：
          <br />
          1. 发布取消、代码有改动；
          <br />
          2. 其他发布优先，需要退出释放服务资源；
          <br />
          3. 发布配置有变动，重新加载最新发布配置；
          <br />
        </div>
      ),
      onOk: async () => {
        setActionLoading(true)
        const { success } = await quit({
          id: changelog.id
        })

        if (success === true) {
          // message.success('退出发布成功，即将刷新页面', function () {
          //   location.reload()
          // })
          message.success('退出发布成功')
          getDetail()
        }
        setActionLoading(false)
      }
    })
  }

  const nextBtns = (size = 'middle') => {
    if (!next) return null
    return (
      <Space>
        <Button
          type="primary"
          onClick={handlerNildeAction}
          loading={actionLoading}
          disabled={!!next.disabled}
          size={size}
        >
          {next.label}
        </Button>
        {next.quit ? (
          <Button danger onClick={handlerNildeQuit} loading={actionLoading} size={size}>
            退出发布
          </Button>
        ) : null}
      </Space>
    )
  }

  const BaseInfo = (
    <ProCard title="基础信息" extra={nextBtns()}>
      <table className="mod-baseinfo">
        <tbody>
          <tr>
            <th>分支:</th>
            <td>{changelog.branch}</td>
            <th>CommitId:</th>
            <td>
              {changelog.commitId ? (
                <a href={`${config.repository.url}/tree/${changelog.commitId}`} target="_blank" rel="noreferrer">
                  {changelog.commitId.slice(0, 10)}
                </a>
              ) : (
                '-'
              )}
            </td>
            <th>创建人:</th>
            <td>{config.repository && config.repository.userName}</td>
          </tr>
          <tr>
            <th>发布耗时:</th>
            <td>{getDuration(logs.duration)}</td>
            <th>状态:</th>
            <td>{statusMap[changelog.status + ''] || changelog.status}</td>
            <th>发布环境及类型:</th>
            <td>
              {modeMap[changelog.environment] || changelog.environment} {changelog.type}
            </td>
          </tr>
          <tr>
            <th>创建时间:</th>
            <td>{getFormatDate(changelog.createdTime)}</td>
            <th>修改时间:</th>
            <td>{getFormatDate(changelog.updatedTime)}</td>
            <th>描述:</th>
            {isEditDesc ? (
              <td>
                <Input
                  size="small"
                  style={{ width: 260 }}
                  value={descInputVal}
                  onChange={e => setDescInputVal(e.target.value)}
                />
                <Button
                  type="primary"
                  size="small"
                  style={{ marginLeft: 15 }}
                  loading={isEditDescLoading}
                  onClick={updateDesc}
                >
                  保存
                </Button>
              </td>
            ) : (
              <td>
                <span>{changelog.description}</span>
                <Button
                  type="primary"
                  size="small"
                  style={{ marginLeft: 15 }}
                  onClick={() => {
                    setIsEditDesc(true)
                    setDescInputVal(changelog.description)
                  }}
                >
                  修改
                </Button>
              </td>
            )}
          </tr>
        </tbody>
      </table>
    </ProCard>
  )

  const TabContainer = (
    <ProCard style={{ marginTop: '20px' }}>
      <Tabs
        activeKey={tabActive}
        onChange={activeKey => {
          setTabActive(activeKey)
        }}
      >
        <Tabs.TabPane key="log" tab="日志">
          {logs.stages ? <Log type="all" logs={logs} current={current}></Log> : '没有记录'}
        </Tabs.TabPane>
        <Tabs.TabPane key="inputs" tab="Inputs">
          {inputs ? (
            // 服务器组件需要拿到changelog信息
            <ChangelogContext.Provider value={changelog}>
              <Inputs
                readonly={changelog.active || changelog.statusEnum !== 0}
                inputs={inputs}
                onChange={values => setInputAnswers(values)}
              ></Inputs>
            </ChangelogContext.Provider>
          ) : (
            '没有记录'
          )}
        </Tabs.TabPane>
        <Tabs.TabPane key="config" tab="配置">
          {config && <Highlight configRaw={JSON.stringify(config, '', 2)} type="javascript"></Highlight>}
        </Tabs.TabPane>
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
        onChange={stage => setCurrent({ progress: current.progress, stage })}
      ></Steps>
      {TabContainer}
      <ProCard style={{ marginTop: '20px' }}>发布动作：{nextBtns('large')}</ProCard>
      <BackTop />
    </PageContainer>
  )
}

export default App
