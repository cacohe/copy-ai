type TranslationFunction = (key: string) => string

export function formatTimeAgo(date: Date, t: TranslationFunction): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 60) {
    return `${minutes} ${t("dashboard.minutesAgo")}`
  }
  if (hours < 24) {
    return `${hours} ${t("dashboard.hoursAgo")}`
  }
  return `${days} ${t("dashboard.daysAgo")}`
}