import axios from 'axios'
import { PotatoError } from './PotatoError'
import { detailTypeOf, logger } from './utils'
import cryptoJs from 'crypto-js'

import type { InternalAxiosRequestConfig, AxiosResponse, AxiosInstance, AxiosRequestConfig } from 'axios'
import type { Condition, Expand, PotatoPresets, PotatoResponse, } from './types'

type ExpandPotatoPresets = Expand<PotatoPresets>

export enum CryptoMethod {
  AES_ECB_PKCS7 = 1,
  AES_ECB_ZERO,
  DES_ECB_PKCS7,
  RC4,
}

export class PotatoBase {
  static readonly CryptoMethod = CryptoMethod
  public readonly CryptoMethod = CryptoMethod

  // 创建实例时作为默认值
  static #createInstanceUsedDefaultPresets: PotatoPresets = {
    appToken: undefined,
    sign: undefined,
    baseUrl: 'https://api.potatocloud.cn/api',
    cryptoKey: undefined,
    encryptMethod: CryptoMethod.AES_ECB_PKCS7,
    decryptMethod: CryptoMethod.AES_ECB_PKCS7,
    userToken: undefined,
    interceptors: {}
  }

  static get defaultPresets() {
    //  写入属性时校验
    return new Proxy(PotatoBase.#createInstanceUsedDefaultPresets, {
      set(target, key: string | symbol, value) {
        if (!Object.keys(PotatoBase.#createInstanceUsedDefaultPresets).includes(key.toString())) {
          throw new PotatoError(`属性 ${key.toString()} 不应添加到 globalPresets 中`, {})
        }
        ; (<any>target)[key] = value
        return true
      }
    })
  }

  static set defaultPresets(value: PotatoPresets) {
    PotatoBase.#checkPresets(value) // 覆盖对象时校验属性
    Object.assign(PotatoBase.#createInstanceUsedDefaultPresets, value) //与默认值合并
  }

  static #checkPresets(value: PotatoPresets) {
    // 校验运行时的对象的形状
    if (detailTypeOf(value) !== 'object') {
      throw new PotatoError('globalPresets 仅接受一个普通对象', {})
    }
    if (Reflect.ownKeys(value).length > Object.keys(this.#createInstanceUsedDefaultPresets).length) {
      throw new PotatoError('超出可配置项', {})
    }
    Reflect.ownKeys(value).forEach(key => {
      if (!Object.keys(this.#createInstanceUsedDefaultPresets).includes(key.toString())) {
        throw new PotatoError(`属性 ${key.toString()} 不应添加到 globalPresets 中`, {})
      }
    })
  }

  protected _axios: AxiosInstance

  constructor(public presets: ExpandPotatoPresets = {}, debug = false) {
    PotatoBase.#checkPresets(this.presets)
    this.presets = Object.assign(PotatoBase.#createInstanceUsedDefaultPresets, this.presets)

    this._axios = axios
    this._axios.defaults.baseURL = this.presets.baseUrl

    const timestamp = () => new Date().getTime()
    const md5 = (message: string) => cryptoJs.MD5(message).toString()

    // 使用实例拦截器
    if (this.presets.interceptors?.request && detailTypeOf(this.presets.interceptors?.request) === 'function') {
      this._axios.interceptors.request.use(this.presets.interceptors?.request)
    }

    // 发起请求前拦截
    this._axios.interceptors.request.use((cfg: InternalAxiosRequestConfig<Record<string, string | number>>) => {

      // 添加预设参数
      if (!this.presets.appToken || typeof this.presets.appToken !== 'string') throw new PotatoError('请配置正确的appToken', { presets: this.presets })
      cfg.headers.askKey = this.presets.appToken
      cfg.headers.apiUserToken = this.presets.userToken
      if (this.presets.sign) {
        // 签名
        const newTimestamp = timestamp()
        cfg.headers.sin = md5(this.presets.sign + newTimestamp)
        cfg.headers.time = newTimestamp
        debug && logger.log(cfg.url, '已添加签名')
      }

      // 加密
      if (this.presets.cryptoKey && this.presets.encryptMethod && Object.keys(cfg.data ?? {}).length) {
        try {

          cfg.data = Object.entries(cfg.data!).reduce((pre: Record<string, any>, [propName, propValue]) => {
            if (propValue != null) pre[propName] = this.#encrypt(this.presets.encryptMethod!, String(propValue), this.presets.cryptoKey!) // 仅加密值
            return pre
          }, {})

        } catch (err) {
          throw new PotatoError(`client:加密错误,${err.message}`, { cause: err, presets: this.presets, requestBody: cfg })
        }
        debug && logger.log(cfg.url, '加密完成')
      }

      return cfg
    })

    // 收到响应时拦截
    this._axios.interceptors.response.use((res: AxiosResponse<PotatoResponse>) => {

      // 全文解密
      function fullTextDecrypt(this: PotatoBase, res: AxiosResponse<PotatoResponse>) {
        if (typeof res.data === 'object' && Number(res.data.code) !== 200) {
          //服务端加密数据有例外,500错误返回报文为明文数据
          throw new PotatoError(`server:${res.data.message}`, { presets: this.presets, requestBody: res.config.data, responseBody: res.data })
        }

        if (typeof res.data !== 'object') {
          try {
            if (!this.presets.cryptoKey || !this.presets?.decryptMethod) throw Error('响应数据不是JSON,尝试解密时发生错误')
            return JSON.parse(this.#decrypt(this.presets.decryptMethod, res.data, this.presets.cryptoKey))
          } catch (err) {
            // 把解密失败的响应体返回了
            throw new PotatoError(`client:解密失败,${err.message}`, { cause: err, presets: this.presets, requestBody: res.config.data, responseBody: res.data })
          }
        }
        debug && logger.log(res.config.url, '解密完成')
      }

      const potatoResponse: PotatoResponse = this.presets.cryptoKey ? fullTextDecrypt.call(this, res) : res.data

      // Object.defineProperty(potatoResponse, '_from', { value: res })
      // potatoResponse.code = Number(potatoResponse.code)

      // 2xx 范围外报错, http status code不反应任何错误, 故从data.code判断
      if (Number(potatoResponse.code) < 200 || Number(potatoResponse.code) > 299) {
        throw new PotatoError(`server:${potatoResponse.message}`, { presets: this.presets, requestBody: res.config.data, responseBody: potatoResponse })
      }

      // 验签
      if (potatoResponse.sin && potatoResponse.time) {
        if (potatoResponse.sin === md5(this.presets.sign + potatoResponse.time)) {
          debug && logger.log(res.config.url, '签名校验通过')
        } else {
          debug && logger.error(res.config.url, '签名校验失败,无法识别服务端身份')
          throw new PotatoError('client:签名校验失败,无法识别服务端身份', { presets: this.presets, requestBody: res.config.data, responseBody: potatoResponse })
        }
      }

      return potatoResponse as any
    })

    // 使用实例拦截器
    if (this.presets.interceptors?.response && detailTypeOf(this.presets.interceptors?.response) === 'function') {
      this._axios.interceptors.response.use(this.presets.interceptors?.response as any)
    }
  }

  #generateUserCryptoConfig(cryptoMethod: CryptoMethod, key: string) {
    /**
     * @param key 
     * @param fillToLength 填充到长度
     * @param minPermissionLen 最小允许长度, 小于该长度则报错
     * @param maxPermissionLen 最大允许长度, 超出该长度则报错 
     */
    const keyPatch = (key: string, fillToLength: number, [minPermissionLen, maxPermissionLen]: [number, number]) => {
      if (key.length < minPermissionLen || key.length > maxPermissionLen) {
        throw new Error(`密钥长度错误,当前密钥算法的字符长度范围应是: ${minPermissionLen}-${maxPermissionLen}`)
      }
      return key.padEnd(fillToLength, '0')
    }

    // utf8, 1个字母 = 1Byte(字节) = 8bits(比特)
    // 算法密钥长度
    // aes key range: 16 <-> 32 len
    // des key range: 8 len
    // rc4 key range: any len

    switch (cryptoMethod) {
      case CryptoMethod.RC4:
        return {
          method: 'RC4',
          mode: undefined,
          padding: undefined,
          key: keyPatch(key, 0, [1, Infinity])
        }

      case CryptoMethod.AES_ECB_ZERO:
        return {
          method: 'AES',
          mode: 'ECB',
          padding: 'ZeroPadding',
          key: keyPatch(key, 16, [16, 16]) // 应为最大允许32长, 但由于土豆笨蛋云的特性, 这里定长16长, 否则服务端报解密失败
        }

      case CryptoMethod.DES_ECB_PKCS7:
        return {
          method: 'DES',
          mode: 'ECB',
          padding: 'Pkcs7',
          key: keyPatch(key, 8, [8, 8])
        }

      case CryptoMethod.AES_ECB_PKCS7:
        return {
          method: 'AES',
          mode: 'ECB',
          padding: 'Pkcs7',
          key: keyPatch(key, 32, [16, 32]) // 应为补位16长, 但由于土豆笨蛋云的特性, 这里*补到32长*, 否则服务端报错
        }

      default:
        throw new Error('没有这样的加解密算法')
    }
  }
  #encrypt(encryptMethod: CryptoMethod, plaintext: string, key: string, iv?: string) {
    const config = this.#generateUserCryptoConfig(encryptMethod, key)

    const cipherParams = cryptoJs[config.method as 'AES' | 'DES' | 'RC4']
      .encrypt(plaintext, cryptoJs.enc.Utf8.parse(config.key),
        config.method === 'RC4' ? undefined : {
          mode: cryptoJs.mode[config.mode as unknown as keyof typeof cryptoJs.mode],
          padding: cryptoJs.pad[config.padding as unknown as keyof typeof cryptoJs.pad],
          iv: config.mode === 'ECB' ? undefined : cryptoJs.enc.Utf8.parse(iv ?? '')
        })

    return cipherParams.toString(cryptoJs.format.OpenSSL) //base64
  }
  #decrypt(decryptMethod: CryptoMethod, ciphertext: string, key: string, iv?: string) {
    const config = this.#generateUserCryptoConfig(decryptMethod, key)

    const wordArray = cryptoJs[config.method as 'AES' | 'DES' | 'RC4']
      .decrypt(ciphertext, cryptoJs.enc.Utf8.parse(config.key),
        config.method === 'RC4' ? undefined : {
          mode: cryptoJs.mode[config.mode as unknown as keyof typeof cryptoJs.mode],
          padding: cryptoJs.pad[config.padding as unknown as keyof typeof cryptoJs.pad],
          iv: config.mode === 'ECB' ? undefined : cryptoJs.enc.Utf8.parse(iv ?? '')
        })

    return wordArray.toString(cryptoJs.enc.Utf8) //return plaintext
  }
}
