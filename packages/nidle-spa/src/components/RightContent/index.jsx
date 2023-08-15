import { Space } from 'antd'
import { useModel } from 'umi'
import Avatar from './AvatarDropdown'
import Notice from '../NoticeIcon'
import styles from './index.less'
import { useEffect } from 'react'

const GlobalHeaderRight = () => {
  const { initialState } = useModel('@@initialState')

  if (!initialState || !initialState.settings) {
    return null
  }

  const { navTheme, layout } = initialState.settings
  let className = styles.right

  if ((navTheme === 'dark' && layout === 'top') || layout === 'mix') {
    className = `${styles.right}  ${styles.dark}`
  }

  useEffect(() => {
    if (window.Notification && Notification.permission !== 'granted') {
      Notification.requestPermission(function (status) {
        if (Notification.permission !== status) {
          Notification.permission = status
        }
      })
    }
  }, [])

  return (
    <Space className={className}>
      <Notice />
      <Avatar />
    </Space>
  )
}

export default GlobalHeaderRight
