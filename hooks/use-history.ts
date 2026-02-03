import { useState, useEffect } from "react"
import { HistoryItem, CreateHistoryItemInput } from "@/types/dashboard/history"
import { getHistoryContent } from "@/app/actions/dashboard"

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [selectedHistory, setSelectedHistory] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 从 Supabase 加载历史记录
  useEffect(() => {
    const loadHistory = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await getHistoryContent()
        
        // 将数据转换为 HistoryItem 格式
        const formattedHistory: HistoryItem[] = data.map((item: any) => ({
          id: item.id,
          platform: item.platform,
          topic: item.topic,
          content: item.content,
          createdAt: new Date(item.createdAt || item.created_at),
        }))
        
        setHistory(formattedHistory)
      } catch (err) {
        console.error("Failed to load history:", err)
        setError(err instanceof Error ? err.message : "Failed to load history")
      } finally {
        setIsLoading(false)
      }
    }

    loadHistory()
  }, [])

  const addToHistory = async (input: CreateHistoryItemInput) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(), // 临时 ID，实际 ID 会从数据库返回
      platform: input.platform,
      topic: input.topic,
      content: input.content,
      createdAt: new Date(),
    }
    
    // 乐观更新 UI
    setHistory((prev) => [newItem, ...prev])
    
    // TODO: 调用 Supabase 插入方法
    // 例如: await createHistoryItem(input)
    // 然后用返回的真实数据更新 newItem
    
    return newItem
  }

  const selectHistory = (item: HistoryItem) => {
    setSelectedHistory(item.id)
  }

  const deleteHistory = async (id: string) => {
    // 乐观更新 UI
    setHistory((prev) => prev.filter((item) => item.id !== id))
    if (selectedHistory === id) {
      setSelectedHistory(null)
    }
    
    // TODO: 调用 Supabase 删除方法
    // 例如: await deleteHistoryItem(id)
  }

  const clearHistory = async () => {
    // 乐观更新 UI
    setHistory([])
    setSelectedHistory(null)
    
    // TODO: 调用 Supabase 批量删除方法
    // 例如: await clearAllHistory()
  }

  return {
    history,
    selectedHistory,
    isLoading,
    error,
    addToHistory,
    selectHistory,
    deleteHistory,
    clearHistory,
  }
}