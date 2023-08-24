import ProCard from '@ant-design/pro-card'
import { List, Avatar, Skeleton } from 'antd'
import { UserOutlined } from '@ant-design/icons'

import styles from './index.less'

/* 项目成员 */
const MemberInfo = props => {
  const { projectData } = props
  const { memberList } = projectData
  return (
    <ProCard title="项目成员" headerBordered collapsible bordered type="inner" defaultCollapsed>
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
                    <a href={item.web_url} target="_blank" rel="noreferrer">
                      {item.name}
                    </a>
                    <span className={styles.memberUsername}> @{item.username}</span>
                  </>
                }
              />
              <div>{item.role}</div>
            </Skeleton>
          </List.Item>
        )}
      />
    </ProCard>
  )
}

export default MemberInfo
