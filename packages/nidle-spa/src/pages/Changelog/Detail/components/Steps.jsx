import ProCard from '@ant-design/pro-card'
import { Steps } from 'antd'
import { upperFirst } from 'lodash'

const Progress = props => {
  const { progress, stage, stages = [], status } = props
  const len = stages.length
  let pIdx = progress === 'success' ? len : stages.findIndex(item => item.name === progress)
  let current = stages.findIndex(item => item.name === stage)
  current = current > -1 ? current + 1 : progress === 'success' ? 1 : 0
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
    props.onChange(stages[current - 1].name)
  }

  return (
    <ProCard style={{ marginTop: '10px' }}>
      <Steps current={current} labelPlacement="vertical" onChange={handlerChange}>
        <Steps.Step title="Start" status={progress === 'start' ? 'wait' : 'finish'} disabled />
        {StepItems}
        <Steps.Step title="Success" status={progress === 'success' ? 'finish' : 'wait'} disabled />
      </Steps>
    </ProCard>
  )
}

export default Progress
