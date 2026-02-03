import 'server-only';
import { ChatMessage } from '@/types/dashboard/llm';
import { callLLM } from '@/lib/llm-client';

export async function generateAIContent(platform: string, theme: string, keywords: string): Promise<string> {
  // 1. 业务逻辑：构建 Prompt 模板
  const systemPrompt = `你是一个${platform}平台的爆款文案专家，擅长捕捉用户情绪和平台流量密码。`;
  const userPrompt = `主题：${theme}\n关键词：${keywords}\n请为我生成一段具有吸引力的文案。`;

  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];

  // 2. 调用解耦后的客户端
  try {
    const content = await callLLM(messages);
    return content;
  } catch (error) {
    console.error("AI Service Error:", error);
    return "抱歉，生成文案时出错，请稍后再试。";
  }
}