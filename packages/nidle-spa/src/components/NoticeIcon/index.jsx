import { useEffect, useState } from 'react'
import { Tag } from 'antd'
import { groupBy, remove, sum } from 'lodash'
import moment from 'moment'
import { useModel } from 'umi'
import NoticeIcon from './NoticeIcon'
import styles from './index.less'

const storageKey = 'SSE_MESSAGE_LIST'

const getNoticeData = notices => {
  if (!notices || notices.length === 0 || !Array.isArray(notices)) {
    return {}
  }

  const newNotices = notices.map(notice => {
    const newNotice = { ...notice }

    if (newNotice.datetime) {
      newNotice.datetime = moment(notice.datetime).fromNow()
    }

    if (newNotice.id) {
      newNotice.key = newNotice.id
    }

    if (newNotice.extra && newNotice.status) {
      const color = {
        todo: '',
        processing: 'blue',
        urgent: 'red',
        doing: 'gold'
      }[newNotice.status]
      newNotice.extra = (
        <Tag
          color={color}
          style={{
            marginRight: 0
          }}
        >
          {newNotice.extra}
        </Tag>
      )
    }

    return newNotice
  })
  return groupBy(newNotices, 'type')
}

const getUnreadData = noticeData => {
  const unreadMsg = {}
  Object.keys(noticeData).forEach(key => {
    const value = noticeData[key]

    if (!unreadMsg[key]) {
      unreadMsg[key] = 0
    }

    if (Array.isArray(value)) {
      unreadMsg[key] = value.filter(item => !item.read).length
    }
  })
  return unreadMsg
}

const NoticeIconView = () => {
  const { initialState } = useModel('@@initialState')
  const { currentUser } = initialState || {}
  const [notices, setNotices] = useState([])

  useEffect(() => {
    const eventSource = new EventSource('/api/message/sse')
    eventSource.onmessage = ({ data }) => {
      // 接收消息，写入 ls
      const notices = JSON.parse(localStorage.getItem(storageKey) || '[]')
      const message = JSON.parse(data)

      // 判断自己是否消息接收者
      if (message.users && !message.users.includes(currentUser.name)) {
        return
      }

      notices.unshift({
        ...message,
        datetime: message.timestamp,
        id: message.timestamp,
        read: false,
        description: message.content
      })
      setNotices([...notices])

      if (window.Notification && Notification.permission === 'granted') {
        new Notification(message.title, {
          body: message.content
        })
      }
    }

    eventSource.onerror = err => {
      console.error('EventSource failed:', err)
    }

    setNotices(JSON.parse(localStorage.getItem(storageKey) || '[]'))

    return () => {
      eventSource.close()
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(notices || []))
  }, [notices])

  const noticeData = getNoticeData(notices)
  const unreadMsg = getUnreadData(noticeData || {})
  const unreadCount = sum(Object.values(unreadMsg))

  const changeReadState = id => {
    setNotices(
      notices.map(item => {
        const notice = { ...item }

        if (notice.id === id) {
          notice.read = true
        }

        return notice
      })
    )
  }

  const clearReadState = (title, key) => {
    setNotices(
      notices.map(item => {
        const notice = { ...item }

        if (notice.type === key) {
          notice.read = true
        }

        return notice
      })
    )
  }

  const clearNotice = (title, key) => {
    remove(notices, item => item.type === key)
    setNotices([...notices])
  }

  return (
    <NoticeIcon
      className={styles.action}
      count={unreadCount || 0}
      onItemClick={item => {
        changeReadState(item.id)
      }}
      onClear={(title, key) => clearReadState(title, key)}
      loading={false}
      clearText="标记已读"
      viewMoreText="清空"
      onViewMore={(title, key) => clearNotice(title, key)}
      clearClose
    >
      <NoticeIcon.Tab
        tabKey="notification"
        count={unreadMsg.notification}
        list={noticeData.notification}
        title="通知"
        emptyText="你已查看所有通知"
        showViewMore
      />
      <NoticeIcon.Tab
        tabKey="message"
        count={unreadMsg.message}
        list={noticeData.message}
        title="消息"
        emptyText="您已读完所有消息"
        showViewMore
      />
      <NoticeIcon.Tab
        tabKey="event"
        title="待办"
        emptyText="你已完成所有待办"
        count={unreadMsg.event}
        list={noticeData.event}
        showViewMore
      />
    </NoticeIcon>
  )
}

export default NoticeIconView
