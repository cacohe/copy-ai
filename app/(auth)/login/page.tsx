"use client"

import Link from "next/link"
import { Sparkles } from "lucide-react"
import { ThemeToggle } from "@/components/common/theme-toggle"
import { LanguageToggle } from "@/components/common/language-toggle"
import { useLanguage } from "@/components/common/language-provider"
import { LoginForm } from "@/components/login/login-form"
import { SocialLogin } from "@/components/login/social-login"
import { Testimonial } from "@/components/login/testimonial"

export default function LoginPage() {
  const { t } = useLanguage()

  return (
    <div className="relative flex min-h-screen">
      {/* Theme and Language Toggle */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <LanguageToggle />
        <ThemeToggle />
      </div>

      {/* Left side - Form */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="mx-auto w-full max-w-sm">
          <LoginHeader />
          <LoginForm />
          <SocialLogin />
        </div>
      </div>

      {/* Right side - Decoration */}
      <Testimonial />
    </div>
  )
}

function LoginHeader() {
  const { t } = useLanguage()

  return (
    <>
      <Link href="/" className="flex items-center gap-2">
        <Sparkles className="h-8 w-8 text-accent" />
        <span className="text-2xl font-bold">{t("app.name")}</span>
      </Link>

      <h1 className="mt-10 text-2xl font-bold tracking-tight">
        {t("login.title")}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {t("login.noAccount")}{" "}
        <Link href="/register" className="text-accent hover:underline">
          {t("login.register")}
        </Link>
      </p>
    </>
  )
}