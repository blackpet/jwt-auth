
class V2 {
  baseOptions: RequestInit | undefined

  constructor(config?: RequestInit) {
    this.baseOptions = config
  }

  setBaseOptions(config: RequestInit) {
    this.baseOptions = config
  }

  async get(uri: string, option: any) {
    return await fetch(uri, {...this.baseOptions, ...option})
  }
}

export let v2 = new V2()
