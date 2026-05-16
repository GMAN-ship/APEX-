import React, { useEffect, useState } from 'react'
import LogoGhost from './LogoGhost'
import { supabase } from '../lib/supabase'

function Heartbeat() {
  const [latency, setLatency] = useState<number | null>(null)
  const [live, setLive] = useState(false)

  useEffect(() => {
    let mounted = true
    const ping = async () => {
      const start = performance.now()
      try {
        await fetch('/')
        const ms = Math.round(performance.now() - start)
        if (mounted) {
          setLatency(ms)
          setLive(true)
        }
      } catch (e) {
        if (mounted) setLive(false)
      }
    }
    ping()
    const id = setInterval(ping, 5000)
    return () => { mounted = false; clearInterval(id) }
  }, [])

  return (
    <div className="flex items-center space-x-3 text-sm">
      <span className={`h-3 w-3 rounded-full ${live ? 'bg-emerald-400' : 'bg-red-500'} animate-pulse`}></span>
      <span className="text-amber-300">{latency ? `${latency} ms` : '—'}</span>
    </div>
  )
}

export default function Header() {
  return (
    <header className="flex items-center justify-between p-3 bg-card rounded-xl border border-slate-800">
      <div className="flex items-center space-x-3">
        <LogoGhost />
        <div>
          <div className="text-xl font-bold">Ghost-Master Terminal</div>
          <div className="text-xs text-slate-400">APEX EA • Remote Trading Dashboard</div>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Heartbeat />
        <div className="text-xs text-slate-400">v0.1</div>
      </div>
    </header>
  )
}
