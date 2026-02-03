import { LoginFormData, LoginResponse } from "@/types/auth/auth"

/**
 * 用户登录服务
 * @param credentials 登录凭证（邮箱和密码）
 * @returns 登录结果
 */
export async function loginUser(
  credentials: LoginFormData
): Promise<LoginResponse> {
  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Login service error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * 验证邮箱格式
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 验证密码强度
 * @param password 密码
 * @returns 是否满足最小要求
 */
export function isValidPassword(password: string): boolean {
  // 至少8个字符
  return password.length >= 8
}

/**
 * 验证登录表单
 */
export function validateLoginForm(credentials: LoginFormData): {
  isValid: boolean
  errors: {
    email?: string
    password?: string
  }
} {
  const errors: { email?: string; password?: string } = {}

  if (!credentials.email) {
    errors.email = "Email is required"
  } else if (!isValidEmail(credentials.email)) {
    errors.email = "Invalid email format"
  }

  if (!credentials.password) {
    errors.password = "Password is required"
  } else if (!isValidPassword(credentials.password)) {
    errors.password = "Password must be at least 8 characters"
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
