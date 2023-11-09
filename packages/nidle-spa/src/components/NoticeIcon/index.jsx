import { useEffect, useState, useMemo } from 'react'
import { Tag } from 'antd'
import { groupBy, remove, sum } from 'lodash'
import moment from 'moment'
import { useModel } from 'umi'

import { getFormatDate } from '@/utils'
import { NOTIFICATION_SETTING_KEY, OFFEN_USE_PROJECTS_KEY } from '@/config'
import NoticeIcon from './NoticeIcon'
import styles from './index.less'

const MSG_STORAGE_KEY = 'SSE_MESSAGE_LIST'
const MSG_STORAGE_LIMIT = 50

const NOTIFICATION_ICONS = {
  'code-review-request': '/logo.png',
  'code-review-success': '/svgs/success.svg',
  'code-review-fail': '/svgs/attention.svg',
  'publish-start': '/logo.png',
  'publish-success': '/svgs/success.svg',
  'publish-fail': '/svgs/attention.svg'
}

const getNoticeData = notices => {
  if (!notices || notices.length === 0 || !Array.isArray(notices)) {
    return {}
  }

  const newNotices = notices.map(notice => {
    const newNotice = { ...notice }
    if (newNotice.datetime) {
      newNotice.datetime = getFormatDate(notice.datetime)
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

  const [notices, setNotices] = useState(JSON.parse(localStorage.getItem(MSG_STORAGE_KEY) || '[]'))

  useEffect(() => {
    const eventSource = new EventSource('/api/message/sse')
    eventSource.onmessage = ({ data }) => {
      const message = JSON.parse(data)

      const notificationSetting = JSON.parse(localStorage.getItem(NOTIFICATION_SETTING_KEY) || '{}')
      // 屏蔽所有
      if (notificationSetting.mode === 'block') return
      // 只接收"常用"的应用
      if (notificationSetting.mode === 'offenUse') {
        const offenUseProjects = JSON.parse(localStorage.getItem(OFFEN_USE_PROJECTS_KEY) || '[]')
        if (!offenUseProjects.find(({ id }) => id === message.body.projectId)) {
          return
        }
      }
      // 判断自己是否消息接收者
      if (message.users && !message.users.includes(currentUser.name)) {
        return
      }

      setNotices(_arr => [
        {
          title: message.title,
          type: message.type,
          description: message.content,
          id: message.timestamp,
          datetime: message.timestamp,
          body: message.body,
          read: false
          // avatar: '',
          // extra: '',
          // status: '',
        },
        ..._arr
      ])

      if (window.Notification && Notification.permission === 'granted') {
        new Notification(message.title, {
          body: message.content,
          icon: NOTIFICATION_ICONS[message.body.type],
          requireInteraction: message.body.type.includes('fail')
        })
      }
    }

    eventSource.onerror = err => {
      console.error('EventSource failed:', err)
    }

    return () => {
      eventSource.close()
    }
  }, [])

  useEffect(() => {
    let _notices = [...notices]
    if (_notices.length > MSG_STORAGE_LIMIT) {
      _notices = _notices.slice(0, MSG_STORAGE_LIMIT)
    }
    // 限制 storage 保存上限 = MSG_STORAGE_LIMIT
    localStorage.setItem(MSG_STORAGE_KEY, JSON.stringify(_notices || []))
  }, [notices])

  const noticeData = useMemo(() => getNoticeData(notices), [notices])
  const unreadMsg = useMemo(() => getUnreadData(noticeData || {}), [noticeData])
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
