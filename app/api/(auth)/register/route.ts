// app/api/register/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';


// 注册 API
export async function POST(request: NextRequest) {
  console.log('Register API called');
  const supabase = await createClient()
  const { email, password, name } = await request.json();
  
  const { error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }

  console.log('Register success! ');
  return NextResponse.json({
    success: true,
    message: '注册成功'
  });
}