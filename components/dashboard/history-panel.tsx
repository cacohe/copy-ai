import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, Trash2 } from "lucide-react"
import { useLanguage } from "@/components/common/language-provider"
import { HistoryItem } from "@/types/dashboard/history"
import { formatTimeAgo } from "@/lib/utils/time"

interface HistoryPanelProps {
  history: HistoryItem[]
  selectedHistory: string | null
  onSelectHistory: (item: HistoryItem) => void
  onDeleteHistory: (id: string) => void
}

export function HistoryPanel({
  history,
  selectedHistory,
  onSelectHistory,
  onDeleteHistory,
}: HistoryPanelProps) {
  const { t } = useLanguage()

  return (
    <aside className="flex w-80 shrink-0 flex-col border-l border-border bg-card">
      <HistoryHeader historyCount={history.length} />
      <ScrollArea className="flex-1">
        {history.length > 0 ? (
          <HistoryList
            history={history}
            selectedHistory={selectedHistory}
            onSelectHistory={onSelectHistory}
            onDeleteHistory={onDeleteHistory}
          />
        ) : (
          <EmptyHistory />
        )}
      </ScrollArea>
    </aside>
  )
}

function HistoryHeader({ historyCount }: { historyCount: number }) {
  const { t } = useLanguage()

  return (
    <div className="flex items-center justify-between border-b border-border p-4">
      <div>
        <h2 className="font-semibold">{t("dashboard.history")}</h2>
        <p className="text-xs text-muted-foreground">
          {historyCount} {t("dashboard.historyCount")}
        </p>
      </div>
      <Clock className="h-4 w-4 text-muted-foreground" />
    </div>
  )
}

interface HistoryListProps {
  history: HistoryItem[]
  selectedHistory: string | null
  onSelectHistory: (item: HistoryItem) => void
  onDeleteHistory: (id: string) => void
}

function HistoryList({
  history,
  selectedHistory,
  onSelectHistory,
  onDeleteHistory,
}: HistoryListProps) {
  return (
    <div className="divide-y divide-border">
      {history.map((item) => (
        <HistoryItemCard
          key={item.id}
          item={item}
          isSelected={selectedHistory === item.id}
          onSelect={() => onSelectHistory(item)}
          onDelete={() => onDeleteHistory(item.id)}
        />
      ))}
    </div>
  )
}

interface HistoryItemCardProps {
  item: HistoryItem
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
}

function HistoryItemCard({
  item,
  isSelected,
  onSelect,
  onDelete,
}: HistoryItemCardProps) {
  const { t } = useLanguage()

  return (
    <div
      className={`group cursor-pointer p-4 transition-colors hover:bg-secondary ${
        isSelected ? "bg-secondary" : ""
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="rounded bg-accent/20 px-2 py-0.5 text-xs text-accent">
              {item.platform}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatTimeAgo(item.createdAt, t)}
            </span>
          </div>
          <h4 className="mt-2 truncate font-medium text-sm">{item.topic}</h4>
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
            {item.content}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
        >
          <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
        </Button>
      </div>
    </div>
  )
}

function EmptyHistory() {
  const { t } = useLanguage()

  return (
    <div className="flex h-40 flex-col items-center justify-center text-center">
      <Clock className="h-8 w-8 text-muted-foreground" />
      <p className="mt-2 text-sm text-muted-foreground">
        {t("dashboard.noHistory")}
      </p>
    </div>
  )
}