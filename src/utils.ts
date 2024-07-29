const getTime = () => new Date().toLocaleString()

export const logger = {
  log(...args: any[]) {
    console.log('[I:]', `[${getTime()}]`, ...args)
  },
  warn(...args: any[]) {
    console.warn('[W:]', `[${getTime()}]`, ...args)
  },
  debug(...args: any[]) {
    console.debug(`[${getTime()}]`, ...args)
  },
  error(...args: any[]) {
    console.error('[E:]', `[${getTime()}]`, ...args)
  },
  dir(object: any) {
    console.dir(object, { depth: null })
  }
}

/**
 * 获取值的详细类型
 */
export const detailTypeOf = (value: any):
  'object' | 'array' | 'function' | 'null' | 'symbol' | 'undefined' | 'number' | 'string' | 'boolean' | 'bigint' => {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase()
}
