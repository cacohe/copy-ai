/**
 * 用户信息
 */
// export interface UserInfo {
//   id: string
//   email: string
//   name?: string
//   avatar?: string
//   createdAt: Date
// }

export interface RegisterFormData {
  name: string
  email: string
  password: string
}

export interface RegisterResponse {
  success: boolean
  message?: string
}

/**
 * 登录凭证
 */
export interface LoginFormData {
  email: string
  password: string
}

/**
 * 登录响应
 */
export interface LoginResponse {
  success: boolean
  error?: string
  user?: {
    id: string
    email: string
    name?: string
  }
  token?: string
}

/**
 * 社交登录提供商
 */
export type SocialProvider = "wechat" | "github" | "google"

/**
 * 社交登录配置
 */
export interface SocialLoginConfig {
  provider: SocialProvider
  clientId: string
  redirectUri: string
}