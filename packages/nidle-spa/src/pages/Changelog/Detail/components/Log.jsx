import { useState, useEffect } from 'react'
import { Collapse } from 'antd'
import { CheckOutlined, CloseOutlined, Loading3QuartersOutlined } from '@ant-design/icons'
import Highlight from '@/components/Highlight'
import { duration } from '@/utils/filter'

const Log = props => {
  const [stageLog, setStage] = useState({})

  useEffect(() => {
    const { progress, stage } = props.current
    const { stages } = props.logs
    let name = stage

    if (!name) {
      name = progress === 'success' ? stages[0].name : progress
    }

    if (name) {
      const stage = stages.find(item => item.name === name)

      if (stage) {
        setStage(stage)
      }
    }
  }, [props.current, props.logs])

  const genExtra = step => {
    return (
      <div className="log-panel-extra">
        <span className="duration">{duration(step.duration)}</span>
        <span className="status">
          {step.endTime ? (
            step.status === 'FAIL' ? (
              <CloseOutlined />
            ) : (
              <CheckOutlined />
            )
          ) : (
            <Loading3QuartersOutlined spin />
          )}
        </span>
      </div>
    )
  }

  const Panels = (stageLog.steps || []).map(step => {
    return (
      <Collapse.Panel header={`${step.name} - [${step.taskName}]`} key={step.name} extra={genExtra(step)}>
        <Highlight configRaw={step.detail.replace(/\\r/g, '\n')} type="powershell"></Highlight>
      </Collapse.Panel>
    )
  })

  return (
    <div className="mod-log">
      <div className="cell-header">
        <h4>{stageLog.name}</h4>
        <span className="duration">{duration(stageLog.duration)}</span>
      </div>
      <Collapse>{Panels}</Collapse>
    </div>
  )
}

export default Log
