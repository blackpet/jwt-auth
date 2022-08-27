
export type AuthRequestInit = RequestInit & {baseURL?: string}
export type PostRequestMethod = 'post' | 'put' | 'patch' | 'delete'
export type RequestMethod = 'get' | PostRequestMethod
