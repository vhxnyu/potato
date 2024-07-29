//

import { PotatoBase } from './PotatoBase'
import type { Condition, Expand, PotatoAppInterface, PotatoPresets } from './types'


// type P<I extends keyof PotatoAppInterface> = Parameters<PotatoAppInterface[I]>[0]
type P<I extends keyof PotatoAppInterface> = Expand<Condition<Parameters<PotatoAppInterface[I]>[0], undefined, Record<string, any>>> // 类型写完了记得移除这个条件
type R<I extends keyof PotatoAppInterface> = Promise<Expand<ReturnType<PotatoAppInterface[I]>>>


export class Potato extends PotatoBase {
  #get<I extends keyof PotatoAppInterface>(url: I, params?: P<I>): R<I> { // 类型补全后记得移除可选标识
    return this._axios({ url, params })
  }

  #post<I extends keyof PotatoAppInterface>(url: I, data?: P<I>): R<I> { // 类型补全后记得移除可选标识
    return this._axios({ url, data, method: 'post' })
  }

  // >>>>>>>>>>>>>>>>>>>>>>> APP itself

  /** 获取应用信息 */
  getAppInfo() {
    return this.#get('getAppInfo', {})
  }
  /** 获取应用公告 */
  updateApp(params?: P<'updateApp'>) {
    return this.#post('updateApp', params)
  }
  /** 获取应用新版本 */
  getNotice() {
    return this.#get('getNotice', {})
  }
  /** 发送邮件 */
  sendEmailByUser(params?: P<'sendEmailByUser'>) {
    return this.#post('sendEmailByUser', params)
  }
  /** 应用启动量增加 */
  startApp() {
    return this.#get('startApp', {})
  }
  /** 获取更新记录 */
  getAppUpdateLog(params?: P<'getAppUpdateLog'>) {
    return this.#post('getAppUpdateLog', params)
  }
  /** 反馈 */
  feedBack(params?: P<'feedBack'>) {
    return this.#post('feedBack', params)
  }
  /** 获取文档 */
  getDoc(params?: P<'getDoc'>) {
    return this.#post('getDoc', params)
  }
  /** 发送微信提醒 */
  sendWeChatMessage(params?: P<'sendWeChatMessage'>) {
    return this.#post('sendWeChatMessage', params)
  }

  // >>>>>>>>>>>>>>>>>>>>>>>  APP -> Message boards

  /** 添加一则留言 */
  messageBoard(params?: P<'messageBoard'>) {
    return this.#post('messageBoard', params)
  }
  /** 获取留言板列表 */
  getMessageBoardList(params?: P<'getMessageBoardList'>) {
    return this.#post('getMessageBoardList', params)
  }

  // >>>>>>>>>>>>>>>>>>>>>>> User Manager

  /** 注册 */
  register(params?: P<'register'>) {
    return this.#post('register', params)
  }
  /** 注册 */
  registerV2(params?: P<'registerV2'>) {
    return this.#post('registerV2', params)
  }
  /** 登录 */
  login(params?: P<'login'>) {
    return this.#post('login', params)
  }
  /** 查询用户信息 */
  findUserInfo() {
    return this.#get('findUserInfo', {})
  }
  /** 修改用户信息 */
  updateUserInfo(params?: P<'updateUserInfo'>) {
    return this.#post('updateUserInfo', params)
  }
  /** 修改用户密码 */
  updatePassWord(params?: P<'updatePassWord'>) {
    return this.#post('updatePassWord', params)
  }
  /** 发送注册验证码到邮箱 */
  sendEmailMessage(params?: P<'sendEmailMessage'>) {
    return this.#post('sendEmailMessage', params)
  }
  /** 获取登录验证码图片 */
  getCodeImg() {
    return this.#get('getCodeImg', {})
  }
  /** 用户签到 */
  signInUser() {
    return this.#get('signInUser', {})
  }
  /** 获取签到排行榜 */
  getSignInList(params?: P<'getSignInList'>) {
    return this.#post('getSignInList', params)
  }

  // >>>>>>>>>>>>>>>>>>>>>>> Payment System

  /** 创建订单 */
  createOrder(params?: P<'createOrder'>) {
    return this.#post('createOrder', params)
  }
  /** 发起支付 */
  pay(params?: P<'pay'>) {
    return this.#post('pay', params)
  }
  /** 搜索订单 */
  searchOrder(params?: P<'searchOrder'>) {
    return this.#post('searchOrder', params)
  }
  /** 查询用户余额流水 */
  getUserBalanceList(params?: P<'getUserBalanceList'>) {
    return this.#post('getUserBalanceList', params)
  }
  /** 用户使用余额购买会员 */
  userByVipWithBalance(params?: P<'userByVipWithBalance'>) {
    return this.#post('userByVipWithBalance', params)
  }
  /** 修改用户余额接口 */
  updateUserBalance(params?: P<'updateUserBalance'>) {
    return this.#post('updateUserBalance', params)
  }
  /** 获取会员列表 */
  getVipList(params?: P<'getVipList'>) {
    return this.#post('getVipList', params)
  }

  // >>>>>>>>>>>>>>>>>>>>>>> Payment system -> Shop

  /** 获取商品列表 */
  getGoodsList(params?: P<'getGoodsList'>) {
    return this.#post('getGoodsList', params)
  }
  /** 获取商品标签 */
  getLabelList(params?: P<'getLabelList'>) {
    return this.#get('getLabelList', params)
  }

  // >>>>>>>>>>>>>>>>>>>>>>> Payment system -> Card Key
  /** 卡密校验 */
  verifyCardV2(params?: P<'verifyCardV2'>) {
    return this.#post('verifyCardV2', params)
  }
  /** 卡密校验 */
  verifyCardV1(params?: P<'verifyCardV1'>) {
    return this.#post('verifyCardV1', params)
  }
  /** 卡密解绑设备 */
  unbindCard(params?: P<'unbindCard'>) {
    return this.#post('unbindCard', params)
  }
  /** 用户生成卡密接口 */
  createCardMy(params?: P<'createCardMy'>) {
    return this.#post('createCardMy', params)
  }
  /** 查询用户生成卡密列表 */
  getCardMyList(params?: P<'getCardMyList'>) {
    return this.#post('getCardMyList', params)
  }
}


