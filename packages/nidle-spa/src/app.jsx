import { PageLoading } from '@ant-design/pro-layout'
import { history } from 'umi'
import RightContent from '@/components/RightContent'
import { queryCurrentUser } from './services/user'
import { setTwoToneColor } from '@ant-design/icons'
import settings from '../config/defaultSettings'
import { getCookie } from '@/utils'

const loginPath = '/user/login'
const environmentList = [
  { key: 'test', name: '测试' },
  { key: 'pre', name: '预发' },
  { key: 'prod', name: '生产' }
]

/** 设置双色 icon 主色 */
setTwoToneColor(settings.primaryColor)

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />
}

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * 初始化获取一些全局共享的数据，例如用户信息
 * */
export async function getInitialState() {
  const fetchUserInfo = async (requestOptions = {}) => {
    try {
      const msg = await queryCurrentUser(requestOptions)
      return msg.data
    } catch (error) {
      history.push(loginPath)
    }

    return undefined
  }

  // 当前页不是登录页
  const requestOptions = {}
  if (history.location.pathname === loginPath) {
    // 登录页不需要展示未登录错误提示
    requestOptions.skipErrorHandler = true
  }
  const currentUser = await fetchUserInfo(requestOptions)
  if (currentUser) {
    return {
      fetchUserInfo,
      currentUser,
      environmentList,
      settings: {}
    }
  }

  return {
    fetchUserInfo,
    environmentList,
    settings: {}
  }
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout = ({ initialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.name
    },
    // footerRender: () => <div>Nidle</div>,
    onPageChange: () => {
      const { pathname } = history.location
      const { currentUser } = initialState || {}
      // 如果没有登录，重定向到 login
      if (!currentUser && pathname !== loginPath) {
        history.push(loginPath)
      }
      // 如果已经登录且在登录页，则重定向到首页
      if (currentUser && pathname === loginPath) {
        history.push('/')
      }
    },
    links: [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    ...initialState?.settings
  }
}

export const request = {
  headers: {
    'x-csrf-token': getCookie('csrfToken')
  }
}
