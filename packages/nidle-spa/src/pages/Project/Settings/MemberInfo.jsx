import ProCard from '@ant-design/pro-card'
import { List, Avatar, Skeleton } from 'antd'
import { UserOutlined } from '@ant-design/icons'

import styles from './index.less'

/* 项目成员 */
const MemberInfo = props => {
  const { projectData } = props
  const { memberList } = projectData
  return (
    <ProCard title="项目成员" headerBordered collapsible bordered type="inner">
      <List
        itemLayout="horizontal"
        dataSource={memberList}
        renderItem={item => (
          <List.Item>
            <Skeleton avatar title={false} loading={item.loading} active>
              <List.Item.Meta
                avatar={<Avatar src={item.avatar_url} icon={<UserOutlined />} />}
                title={
                  <>
                    <a href={item.web_url || item.html_url} target="_blank" rel="noreferrer">
                      {item.name || item.login}
                    </a>
                    <span className={styles.memberUsername}> @{item.username || item.login}</span>
                  </>
                }
              />
              <div>{item.role || item.role_name}</div>
            </Skeleton>
          </List.Item>
        )}
      />
    </ProCard>
  )
}

export default MemberInfo
