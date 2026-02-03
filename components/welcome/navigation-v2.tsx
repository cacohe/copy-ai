import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { ThemeToggle } from "@/components/common/theme-toggle"
import { LanguageToggle } from "@/components/common/language-toggle"
import { useLanguage } from "@/components/common/language-provider"
import { NAV_LINKS } from "@/services/welcome/constants"

export function Navigation() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-sm">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Logo />
        <NavLinks />
        <NavActions />
      </nav>
    </header>
  )
}

function Logo() {
  const { t } = useLanguage()
  
  return (
    <Link href="/" className="flex items-center gap-2">
      <Sparkles className="h-6 w-6 text-accent" />
      <span className="text-xl font-semibold tracking-tight">
        {t("app.name")}
      </span>
    </Link>
  )
}

function NavLinks() {
  const { t } = useLanguage()

  return (
    <div className="hidden items-center gap-8 md:flex">
      {NAV_LINKS.map((link) => (
        <NavLink
          key={link.href}
          href={link.href}
          label={t(link.labelKey as any)}
        />
      ))}
    </div>
  )
}

interface NavLinkProps {
  href: string
  label: string
}

function NavLink({ href, label }: NavLinkProps) {
  return (
    <Link
      href={href}
      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      {label}
    </Link>
  )
}

function NavActions() {
  const { t } = useLanguage()

  return (
    <div className="flex items-center gap-2">
      <LanguageToggle />
      <ThemeToggle />
      <Button variant="ghost" asChild>
        <Link href="/login">{t("nav.login")}</Link>
      </Button>
      <Button asChild>
        <Link href="/dashboard">{t("nav.freeTrial")}</Link>
      </Button>
    </div>
  )
}
