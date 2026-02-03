import { post } from "./http-utils";

interface GenerateContentOptions {
  platform: string
  topic: string
  keywords?: string
  onProgress?: (chunk: string) => void
}

export async function generateContent({
  platform,
  topic,
  keywords
}: GenerateContentOptions): Promise<string> {

  const copywrite = await fetch('/api/generate', {
      method: 'POST',
      body: JSON.stringify({ platform, topic, keywords }), // 把内存里的数据发给后端
      headers: { 'Content-Type': 'application/json' }
    });
  
  const data = await copywrite.json();
  return data.content;
}