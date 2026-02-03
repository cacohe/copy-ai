/**
 * HTTP 请求工具函数
 * 提供类型安全的 GET 和 POST 请求方法
 */

// 请求配置接口
interface RequestConfig extends RequestInit {
  timeout?: number // 超时时间（毫秒）
  baseURL?: string // 基础 URL
}

// 响应接口
interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// 错误类
export class HttpError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    message?: string
  ) {
    super(message || `HTTP Error ${status}: ${statusText}`)
    this.name = 'HttpError'
  }
}

/**
 * 创建带超时的 fetch 请求
 */
function fetchWithTimeout(
  url: string,
  config: RequestConfig = {}
): Promise<Response> {
  const { timeout = 30000, ...fetchConfig } = config

  return Promise.race([
    fetch(url, fetchConfig),
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    ),
  ])
}

/**
 * 通用请求处理函数
 */
async function request<T = any>(
  url: string,
  config: RequestConfig = {}
): Promise<T> {
  const { baseURL = '', ...requestConfig } = config

  // 构建完整 URL
  const fullUrl = baseURL ? `${baseURL}${url}` : url

  try {
    // 发送请求
    const response = await fetchWithTimeout(fullUrl, {
      ...requestConfig,
      headers: {
        'Content-Type': 'application/json',
        ...requestConfig.headers,
      },
    })

    // 检查响应状态
    if (!response.ok) {
      throw new HttpError(
        response.status,
        response.statusText,
        `Request failed with status ${response.status}`
      )
    }

    // 解析响应
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      return await response.json()
    }

    // 如果不是 JSON，返回文本
    return (await response.text()) as any
  } catch (error) {
    if (error instanceof HttpError) {
      throw error
    }

    if (error instanceof Error) {
      throw new Error(`Network error: ${error.message}`)
    }

    throw new Error('Unknown error occurred')
  }
}

/**
 * GET 请求
 * @param url 请求路径
 * @param params 查询参数
 * @param config 请求配置
 */
export async function get<T = any>(
  url: string,
  params?: Record<string, any>,
  config?: RequestConfig
): Promise<T> {
  // 构建查询字符串
  let fullUrl = url
  if (params && Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value))
      }
    })
    fullUrl = `${url}?${searchParams.toString()}`
  }

  return request<T>(fullUrl, {
    ...config,
    method: 'GET',
  })
}

/**
 * POST 请求
 * @param url 请求路径
 * @param data 请求体数据
 * @param config 请求配置
 */
export async function post<T = any>(
  url: string,
  data?: any,
  config?: RequestConfig
): Promise<T> {
  return request<T>(url, {
    ...config,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  })
}

/**
 * PUT 请求
 * @param url 请求路径
 * @param data 请求体数据
 * @param config 请求配置
 */
export async function put<T = any>(
  url: string,
  data?: any,
  config?: RequestConfig
): Promise<T> {
  return request<T>(url, {
    ...config,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  })
}

/**
 * DELETE 请求
 * @param url 请求路径
 * @param config 请求配置
 */
export async function del<T = any>(
  url: string,
  config?: RequestConfig
): Promise<T> {
  return request<T>(url, {
    ...config,
    method: 'DELETE',
  })
}

/**
 * PATCH 请求
 * @param url 请求路径
 * @param data 请求体数据
 * @param config 请求配置
 */
export async function patch<T = any>(
  url: string,
  data?: any,
  config?: RequestConfig
): Promise<T> {
  return request<T>(url, {
    ...config,
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  })
}

/**
 * 创建带有默认配置的 HTTP 客户端
 */
export function createHttpClient(defaultConfig: RequestConfig = {}) {
  return {
    get: <T = any>(url: string, params?: Record<string, any>, config?: RequestConfig) =>
      get<T>(url, params, { ...defaultConfig, ...config }),
    
    post: <T = any>(url: string, data?: any, config?: RequestConfig) =>
      post<T>(url, data, { ...defaultConfig, ...config }),
    
    put: <T = any>(url: string, data?: any, config?: RequestConfig) =>
      put<T>(url, data, { ...defaultConfig, ...config }),
    
    delete: <T = any>(url: string, config?: RequestConfig) =>
      del<T>(url, { ...defaultConfig, ...config }),
    
    patch: <T = any>(url: string, data?: any, config?: RequestConfig) =>
      patch<T>(url, data, { ...defaultConfig, ...config }),
  }
}

// 导出默认实例
export default {
  get,
  post,
  put,
  delete: del,
  patch,
  createHttpClient,
}