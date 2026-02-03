export const PLATFORMS = [
  { value: "general", label: "通用文案" },
  { value: "xiaohongshu", label: "小红书" },
  { value: "wechat", label: "微信公众号" },
  { value: "douyin", label: "抖音" },
  { value: "weibo", label: "微博" },
] as const

export type PlatformValue = typeof PLATFORMS[number]["value"]