"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "zh" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations: Record<Language, Record<string, string>> = {
  zh: {
    // Common
    "app.name": "CopyAI",
    "theme.light": "浅色",
    "theme.dark": "深色",
    "theme.system": "跟随系统",
    "language.zh": "中文",
    "language.en": "English",
    // Navigation
    "nav.features": "功能特点",
    "nav.pricing": "价格方案",
    "nav.about": "关于我们",
    "nav.login": "登录",
    "nav.freeTrial": "免费试用",
    // Hero
    "hero.badge": "AI 驱动的智能文案生成",
    "hero.title1": "让 AI 为您创作",
    "hero.title2": "高转化率",
    "hero.title3": "的营销文案",
    "hero.description": "专为社交媒体、电商平台、内容营销打造。一键生成专业文案，提升您的营销效率。",
    "hero.cta": "立即免费试用",
    "hero.loginCta": "已有账号？登录",
    // Stats
    "stats.copies": "生成文案数",
    "stats.users": "活跃用户",
    "stats.satisfaction": "用户满意度",
    "stats.efficiency": "效率提升",
    // Features
    "features.title": "强大功能，简单易用",
    "features.description": "为您的营销工作提供全方位的 AI 文案支持",
    "features.multiPlatform.title": "多平台支持",
    "features.multiPlatform.description": "支持小红书、微信公众号、抖音、微博等主流平台的文案风格",
    "features.targeting.title": "精准定位",
    "features.targeting.description": "根据目标受众和营销目的，生成高转化率的专业文案",
    "features.history.title": "历史记录",
    "features.history.description": "自动保存所有生成记录，随时查看和复用优质文案",
    // CTA
    "cta.title": "准备好提升您的文案效率了吗？",
    "cta.description": "立即注册，获得免费体验额度",
    "cta.button": "免费开始使用",
    // Footer
    "footer.rights": "© 2026 CopyAI. All rights reserved.",
    // Login
    "login.title": "登录您的账号",
    "login.noAccount": "还没有账号？",
    "login.register": "立即注册",
    "login.email": "邮箱地址",
    "login.password": "密码",
    "login.forgotPassword": "忘记密码？",
    "login.submit": "登录",
    "login.loading": "登录中...",
    "login.orLoginWith": "或使用以下方式登录",
    "login.wechat": "微信",
    "login.github": "GitHub",
    "login.testimonial": "CopyAI 彻底改变了我们的内容创作流程。原本需要数小时的文案工作，现在只需几分钟就能完成。",
    "login.testimonialAuthor": "张明",
    "login.testimonialRole": "某电商品牌营销总监",
    // Dashboard
    "dashboard.settings": "生成设置",
    "dashboard.settingsDesc": "配置您的文案生成参数",
    "dashboard.platform": "目标平台",
    "dashboard.platformPlaceholder": "选择发布平台",
    "dashboard.topic": "文案主题",
    "dashboard.topicPlaceholder": "例如：春季护肤技巧",
    "dashboard.keywords": "关键词（可选）",
    "dashboard.keywordsPlaceholder": "输入关键词，用逗号分隔",
    "dashboard.generate": "生成文案",
    "dashboard.generating": "生成中...",
    "dashboard.result": "生成结果",
    "dashboard.resultDesc": "AI 为您生成的文案内容",
    "dashboard.regenerate": "重新生成",
    "dashboard.copy": "复制内容",
    "dashboard.copied": "已复制",
    "dashboard.noContent": "还没有生成内容",
    "dashboard.noContentDesc": "在左侧填写生成参数，点击生成文案按钮开始创作",
    "dashboard.history": "历史记录",
    "dashboard.historyCount": "条记录",
    "dashboard.noHistory": "暂无历史记录",
    "dashboard.minutesAgo": "分钟前",
    "dashboard.hoursAgo": "小时前",
    "dashboard.daysAgo": "天前",
    "user.menu": "用户菜单",
    "user.profile": "个人信息",
    "user.settings": "设置",
    "user.signOut": "退出登录",
    // Platforms
    "platform.xiaohongshu": "小红书",
    "platform.wechat": "微信公众号",
    "platform.douyin": "抖音",
    "platform.weibo": "微博",
    "platform.taobao": "淘宝详情",
    "platform.general": "通用文案",
    // Register
    "register.title": "创建您的账号",
    "register.hasAccount": "已有账号？",
    "register.login": "立即登录",
    "register.name": "姓名",
    "register.namePlaceholder": "请输入您的姓名",
    "register.email": "邮箱地址",
    "register.password": "密码",
    "register.passwordPlaceholder": "至少 8 位字符",
    "register.submit": "创建账号",
    "register.loading": "注册中...",
    "register.terms": "注册即表示您同意我们的",
    "register.termsOfService": "服务条款",
    "register.and": "和",
    "register.privacyPolicy": "隐私政策",
    "register.orRegisterWith": "或使用以下方式注册",
    "register.heroTitle": "开始您的 AI 文案之旅",
    "register.heroDescription": "注册即可获得免费体验额度，立即体验 AI 智能文案生成的魅力。",
    "register.feature1": "每月 100 次免费生成额度",
    "register.feature2": "支持 10+ 主流平台",
    "register.feature3": "无限历史记录保存",
  },
  en: {
    // Common
    "app.name": "CopyAI",
    "theme.light": "Light",
    "theme.dark": "Dark",
    "theme.system": "System",
    "language.zh": "中文",
    "language.en": "English",
    // Navigation
    "nav.features": "Features",
    "nav.pricing": "Pricing",
    "nav.about": "About",
    "nav.login": "Login",
    "nav.freeTrial": "Free Trial",
    // Hero
    "hero.badge": "AI-Powered Copy Generation",
    "hero.title1": "Let AI Create",
    "hero.title2": "High-Converting",
    "hero.title3": "Marketing Copy",
    "hero.description": "Built for social media, e-commerce, and content marketing. Generate professional copy with one click.",
    "hero.cta": "Start Free Trial",
    "hero.loginCta": "Have an account? Login",
    // Stats
    "stats.copies": "Copies Generated",
    "stats.users": "Active Users",
    "stats.satisfaction": "Satisfaction",
    "stats.efficiency": "Efficiency Boost",
    // Features
    "features.title": "Powerful Features, Easy to Use",
    "features.description": "Comprehensive AI copywriting support for your marketing",
    "features.multiPlatform.title": "Multi-Platform",
    "features.multiPlatform.description": "Support for major platforms including Instagram, Twitter, TikTok, LinkedIn and more",
    "features.targeting.title": "Precise Targeting",
    "features.targeting.description": "Generate professional copy based on target audience and marketing goals",
    "features.history.title": "History",
    "features.history.description": "Automatically save all generated content for easy review and reuse",
    // CTA
    "cta.title": "Ready to boost your copywriting efficiency?",
    "cta.description": "Sign up now and get free credits",
    "cta.button": "Get Started Free",
    // Footer
    "footer.rights": "© 2026 CopyAI. All rights reserved.",
    // Login
    "login.title": "Login to your account",
    "login.noAccount": "Don't have an account?",
    "login.register": "Sign up",
    "login.email": "Email Address",
    "login.password": "Password",
    "login.forgotPassword": "Forgot password?",
    "login.submit": "Login",
    "login.loading": "Logging in...",
    "login.orLoginWith": "Or login with",
    "login.wechat": "WeChat",
    "login.github": "GitHub",
    "login.testimonial": "CopyAI has completely transformed our content creation workflow. What used to take hours now takes just minutes.",
    "login.testimonialAuthor": "John Smith",
    "login.testimonialRole": "Marketing Director, E-commerce Brand",
    // Dashboard
    "dashboard.settings": "Generation Settings",
    "dashboard.settingsDesc": "Configure your copy generation parameters",
    "dashboard.platform": "Target Platform",
    "dashboard.platformPlaceholder": "Select platform",
    "dashboard.topic": "Topic",
    "dashboard.topicPlaceholder": "e.g., Spring skincare tips",
    "dashboard.keywords": "Keywords (Optional)",
    "dashboard.keywordsPlaceholder": "Enter keywords, separated by commas",
    "dashboard.generate": "Generate Copy",
    "dashboard.generating": "Generating...",
    "dashboard.result": "Generated Result",
    "dashboard.resultDesc": "AI-generated copy content",
    "dashboard.regenerate": "Regenerate",
    "dashboard.copy": "Copy Content",
    "dashboard.copied": "Copied",
    "dashboard.noContent": "No content generated yet",
    "dashboard.noContentDesc": "Fill in the parameters on the left and click Generate Copy to start",
    "dashboard.history": "History",
    "dashboard.historyCount": "records",
    "dashboard.noHistory": "No history yet",
    "dashboard.minutesAgo": "minutes ago",
    "dashboard.hoursAgo": "hours ago",
    "dashboard.daysAgo": "days ago",
    "user.menu": "User Menu",
    "user.profile": "Profile",
    "user.settings": "Settings",
    "user.signOut": "Sign Out",
    // Platforms
    "platform.xiaohongshu": "Xiaohongshu",
    "platform.wechat": "WeChat",
    "platform.douyin": "TikTok",
    "platform.weibo": "Weibo",
    "platform.taobao": "Taobao",
    "platform.general": "General",
    // Register
    "register.title": "Create your account",
    "register.hasAccount": "Already have an account?",
    "register.login": "Login",
    "register.name": "Name",
    "register.namePlaceholder": "Enter your name",
    "register.email": "Email Address",
    "register.password": "Password",
    "register.passwordPlaceholder": "At least 8 characters",
    "register.submit": "Create Account",
    "register.loading": "Creating...",
    "register.terms": "By signing up, you agree to our",
    "register.termsOfService": "Terms of Service",
    "register.and": "and",
    "register.privacyPolicy": "Privacy Policy",
    "register.orRegisterWith": "Or sign up with",
    "register.heroTitle": "Start Your AI Copywriting Journey",
    "register.heroDescription": "Sign up to get free credits and experience the power of AI-powered copy generation.",
    "register.feature1": "100 free generations per month",
    "register.feature2": "Support for 10+ platforms",
    "register.feature3": "Unlimited history storage",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("zh")

  useEffect(() => {
    const saved = localStorage.getItem("language") as Language
    if (saved && (saved === "zh" || saved === "en")) {
      setLanguageState(saved)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
  }

  const t = (key: string) => {
    return translations[language][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
