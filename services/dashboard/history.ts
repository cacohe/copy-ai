// import { createClient } from '@/lib/supabase/server'
// import { HistoryItem } from '@/types/dashboard/history'

// export async function getUserHistory(): Promise<HistoryItem[] | { error: string }> {
//   const supabase = await createClient()

//   // 1. 先获取当前登录用户的 ID (生产环境必须步骤)
//   const { data: { user } } = await supabase.auth.getUser()
//   if (!user) return { error: '未授权访问' }

//   // 2. 执行查询
//   const { data, error } = await supabase
//     .from('generations')               // 指定表名
//     .select('id, content, platform, created_at') // 建议只选需要的列，提高性能
//     .eq('user_id', user.id).filter('is_deleted', 'eq', false) // 过滤条件：user_id 等于当前用户 ID 且未被删除
//     .order('created_at', { ascending: false }) // 按时间倒序排列（最新的在前面）
//     .limit(20)                         // 分页：先取前 20 条

//   if (error) {
//     console.error('获取历史记录失败:', error.message)
//     return { error: '数据读取失败' }
//   }

//   return data
// }