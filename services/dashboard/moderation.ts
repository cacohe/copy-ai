import 'server-only'

export async function checkContentSafe(text: string): Promise<boolean> {
  // 这里接入百度或腾讯云 API
  // 演示逻辑：简单判断是否包含敏感词
  const forbiddenWords = ['敏感词1', '敏感词2'];
  return !forbiddenWords.some(word => text.includes(word));
}

// services/moderation.ts
import 'server-only';
import { UsageCheck } from '@/types/business';

// 1. 本地敏感词库（MVP 阶段可以先写死，后续存入数据库或 Redis）
const FORBIDDEN_WORDS = ['翻墙', '代考', '枪支', '色情']; 

export async function validateContent(text: string): Promise<UsageCheck> {
  // A. 本地匹配逻辑
  const hasLocalMatch = FORBIDDEN_WORDS.some(word => text.includes(word));
  
  if (hasLocalMatch) {
    return {
      isAllowed: false,
      reason: 'sensitive_content',
      remainingCount: 0 // 违规时不返回剩余次数或按需处理
    };
  }

  // B. 调用云端审核 (示例：OpenAI Moderation)
  // 这种审核通常是免费或极低成本的
  try {
    const response = await fetch('https://api.openai.com/v1/moderations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.AI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input: text }),
    });

    const data = await response.json();
    const [result] = data.results;

    if (result.flagged) {
      return {
        isAllowed: false,
        reason: 'sensitive_content',
        remainingCount: 0
      };
    }
  } catch (error) {
    console.error("Moderation API Error:", error);
    // 如果审核接口挂了，生产环境下建议“宁可错杀不要放过”或者降级处理
  }

  return {
    isAllowed: true,
    remainingCount: 0 // 这个值将在 API 路由中动态计算
  };
}