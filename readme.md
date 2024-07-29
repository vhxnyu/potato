# Potato 
## 这是什么?

这是 [土豆云](http://doc.xudakj.xyz/) 的 API 封装, 提供类型提示和自动完成

## 安装

**使用 npm**

```sh
npm i @vhxnyu/potato
```

**使用 zdjl**

```js
const { Potato } = require('@vhxnyu/potato')
```

## 用例

```js
// 根据你的 环境/适用的模块规范 三选一

// node esm
import { Potato } from '@vhxnyu/potato'

// node cjs
const { Potato } = require('@vhxnyu/potato')

// zdjl
const { Potato } = require('@vhxnyu/potato')


// 实例化
const app = new Potato({
  // 可选项, 为空则无法使用
  appToken: 'askKey',
  // 可选项, 为空则不启用
  sign: '签名',
  // 可选项, 为空则不启用
  cryptoKey: '加解密密钥',
  // 可选项, 加密请求数据使用的算法, 这里使用RC4作为示例, 不填的话默认使用AES ECB PKcs#7/5
  encryptMethod: Potato.CryptoMethod.RC4
  // 可选项, 解密响应数据使用的算法, 这里使用RC4作为示例, 不填的话默认使用AES ECB PKcs#7/5
  decryptMethod: Potato.CryptoMethod.RC4
  // 可选项, 用户令牌,如果没有缓存的话也可以在稍后设置
  userToken: '用户令牌',
})

// 所有的预设参数都可以稍后修改, 像这样:
app.login({userNumber: 'user', passWord: 'pwd'}).then(res =>{
  app.presets.userToken = res.data.apiUserToken
})

// 试试获取你的应用信息:
app.getAppInfo().then(console.log).catch(console.error)
```

</br>

## Potato

<details> <summary> <font size="4">静态属性</font>  </summary>

- Potato.CryptoMethod
  > 加密/解密算法列表
- Potato.defaultPresets
  > 创建时使用的默认预设
</details>

<details> <summary> <font size="4">实例属性</font>  </summary>

- Potato: CryptoMethod  
  > 加密/解密算法列表
- Potato: presets  
  > 预设

</details>

<details> <summary> <font size="4">实例方法</font>  </summary>

- Potato._axios  
  > 内部使用的 axios 实例

### App itself
- Potato.prototype.getNotice()
  > 获取应用公告
- Potato.prototype.getAppInfo()
  > 获取应用信息
- Potato.prototype.updateApp()
  > 获取应用新版本
- Potato.prototype.sendEmailByUser()
  > 发送邮件
- Potato.prototype.startApp()
  > 应用启动计数
- Potato.prototype.getAppUpdateLog()
  > 获取更新记录
- Potato.prototype.feedBack()
  > 反馈
- Potato.prototype.getDoc()
  > 获取文档
- Potato.prototype.sendWeChatMessage()
  > 发送微信提醒

### Message boards 留言板

- Potato.prototype.messageBoard()
  > 添加一则留言
- Potato.prototype.getMessageBoardList()
  > 获取留言板列表

### User

- Potato.prototype.register()
  > 注册
- Potato.prototype.registerV2()
  > 注册
- Potato.prototype.login()
  > 登录
- Potato.prototype.findUserInfo()
  > 查询用户信息
- Potato.prototype.updateUserInfo()
  > 修改用户信息
- Potato.prototype.updatePassWord()
  > 修改用户密码
- Potato.prototype.getCodeImg()
  > 获取登录验证码图片
- Potato.prototype.sendEmailMessage()
  > 发送验证码到邮箱
- Potato.prototype.signInUser()
  > 用户签到
- Potato.prototype.getSignInList()
  > 获取签到排行榜

### Payment system 支付

- Potato.prototype.createOrder()
  > 创建订单
- Potato.prototype.pay()
  > 发起支付
- Potato.prototype.searchOrder()
  > 搜索订单
- Potato.prototype.getUserBalanceList()
  > 查询用户余额流水
- Potato.prototype.userByVipWithBalance()
  > 用户使用余额购买会员
- Potato.prototype.updateUserBalance()
  > 修改用户余额接口
- Potato.prototype.getVipList()
  > 获取会员列表

### Shop 商店

- Potato.prototype.getGoodsList()
  > 获取商品列表
- Potato.prototype.getLabelList()
  > 获取商品标签

### Card Key 卡密

- Potato.prototype.verifyCardV2()
  > 卡密校验
- Potato.prototype.verifyCardV1()
  > 卡密校验
- Potato.prototype.unbindCard()
  > 卡密解绑设备
- Potato.prototype.createCardMy()
  > 用户生成卡密接口
- Potato.prototype.getCardMyList()
  > 查询用户生成卡密列表
  </details>

## License 许可证
### [MIT](LICENSE)
