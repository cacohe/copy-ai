import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { createClient } from '@/lib/supabase/server';


interface LoginRequest {
  email: string;
  password: string;
}

// 验证用户凭证
async function verifyCredentials(email: string, password: string): Promise<{ valid: boolean; userId?: string }> {
    const supabase = await createClient()
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password,
    });
    if (authError) {
        console.error('Login error:', authError)
        return { valid: false };
    }
    console.log('Login success:', authData)
    return { valid: true, userId: authData.user.id };
}

// 生成 JWT Token
function generateAuthToken(userId: string, email: string): string {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }

  return jwt.sign(
    {
      userId,
      email,
      iat: Math.floor(Date.now() / 1000),
    },
    secret,
    {
      expiresIn: '7d', // Token 7天后过期
      issuer: 'your-app-name',
    }
  );
}

// 登录 API
export async function POST(request: NextRequest) {
  try {
    // 1. 解析并验证请求体
    let body: LoginRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: '请求格式错误' },
        { status: 400 }
      );
    }

    const { email, password } = body;

    // 2. 输入验证
    if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, message: '邮箱和密码不能为空' },
        { status: 400 }
      );
    }

    // 3. 邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { success: false, message: '邮箱格式不正确' },
        { status: 400 }
      );
    }

    // 4. 密码长度验证
    if (password.length < 6 || password.length > 100) {
      return NextResponse.json(
        { success: false, message: '密码长度必须在6-100位之间' },
        { status: 400 }
      );
    }

    // 6. 验证用户凭证
    const { valid, userId } = await verifyCredentials(email.trim().toLowerCase(), password);
    
    if (!valid || !userId) {
      // 统一的错误消息，避免泄露用户是否存在
      return NextResponse.json(
        { success: false, message: '邮箱或密码错误' },
        { status: 401 }
      );
    }

    // 7. 生成认证 Token
    const token = generateAuthToken(userId, email);

    // 8. 设置 HTTP-only Cookie
    const cookieStore = await cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true, // 防止 XSS 攻击
      secure: process.env.NODE_ENV === 'production', // 仅在 HTTPS 下传输
      sameSite: 'lax', // 防止 CSRF 攻击
      maxAge: 60 * 60 * 24 * 7, // 7天
      path: '/',
    });

    // 9. 记录登录日志（可选）
    // await prisma.loginLog.create({
    //   data: {
    //     userId,
    //     ipAddress: request.ip || 'unknown',
    //     userAgent: request.headers.get('user-agent') || 'unknown',
    //     success: true,
    //   }
    // });

    // 10. 返回成功响应
    return NextResponse.json(
      {
        success: true,
        message: '登录成功',
        user: {
          email: email.trim().toLowerCase(),
          // 可以添加其他非敏感信息
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Login error:', error);
    
    // 不要向客户端暴露详细错误信息
    return NextResponse.json(
      { success: false, message: '服务器错误，请稍后重试' },
      { status: 500 }
    );
  }
}