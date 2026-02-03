import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json(
        { error: "cannot get user info" }, 
        { status: 401 }
    )
  }

  // Fetch generated contents for the user
  const { data, error } = await supabase.from('generated_contents').select('*').eq('user_id', user.id)
  if (error) {
    console.error("get Content Error:", error)
    return NextResponse.json({ error: '获取内容失败' }, { status: 500 })
  }
  console.log("Content retrieved successfully for user:", user.id)

  return NextResponse.json({ content: data })
}