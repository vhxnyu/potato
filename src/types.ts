//

import { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { CryptoMethod } from './PotatoBase'

/** 如果 T 是 U 的子类型, 则返回 V, 否则返回 T  */
export type Condition<T, U, V> = T extends U ? V : T
export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never

type RequestConfig = InternalAxiosRequestConfig<Record<string, string | number>>

export interface PotatoPresets {
  appToken?: string
  sign?: string
  baseUrl?: string
  cryptoKey?: string
  encryptMethod?: CryptoMethod// 加密请求数据使用的算法
  decryptMethod?: CryptoMethod// 解密响应数据使用的算法
  interceptors?: {
    request?<T extends RequestConfig >(cfg: T): T
    response?(res: PotatoResponse): Object
  }
  userToken?: string
}

/** 页面(列表)元数据 */
interface PaginatedMetadata {
  pageIndex: number
  pageSize: number
  pageWindow: number
  maxPages: number
  total: number
  startIndex: number
  endIndex: number
  nextPage: number
  previousPage: number
  endPageIndex: number
  startPageIndex: number
}

export interface PotatoResponse<Data = Record<string, any> | Array<Record<string, any>> | null> {
  code: string
  message: string
  /**@deprecated */
  status: boolean
  data: Data
  sin: string | null
  time: string | null
  pc: Data extends Array<Record<string, any>> ? PaginatedMetadata : null
  // _from: AxiosResponse<Omit<PotatoResponse<Data>, '_from'>>
}

type PR<D = Record<string, any> | null> = PotatoResponse<D>

// App itself
export interface PotatoAppInterface {
  /** 获取应用信息*/
  getAppInfo(): PR<{
    createdBy: string
    createdDate: string
    modifiedBy: string
    modifiedDate: string
    status: number
    ip: string
    appName: string
    appLogo: string
    content: string
    group: string
    contact: string
    appToken: string
    version: string
  }>
  /** 获取应用公告*/
  getNotice(): PR
  /** 获取应用新版本*/
  updateApp(params: { version: string }): PR<{
    data: {
      id: string
      createdBy: string
      createdDate: string
      modifiedBy: string
      modifiedDate: string
      status: number
      ip: string
      versionInt: number
      version: string
      appId: string
      managementId: string
      updateState: number
      versionStr: string
      updateUrl: string
      updateTime: string
    }
    isUpdate: boolean
  }>
  /** 发送邮件*/
  sendEmailByUser(): PR
  /** 应用启动计数+1*/
  startApp(): PR
  /** 获取更新记录*/
  getAppUpdateLog(): PR
  /** 反馈*/
  feedBack(): PR
  /** 获取文档*/
  getDoc(): PR
  /** 发送微信提醒*/
  sendWeChatMessage(): PR
}

// App -> Message Board
export interface PotatoAppInterface {
  /** 添加一则留言*/
  messageBoard(): PR
  /** 获取留言板列表*/
  getMessageBoardList(): PR
}

// User
export interface PotatoAppInterface {
  /** 注册*/
  register(): PR
  /** 注册*/
  registerV2(): PR
  /** 登录*/
  login(): PR
  /** 查询用户信息*/
  findUserInfo(): PR
  /** 修改用户信息*/
  updateUserInfo(): PR
  /** 修改用户密码*/
  updatePassWord(): PR
  /** 获取登录验证码图片*/
  getCodeImg(): PR
  /** 发送注册验证码到邮箱*/
  sendEmailMessage(): PR
  /** 用户签到*/
  signInUser(): PR
  /** 获取签到排行榜*/
  getSignInList(): PR
}

// Payment system
export interface PotatoAppInterface {
  /** 创建订单*/
  createOrder(): PR
  /** 发起支付*/
  pay(): PR
  /** 搜索订单*/
  searchOrder(): PR
  /** 查询用户余额流水*/
  getUserBalanceList(): PR
  /** 用户使用余额购买会员*/
  userByVipWithBalance(): PR
  /** 修改用户余额接口*/
  updateUserBalance(): PR
  /** 获取会员列表*/
  getVipList(): PR
}

// Payment system -> Shop
export interface PotatoAppInterface {
  /** 获取商品标签*/
  getLabelList(): PR
  /** 获取商品列表*/
  getGoodsList(): PR
}

// Payment system -> Card Key System
export interface PotatoAppInterface {
  /** 卡密校验*/
  verifyCardV2(): PR
  /** 卡密校验*/
  verifyCardV1(): PR
  /** 卡密解绑设备*/
  unbindCard(): PR
  /** 用户生成卡密接口*/
  createCardMy(): PR
  /** 查询用户生成卡密列表*/
  getCardMyList(): PR
}
