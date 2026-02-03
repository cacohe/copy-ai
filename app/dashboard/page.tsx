"use client"

import Link from "next/link"
import { Sparkles, LogOut, Settings, User, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/common/theme-toggle"
import { LanguageToggle } from "@/components/common/language-toggle"
import { useLanguage } from "@/components/common/language-provider"
import { useAuth } from "@/contexts/AuthContext"
import { GeneratorPanel } from "@/components/dashboard/generator-panel"
import { ContentPanel } from "@/components/dashboard/content-panel"
import { useContentGenerator } from "@/hooks/use-content-generator"
import { HistoryPanel } from "@/components/dashboard/history-panel"
import { useHistory } from "@/hooks/use-history"
import { HistoryItem } from "@/types/dashboard/history"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


export default function DashboardPage() {
  const { t } = useLanguage()
  const { user, signOut } = useAuth()
  const {
    platform,
    topic,
    keywords,
    generatedContent,
    isGenerating,
    setPlatform,
    setTopic,
    setKeywords,
    handleGenerate,
  } = useContentGenerator()

  const {
    history,
    selectedHistory,
    addToHistory,
    selectHistory,
    deleteHistory,
  } = useHistory()

  const handleGenerateWithHistory = async () => {
    const content = await handleGenerate()
    if (content) {
      addToHistory({
        platform,
        topic,
        content,
      })
    }
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-6">
        <Link href="/" className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-accent" />
          <span className="text-lg font-semibold">{t("app.name")}</span>
        </Link>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.user_metadata?.name || user?.email || t("user.profile")}</p>
                  <p className="text-xs leading-none text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {user?.email || "user@example.com"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2">
                <Settings className="h-4 w-4" />
                {t("user.settings")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut} className="gap-2 text-destructive focus:text-destructive">
                <LogOut className="h-4 w-4" />
                {t("user.signOut")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Input Form */}
        <GeneratorPanel
          platform={platform}
          topic={topic}
          keywords={keywords}
          isGenerating={isGenerating}
          onPlatformChange={setPlatform}
          onTopicChange={setTopic}
          onKeywordsChange={setKeywords}
          onGenerate={handleGenerateWithHistory}
        />

        {/* Center Panel - Generated Content */}
        <ContentPanel
          content={generatedContent}
          isGenerating={isGenerating}
          platform={platform}
          topic={topic}
          onRegenerate={handleGenerateWithHistory}
        />

        {/* Right Panel - History */}
        <HistoryPanel
          history={history}
          selectedHistory={selectedHistory}
          onSelectHistory={(item: HistoryItem) => selectHistory(item)}
          onDeleteHistory={deleteHistory}
        />
      </div>
    </div>
  )
}