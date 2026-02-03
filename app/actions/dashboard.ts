import { HistoryItem } from "@/types/dashboard/history";


export async function getHistoryContent(): Promise<HistoryItem[]> {

  const copywrite = await fetch('/api/history', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
  
  const data = await copywrite.json();
  console.log("get history data:", data);
  return data.content;
}