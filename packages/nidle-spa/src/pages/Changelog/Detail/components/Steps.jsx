import ProCard from '@ant-design/pro-card'
import { Steps } from 'antd'
import { upperFirst } from 'lodash'

export const PROGRESS_TYPES = {
  start: 'start',
  waiting: 'waiting',
  success: 'success'
}
// config 的 stage 之前有几个自定义的 step ('start','waiting')
const STAGE_INDEX_OFFSET = 2

const Progress = props => {
  const { progress, stage, stages = [], status } = props
  const len = stages.length
  let pIdx = progress === PROGRESS_TYPES.success ? len : stages.findIndex(item => item.name === progress)
  let current = stages.findIndex(item => item.name === stage)
  if (current > -1) {
    current += STAGE_INDEX_OFFSET
  } else {
    if (progress === PROGRESS_TYPES.start) current = 0
    else if (progress === PROGRESS_TYPES.waiting) current = 1
    else current = STAGE_INDEX_OFFSET
  }

  const StepItems = stages.map((item, i) => {
    return (
      <Steps.Step
        key={item.name}
        title={upperFirst(item.name)}
        status={i === pIdx ? (status === 'FAIL' ? 'error' : 'process') : i > pIdx ? 'wait' : 'finish'}
        disabled={i > pIdx}
      />
    )
  })

  const handlerChange = current => {
    props.onChange(stages[current - STAGE_INDEX_OFFSET].name)
  }

  return (
    <ProCard style={{ marginTop: '10px' }}>
      <Steps current={current} labelPlacement="vertical" onChange={handlerChange}>
        <Steps.Step title="Start" status={progress === PROGRESS_TYPES.start ? 'wait' : 'finish'} disabled />
        <Steps.Step
          title="Waiting"
          status={[PROGRESS_TYPES.start, PROGRESS_TYPES.waiting].includes(progress) ? 'wait' : 'finish'}
          disabled
        />
        {StepItems}
        <Steps.Step title="Success" status={progress === PROGRESS_TYPES.success ? 'finish' : 'wait'} disabled />
      </Steps>
    </ProCard>
  )
}

export default Progress
