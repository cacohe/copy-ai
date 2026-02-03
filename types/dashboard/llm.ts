// types/ai.ts

export type AI_API_FORMAT = 'openai' | 'gemini' | 'deepseek' | 'qwen';

export type MessageRole = 'system' | 'user' | 'assistant';

export interface ChatMessage {
  role: MessageRole;
  content: string;
}

export interface LLMConfig {
  provider: AI_API_FORMAT;
  model: string;
  temperature?: number;
  maxTokens?: number;
}

export interface GenerateParams {
  platform: string;
  theme: string;
  keywords: string;
  fingerprint?: string;
}

// 定义 LLM 返回的标准结构
export interface LLMResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  rawResponse?: any; // 备用，存储原始响应以便排查
}