import { useLanguage } from "@/components/common/language-provider"

export function Testimonial() {
  const { t } = useLanguage()

  return (
    <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:bg-card lg:px-12">
      <div className="mx-auto max-w-md">
        <blockquote className="space-y-4">
          <p className="text-lg text-muted-foreground">
            {`"${t("login.testimonial")}"`}
          </p>
          <footer>
            <p className="font-semibold">{t("login.testimonialAuthor")}</p>
            <p className="text-sm text-muted-foreground">
              {t("login.testimonialRole")}
            </p>
          </footer>
        </blockquote>
      </div>
    </div>
  )
}
