// components/Header.tsx
'use client'

import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

export default function Header() {
  const { user, loading, signOut } = useAuth()

  // 骨架屏状态
  if (loading) {
    return (
      <header className="border-b p-4">
        <div className="animate-pulse h-10 w-32 bg-gray-200 rounded" />
      </header>
    )
  }

  return (
    <header className="border-b p-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">MyApp</Link>
      
      {user ? (
        <div className="flex items-center gap-4">
          <span>欢迎回来,{user.email}</span>
          <button 
            onClick={signOut}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            退出登录
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Link href="/login" className="px-4 py-2 border rounded">
            登录
          </Link>
          <Link href="/signup" className="px-4 py-2 bg-blue-500 text-white rounded">
            注册
          </Link>
        </div>
      )}
    </header>
  )
}