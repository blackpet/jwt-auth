
export interface LoginCredentialRequest {
  userId: string
  password: string
}

export interface LoginTokenResponse {
  access: string
  refresh: string
}

export interface UserClaimsResponse {
  sub: string
  iss: string
  iat: Date
  exp: Date
}
