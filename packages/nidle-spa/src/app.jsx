import { PageLoading } from '@ant-design/pro-layout'
import { history } from 'umi'
import RightContent from '@/components/RightContent'
import { currentUser as queryCurrentUser } from './services/ant-design-pro/api'
import { setTwoToneColor } from '@ant-design/icons'
import settings from '../config/defaultSettings'

const loginPath = '/user/login'

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
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser()
      return msg.data
    } catch (error) {
      history.push(loginPath)
    }

    return undefined
  }

  // 当前页不是登录页
  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo()
    return {
      fetchUserInfo,
      currentUser,
      settings: {}
    }
  }

  return {
    fetchUserInfo,
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
      const { location } = history // 如果没有登录，重定向到 login

      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath)
      }
    },
    links: [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    ...initialState?.settings
  }
}
