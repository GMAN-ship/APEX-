import React from 'react'

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#071024] text-slate-100">
      <div className="max-w-6xl mx-auto p-4">
        {children}
      </div>
    </div>
  )
}
