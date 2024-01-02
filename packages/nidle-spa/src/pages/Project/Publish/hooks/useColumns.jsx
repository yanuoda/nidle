import { useState } from 'react'
import { Modal, Badge, Button, Popconfirm, message } from 'antd'
import { ExclamationCircleOutlined, SyncOutlined, SubnodeOutlined } from '@ant-design/icons'
import { Link } from 'umi'

import { deleteByIds, republish } from '@/services/changelog'
import { transformDuration } from '@/utils'
import { status as statusList } from '@/dicts/changelog'
import { mode as environmentList } from '@/dicts/app'

import styles from '../index.less'

const useColumns = ({ onReload, moreListClick }) => {
  const [republishLoading, setRepublishLoading] = useState(false)

  const sharedOnCell = ({ totalChilds }) => {
    if (totalChilds) {
      return { colSpan: 0 }
    }
    return {}
  }

  const deleteChangelogByPeriod = record => {
    const { id, children, isChild } = record
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: (
        <>
          <div>确认删除该{isChild ? '子记录' : '记录（组）'}？</div>
          {!isChild && (
            <div>
              <ExclamationCircleOutlined />
              &nbsp; 注意：子记录（如有）也会一并删除。
            </div>
          )}
        </>
      ),
      onOk: async () => {
        const ids = [id, ...(children || []).map(({ id }) => id)]
        const cascade = Boolean(children) && children.length === 0 // 表示该行有子记录，但是没有加载
        const res = await deleteByIds({ ids, cascade })
        if (res.success) {
          message.success('删除成功')
          onReload && onReload()
        }
      }
    })
  }

  const republishConfirm = async ({ id, status }) => {
    if (status === 'PENDING') {
      message.info('请等当前发布完成后再进行操作')
      return
    }
    setRepublishLoading(true)
    try {
      const res = await republish({ id })
      if (res.success) {
        message.success('操作成功')
        onReload && onReload()
      }
    } catch (error) {
      console.error(error)
    }
    setRepublishLoading(false)
  }

  return [
    {
      title: '分支',
      dataIndex: 'branch',
      fixed: 'left',
      align: 'center',
      onCell: ({ totalChilds }) => ({
        colSpan: totalChilds ? 9 : 1
      }),
      render: (text, { changelog, totalChilds }) => {
        if (totalChilds) {
          return (
            <>
              <span>已展示前10条，共{totalChilds}条</span>
              <Button type="link" onClick={() => moreListClick && moreListClick(changelog)}>
                查看全部
              </Button>
            </>
          )
        }
        return text
      }
    },
    {
      title: 'CommitId',
      dataIndex: 'commitId',
      align: 'center',
      width: 100,
      onCell: sharedOnCell,
      render: (_, { commitId, commitUrl, totalChilds }) => {
        if (totalChilds) return ''
        return (
          <a href={commitUrl} target="_blank" rel="noreferrer">
            {(commitId || '').slice(0, 10)}
          </a>
        )
      }
    },
    {
      title: '创建人',
      dataIndex: 'developer',
      align: 'center',
      width: 150,
      onCell: sharedOnCell
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      valueType: 'dateTime',
      align: 'center',
      width: 100,
      onCell: sharedOnCell
    },
    {
      title: '修改时间',
      dataIndex: 'updatedTime',
      valueType: 'dateTime',
      align: 'center',
      width: 100,
      onCell: sharedOnCell
    },
    {
      title: '发布耗时',
      dataIndex: 'duration',
      align: 'center',
      width: 80,
      onCell: sharedOnCell,
      render: (_, { duration, totalChilds }) => {
        if (totalChilds) return ''
        return transformDuration(duration)
      }
    },
    {
      title: '触发方式',
      dataIndex: 'source',
      align: 'center',
      width: 80,
      onCell: sharedOnCell
    },
    {
      title: '发布类型',
      dataIndex: 'type',
      align: 'center',
      width: 90,
      onCell: sharedOnCell
    },
    {
      title: '描述',
      dataIndex: 'description',
      align: 'center',
      onCell: sharedOnCell
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      initialValue: 'all',
      fixed: 'right',
      width: 150,
      valueEnum: statusList,
      render: (_, { status, environment, totalChilds }) => {
        if (totalChilds) return ''
        const { label: envName } = environmentList.find(env => env.value === environment)
        const { label, badgeStatus } = statusList.find(item => item.value === status)
        return <Badge status={badgeStatus} text={`${envName} - ${label}`} />
      }
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      align: 'center',
      width: 'auto',
      render: (_, record, index) => {
        if (record.totalChilds) return ''
        const { id, project, status, isChild, nextPublish, pendingMR, active, type } = record
        const btnDoms = [
          <Link key="publish" to={`/project/${project}/changelog/detail?id=${id}`}>
            <Button type="link" key="发布详情" className={styles.linkBtn}>
              发布详情
            </Button>
          </Link>,
          // 新建、取消 状态的发布记录 or 子记录 才可以删除
          ['NEW', 'CANCEL'].includes(status) || isChild ? (
            <Button
              type="link"
              key="删除"
              onClick={() => deleteChangelogByPeriod(record, index)}
              className={styles.linkBtn}
            >
              删除
            </Button>
          ) : null
        ]
        // 子发布记录不可操作，直接返回
        if (isChild) return btnDoms
        // 活跃状态的webhook，且是 成功、失败 状态的记录才展示
        if (type === 'webhook' && active === 0 && ['SUCCESS', 'FAIL'].includes(status)) {
          btnDoms.unshift(
            <Popconfirm
              key="republish"
              placement="top"
              trigger={republishLoading ? 'click' : 'hover'}
              title={`${pendingMR ? '有新的MR，' : ''}是否直接重新发布？`}
              showCancel={false}
              onConfirm={() => republishConfirm(record)}
            >
              <Button type="primary" icon={pendingMR ? <SubnodeOutlined /> : <SyncOutlined />}></Button>
            </Popconfirm>
          )
        }
        //
        const { buttonText, redirectUrl, quit } = nextPublish || {}
        if (quit) {
          btnDoms.unshift(
            <Link key="退出发布-link" to={`/project/${project}/changelog/detail?id=${id}`}>
              <Button type="primary" key="退出发布" className={styles.warningBtn}>
                退出发布
              </Button>
            </Link>
          )
        }
        if (buttonText) {
          let textBtn = (
            <Button type="primary" key={buttonText}>
              {buttonText}
            </Button>
          )
          if (redirectUrl) {
            textBtn = (
              <Link key={buttonText + '-link'} to={redirectUrl}>
                {textBtn}
              </Link>
            )
          }
          btnDoms.unshift(textBtn)
        }
        return btnDoms
      }
    }
  ]
}

export default useColumns
