// types/business.ts

export interface UserProfile {
  id: string;
  email: string;
  tier: 'free' | 'pro' | 'vip';
  createdAt: string;
}

export interface GenerationHistory {
  id: string;
  userId?: string;
  fingerprint?: string;
  platform: string;
  theme: string;
  content: string;
  createdAt: string;
}

// 额度检查的返回结构
export interface UsageCheck {
  isAllowed: boolean;
  reason?: 'limit_reached' | 'sensitive_content' | 'unauthorized';
  remainingCount: number;
}