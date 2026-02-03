import { LucideIcon } from "lucide-react"
import { useLanguage } from "@/components/common/language-provider"
import { FEATURES_DATA } from "@/services/welcome/constants"
import { Section, SectionContainer, SectionHeader } from "./section-components"

export function FeaturesSectionOptimized() {
  const { t } = useLanguage()

  const features = FEATURES_DATA.map((feature) => ({
    icon: feature.icon,
    title: t(feature.titleKey as any),
    description: t(feature.descriptionKey as any),
  }))

  return (
    <Section id="features">
      <SectionContainer>
        <SectionHeader
          title={t("features.title")}
          description={t("features.description")}
        />
        <FeaturesGrid features={features} />
      </SectionContainer>
    </Section>
  )
}

interface Feature {
  icon: LucideIcon
  title: string
  description: string
}

interface FeaturesGridProps {
  features: Feature[]
}

function FeaturesGrid({ features }: FeaturesGridProps) {
  return (
    <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {features.map((feature) => (
        <FeatureCard
          key={feature.title}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
        />
      ))}
    </div>
  )
}

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
}

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-accent/50">
      <IconContainer>
        <Icon className="h-6 w-6 text-accent" />
      </IconContainer>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

interface IconContainerProps {
  children: React.ReactNode
}

function IconContainer({ children }: IconContainerProps) {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
      {children}
    </div>
  )
}
