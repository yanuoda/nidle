import { Avatar, List } from 'antd'
import { Link } from 'umi'
import classNames from 'classnames'
import styles from './NoticeList.less'

const NoticeList = ({
  list = [],
  onClick,
  onClear,
  title,
  onViewMore,
  emptyText,
  showClear = true,
  clearText,
  viewMoreText,
  showViewMore = false
}) => {
  if (!list || list.length === 0) {
    return (
      <div className={styles.notFound}>
        <img src="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg" alt="not found" />
        <div>{emptyText}</div>
      </div>
    )
  }

  return (
    <div>
      <List
        className={styles.list}
        dataSource={list}
        renderItem={(item, i) => {
          const itemCls = classNames(styles.item, {
            [styles.read]: item.read
          }) // eslint-disable-next-line no-nested-ternary

          const leftIcon = item.avatar ? (
            typeof item.avatar === 'string' ? (
              <Avatar className={styles.avatar} src={item.avatar} />
            ) : (
              <span className={styles.iconElement}>{item.avatar}</span>
            )
          ) : null
          return (
            <List.Item
              className={itemCls}
              key={item.id || i}
              onClick={() => {
                onClick?.(item)
              }}
            >
              <List.Item.Meta
                className={styles.meta}
                avatar={leftIcon}
                title={
                  item.body && item.body.id ? (
                    <Link
                      className={styles.title}
                      to={`/project/${item.body.projectId}/changelog/detail?id=${item.body.id}`}
                    >
                      {item.title}
                      <div className={styles.extra}>{item.extra}</div>
                    </Link>
                  ) : (
                    <div className={styles.title}>
                      {item.title}
                      <div className={styles.extra}>{item.extra}</div>
                    </div>
                  )
                }
                description={
                  <div>
                    <div className={styles.description}>{item.description}</div>
                    <div className={styles.datetime}>{item.datetime}</div>
                  </div>
                }
              />
            </List.Item>
          )
        }}
      />
      <div className={styles.bottomBar}>
        {showClear ? (
          <div onClick={onClear}>
            {clearText}[{title}]
          </div>
        ) : null}
        {showViewMore ? (
          <div onClick={onViewMore}>
            {viewMoreText}[{title}]
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default NoticeList
