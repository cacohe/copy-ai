import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/common/language-provider"
import { WeChatIcon, GithubIcon } from "@/components/login/social-icons"

export function SocialLogin() {
  const { t } = useLanguage()

  return (
    <>
      <Divider text={t("login.orLoginWith")} />

      <div className="mt-6 grid grid-cols-2 gap-4">
        <SocialButton
          icon={<WeChatIcon />}
          label={t("login.wechat")}
          onClick={() => handleSocialLogin("wechat")}
        />
        <SocialButton
          icon={<GithubIcon />}
          label={t("login.github")}
          onClick={() => handleSocialLogin("github")}
        />
      </div>
    </>
  )
}

interface DividerProps {
  text: string
}

function Divider({ text }: DividerProps) {
  return (
    <div className="relative mt-8">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-border" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="bg-background px-2 text-muted-foreground">
          {text}
        </span>
      </div>
    </div>
  )
}

interface SocialButtonProps {
  icon: React.ReactNode
  label: string
  onClick: () => void
}

function SocialButton({ icon, label, onClick }: SocialButtonProps) {
  return (
    <Button
      variant="outline"
      className="h-11 bg-transparent"
      onClick={onClick}
      type="button"
    >
      {icon}
      {label}
    </Button>
  )
}

function handleSocialLogin(provider: "wechat" | "github") {
  // TODO: Implement social login logic
  console.log(`Social login with ${provider}`)
}
