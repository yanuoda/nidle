import { mode as environmentList } from '@/dicts/app'
import ProCard from '@ant-design/pro-card'
import { Tabs } from 'antd'

import Highlight from '@/components/Highlight'
import { getConfigByApp } from '@/services/config'
import { useState, useEffect } from 'react'

/* 发布配置 */
const ConfigInfo = props => {
  const { gitlabId, repositoryUrl, repositoryType } = props.projectData
  const [configRaw, setConfigRaw] = useState({})
  useEffect(async () => {
    const result = {}
    for (const env of environmentList) {
      const mode = env.value
      const { data, success } = await getConfigByApp({
        id: gitlabId,
        repositoryUrl,
        repositoryType,
        mode
      })
      if (success) {
        result[mode] = data ? JSON.stringify(data, null, 2) : ''
      }
    }
    setConfigRaw(result)
  }, [])

  return (
    <ProCard title="发布配置" headerBordered collapsible bordered type="inner">
      {environmentList.length > 0 && (
        <Tabs defaultActiveKey={environmentList[0]?.value}>
          {environmentList.map(env => (
            <Tabs.TabPane tab={env.label} key={env.value}>
              <Highlight configRaw={configRaw[env.value] || ''} />
            </Tabs.TabPane>
          ))}
        </Tabs>
      )}
    </ProCard>
  )
}

export default ConfigInfo
