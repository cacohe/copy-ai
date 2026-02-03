// lib/llm-client.test.ts
import { callLLM } from './llm-client';
import { ChatMessage } from '@/types/dashboard/llm';

// Mock the fetch function
global.fetch = jest.fn();

describe('callLLM', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset environment variables before each test
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  // --- Configuration Tests ---
  describe('Configuration Validation', () => {
    it('should throw error when AI_API_KEY is missing', async () => {
      process.env.AI_API_ENDPOINT = 'https://api.example.com';
      process.env.AI_MODEL_NAME = 'gpt-4';
      delete process.env.AI_API_KEY;

      const messages: ChatMessage[] = [{ role: 'user', content: 'Hello' }];

      await expect(callLLM(messages)).rejects.toThrow('AI 配置缺失');
    });

    it('should throw error when AI_API_ENDPOINT is missing', async () => {
      process.env.AI_API_KEY = 'test-key';
      process.env.AI_MODEL_NAME = 'gpt-4';
      delete process.env.AI_API_ENDPOINT;

      const messages: ChatMessage[] = [{ role: 'user', content: 'Hello' }];

      await expect(callLLM(messages)).rejects.toThrow('AI 配置缺失');
    });

    it('should throw error when AI_MODEL_NAME is missing', async () => {
      process.env.AI_API_KEY = 'test-key';
      process.env.AI_API_ENDPOINT = 'https://api.example.com';
      delete process.env.AI_MODEL_NAME;

      const messages: ChatMessage[] = [{ role: 'user', content: 'Hello' }];

      await expect(callLLM(messages)).rejects.toThrow('AI 配置缺失');
    });
  });

  // --- OpenAI Provider Tests ---
  describe('OpenAI Provider', () => {
    beforeEach(() => {
      process.env.AI_API_FORMAT = 'openai';
      process.env.AI_API_KEY = 'sk-test-key';
      process.env.AI_API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
      process.env.AI_MODEL_NAME = 'gpt-4';
    });

    it('should successfully call OpenAI API with correct headers and body', async () => {
      const messages: ChatMessage[] = [
        { role: 'system', content: 'You are a helpful assistant' },
        { role: 'user', content: 'Hello!' }
      ];

      const mockResponse = {
        choices: [
          {
            message: {
              content: 'Hi there! How can I help you?'
            }
          }
        ]
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await callLLM(messages);

      expect(fetch).toHaveBeenCalledWith(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer sk-test-key',
          },
          body: JSON.stringify({
            model: 'gpt-4',
            messages: messages,
            temperature: 0.7,
          }),
        }
      );

      expect(result).toBe('Hi there! How can I help you?');
    });

    it('should handle API error responses', async () => {
      const messages: ChatMessage[] = [{ role: 'user', content: 'Hello' }];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: 'Unauthorized',
        json: async () => ({ error: 'Invalid API key' }),
      });

      await expect(callLLM(messages)).rejects.toThrow('AI 服务异常: Unauthorized');
    });

    it('should handle malformed API response', async () => {
      const messages: ChatMessage[] = [{ role: 'user', content: 'Hello' }];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ unexpected: 'structure' }),
      });

      await expect(callLLM(messages)).rejects.toThrow('解析 AI 回复失败，请检查模型配置');
    });

    it('should default to openai when AI_API_FORMAT is not set', async () => {
      delete process.env.AI_API_FORMAT;

      const messages: ChatMessage[] = [{ role: 'user', content: 'Test' }];

      const mockResponse = {
        choices: [{ message: { content: 'Response' } }]
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await callLLM(messages);

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer sk-test-key',
          }),
        })
      );
    });
  });

  // --- Gemini Provider Tests ---
  describe('Gemini Provider', () => {
    beforeEach(() => {
      process.env.AI_API_FORMAT = 'gemini';
      process.env.AI_API_KEY = 'gemini-test-key';
      process.env.AI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent';
      process.env.AI_MODEL_NAME = 'gemini-pro';
    });

    it('should successfully call Gemini API with correct format', async () => {
      const messages: ChatMessage[] = [
        { role: 'system', content: 'You are helpful' },
        { role: 'user', content: 'Hello!' },
        { role: 'assistant', content: 'Hi!' },
        { role: 'user', content: 'How are you?' }
      ];

      const mockResponse = {
        candidates: [
          {
            content: {
              parts: [{ text: 'I am doing well, thank you!' }]
            }
          }
        ]
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await callLLM(messages);

      expect(fetch).toHaveBeenCalledWith(
        'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=gemini-test-key',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              { role: 'user', parts: [{ text: 'Hello!' }] },
              { role: 'model', parts: [{ text: 'Hi!' }] },
              { role: 'user', parts: [{ text: 'How are you?' }] }
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 2000,
            }
          }),
        }
      );

      expect(result).toBe('I am doing well, thank you!');
    });

    it('should filter out system messages for Gemini', async () => {
      const messages: ChatMessage[] = [
        { role: 'system', content: 'System prompt' },
        { role: 'user', content: 'User message' }
      ];

      const mockResponse = {
        candidates: [
          {
            content: {
              parts: [{ text: 'Response' }]
            }
          }
        ]
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await callLLM(messages);

      const callBody = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      
      expect(callBody.contents).toHaveLength(1);
      expect(callBody.contents[0].parts[0].text).toBe('User message');
    });

    it('should map assistant role to model for Gemini', async () => {
      const messages: ChatMessage[] = [
        { role: 'assistant', content: 'Assistant message' }
      ];

      const mockResponse = {
        candidates: [
          {
            content: {
              parts: [{ text: 'Response' }]
            }
          }
        ]
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await callLLM(messages);

      const callBody = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      
      expect(callBody.contents[0].role).toBe('model');
    });

    it('should handle Gemini API error responses', async () => {
      const messages: ChatMessage[] = [{ role: 'user', content: 'Hello' }];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: 'Bad Request',
        json: async () => ({ error: { message: 'Invalid request' } }),
      });

      await expect(callLLM(messages)).rejects.toThrow('AI 服务异常: Bad Request');
    });

    it('should handle malformed Gemini response', async () => {
      const messages: ChatMessage[] = [{ role: 'user', content: 'Hello' }];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ candidates: [] }),
      });

      await expect(callLLM(messages)).rejects.toThrow('解析 AI 回复失败，请检查模型配置');
    });
  });

  // --- Network Error Tests ---
  describe('Network Errors', () => {
    beforeEach(() => {
      process.env.AI_API_FORMAT = 'openai';
      process.env.AI_API_KEY = 'test-key';
      process.env.AI_API_ENDPOINT = 'https://api.example.com';
      process.env.AI_MODEL_NAME = 'gpt-4';
    });

    it('should handle network failures', async () => {
      const messages: ChatMessage[] = [{ role: 'user', content: 'Hello' }];

      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(callLLM(messages)).rejects.toThrow('Network error');
    });

    it('should handle non-JSON error responses', async () => {
      const messages: ChatMessage[] = [{ role: 'user', content: 'Hello' }];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: 'Internal Server Error',
        json: async () => { throw new Error('Not JSON'); },
      });

      await expect(callLLM(messages)).rejects.toThrow('AI 服务异常: Internal Server Error');
    });
  });

  // --- Edge Cases ---
  describe('Edge Cases', () => {
    beforeEach(() => {
      process.env.AI_API_FORMAT = 'openai';
      process.env.AI_API_KEY = 'test-key';
      process.env.AI_API_ENDPOINT = 'https://api.example.com';
      process.env.AI_MODEL_NAME = 'gpt-4';
    });

    it('should handle empty messages array', async () => {
      const messages: ChatMessage[] = [];

      const mockResponse = {
        choices: [{ message: { content: 'Empty response' } }]
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await callLLM(messages);

      expect(result).toBe('Empty response');
    });

    it('should handle very long message content', async () => {
      const longContent = 'a'.repeat(10000);
      const messages: ChatMessage[] = [{ role: 'user', content: longContent }];

      const mockResponse = {
        choices: [{ message: { content: 'Response' } }]
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await callLLM(messages);

      const callBody = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(callBody.messages[0].content).toBe(longContent);
    });

    it('should handle empty string responses from API', async () => {
      const messages: ChatMessage[] = [{ role: 'user', content: 'Hello' }];

      const mockResponse = {
        choices: [{ message: { content: '' } }]
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await callLLM(messages);

      expect(result).toBe('');
    });
  });
});