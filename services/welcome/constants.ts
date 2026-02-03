import { Zap, Target, BarChart3, LucideIcon } from "lucide-react"

/**
 * 统计数据配置
 */
export const STATS_DATA = [
  { value: "10M+", labelKey: "stats.copies" },
  { value: "50K+", labelKey: "stats.users" },
  { value: "98%", labelKey: "stats.satisfaction" },
  { value: "3x", labelKey: "stats.efficiency" },
] as const

/**
 * 功能特性配置
 */
export const FEATURES_DATA: Array<{
  icon: LucideIcon
  titleKey: string
  descriptionKey: string
}> = [
  {
    icon: Zap,
    titleKey: "features.multiPlatform.title",
    descriptionKey: "features.multiPlatform.description",
  },
  {
    icon: Target,
    titleKey: "features.targeting.title",
    descriptionKey: "features.targeting.description",
  },
  {
    icon: BarChart3,
    titleKey: "features.history.title",
    descriptionKey: "features.history.description",
  },
] as const

/**
 * 导航链接配置
 */
export const NAV_LINKS = [
  { href: "#features", labelKey: "nav.features" },
  { href: "#pricing", labelKey: "nav.pricing" },
  { href: "#about", labelKey: "nav.about" },
] as const

/**
 * 主要CTA按钮配置
 */
export const PRIMARY_CTA = {
  href: "/dashboard",
  labelKey: "hero.cta",
} as const

export const SECONDARY_CTA = {
  href: "/login",
  labelKey: "hero.loginCta",
} as const
