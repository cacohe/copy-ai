"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Sparkles, Loader2, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/common/theme-toggle"
import { LanguageToggle } from "@/components/common/language-toggle"
import { useLanguage } from "@/components/common/language-provider"

// ==================== Types ====================
interface FormData {
  name: string
  email: string
  password: string
}

interface RegisterResponse {
  success: boolean
  message?: string
}

// ==================== Constants ====================
const SOCIAL_PROVIDERS = {
  WECHAT: {
    icon: (
      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"
        />
      </svg>
    ),
  },
  GITHUB: {
    icon: (
      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"
        />
      </svg>
    ),
  },
} as const

// ==================== Subcomponents ====================
const PageHeader = () => (
  <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
    <LanguageToggle />
    <ThemeToggle />
  </div>
)

const FeatureList: React.FC<{ features: string[] }> = ({ features }) => (
  <ul className="mt-8 space-y-4">
    {features.map((feature) => (
      <li key={feature} className="flex items-center gap-3">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/20">
          <Check className="h-4 w-4 text-accent" />
        </div>
        <span className="text-muted-foreground">{feature}</span>
      </li>
    ))}
  </ul>
)

const HeroSection: React.FC<{ title: string; description: string; features: string[] }> = ({
  title,
  description,
  features,
}) => (
  <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:bg-card lg:px-12">
    <div className="mx-auto max-w-md">
      <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
      <p className="mt-4 text-muted-foreground">{description}</p>
      <FeatureList features={features} />
    </div>
  </div>
)

const FormHeader: React.FC<{ appName: string; title: string; subtitle: React.ReactNode }> = ({
  appName,
  title,
  subtitle,
}) => (
  <div>
    <Link href="/" className="flex items-center gap-2">
      <Sparkles className="h-8 w-8 text-accent" />
      <span className="text-2xl font-bold">{appName}</span>
    </Link>

    <h1 className="mt-10 text-2xl font-bold tracking-tight">{title}</h1>
    <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
  </div>
)

const FormField: React.FC<{
  id: string
  label: string
  type: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  minLength?: number
}> = ({ id, label, type, placeholder, value, onChange, required, minLength }) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <Input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      minLength={minLength}
      className="h-11"
    />
  </div>
)

const SocialProviderButton: React.FC<{
  provider: keyof typeof SOCIAL_PROVIDERS
  label: string
  onClick?: () => void
}> = ({ provider, label, onClick }) => (
  <Button variant="outline" className="h-11 bg-transparent" onClick={onClick}>
    {SOCIAL_PROVIDERS[provider].icon}
    {label}
  </Button>
)

const Divider: React.FC<{ text: string }> = ({ text }) => (
  <div className="relative mt-8">
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-border" />
    </div>
    <div className="relative flex justify-center text-sm">
      <span className="bg-background px-2 text-muted-foreground">{text}</span>
    </div>
  </div>
)

// ==================== Main Component ====================
export default function RegisterPage() {
  const router = useRouter()
  const { t } = useLanguage()

  // State management
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
  })

  // Translation helpers
  const features = [
    t("register.feature1"),
    t("register.feature2"),
    t("register.feature3"),
  ]

  // Form handlers
  const updateFormField = (field: keyof FormData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })

      const data: RegisterResponse = await response.json()

      if (data.success) {
        router.push("/login")
      } else {
        // Handle error (could add error state here)
        console.error("Registration failed:", data.message)
      }
    } catch (error) {
      console.error("Registration error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`)
    // Implement social login logic
  }

  return (
    <div className="relative flex min-h-screen">
      <PageHeader />

      <HeroSection
        title={t("register.heroTitle")}
        description={t("register.heroDescription")}
        features={features}
      />

      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="mx-auto w-full max-w-sm">
          <FormHeader
            appName={t("app.name")}
            title={t("register.title")}
            subtitle={
              <>
                {t("register.hasAccount")}{" "}
                <Link href="/login" className="text-accent hover:underline">
                  {t("register.login")}
                </Link>
              </>
            }
          />

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <FormField
              id="name"
              label={t("register.name")}
              type="text"
              placeholder={t("register.namePlaceholder")}
              value={formData.name}
              onChange={updateFormField("name")}
              required
            />

            <FormField
              id="email"
              label={t("register.email")}
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={updateFormField("email")}
              required
            />

            <FormField
              id="password"
              label={t("register.password")}
              type="password"
              placeholder={t("register.passwordPlaceholder")}
              value={formData.password}
              onChange={updateFormField("password")}
              required
              minLength={8}
            />

            <Button type="submit" className="h-11 w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("register.loading")}
                </>
              ) : (
                t("register.submit")
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              {t("register.terms")}{" "}
              <Link href="#" className="underline hover:text-foreground">
                {t("register.termsOfService")}
              </Link>{" "}
              {t("register.and")}{" "}
              <Link href="#" className="underline hover:text-foreground">
                {t("register.privacyPolicy")}
              </Link>
            </p>
          </form>

          <Divider text={t("register.orRegisterWith")} />

          <div className="mt-6 grid grid-cols-2 gap-4">
            <SocialProviderButton
              provider="WECHAT"
              label={t("login.wechat")}
              onClick={() => handleSocialLogin("wechat")}
            />
            <SocialProviderButton
              provider="GITHUB"
              label={t("login.github")}
              onClick={() => handleSocialLogin("github")}
            />
          </div>
        </div>
      </div>
    </div>
  )
}