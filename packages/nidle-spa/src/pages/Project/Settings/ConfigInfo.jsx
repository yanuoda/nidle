import { mode as environmentList } from '@/dicts/app'
import ProCard from '@ant-design/pro-card'
import { Tabs } from 'antd'

import ConfigBlock from './components/ConfigBlock'

/* 发布配置 */
const ConfigInfo = () => {
  return (
    <ProCard title="发布配置" headerBordered collapsible bordered type="inner">
      {environmentList.length > 0 && (
        <Tabs defaultActiveKey={environmentList[0]?.value}>
          {environmentList.map(env => (
            <Tabs.TabPane tab={env.label} key={env.value}>
              <ConfigBlock configRaw={env.label} />
            </Tabs.TabPane>
          ))}
        </Tabs>
      )}
    </ProCard>
  )
}

export default ConfigInfo
