import { PotatoPresets, PotatoResponse } from "./types"

export class PotatoError extends Error {
  cause?: any
  detail?: any
  presets?: PotatoPresets
  requestBody?: Record<string, any>
  responseBody?: PotatoResponse | string
  constructor(
    override message: string,
    opt: {
      cause?: any
      detail?: any
      presets?: PotatoPresets
      requestBody?: Record<string, any> | string
      responseBody?: PotatoResponse | string
    }
  ) {
    super()
    this.name = 'PotatoError'
    try{opt.requestBody=JSON.parse(opt.requestBody as string)}catch{}
    Object.assign(this, opt)
  }
}

