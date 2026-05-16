import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Sparkline from './Sparkline'

export default function DashboardCards() {
  const [status, setStatus] = useState<any>(null)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('account_metrics').select('*').order('updated_at', { ascending: false }).limit(1).single()
      setStatus(data)
    }
    load()
    const chan = supabase
      .channel('account-metrics')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'account_metrics' }, payload => setStatus(payload.new))
      .subscribe()
    return () => supabase.removeChannel(chan)
  }, [])

  const equitySeries = status?.equity_history ?? [0,1,2,3]

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="p-4 bg-card rounded-xl border border-slate-800">
        <div className="text-sm text-slate-400">Balance</div>
        <div className="text-2xl font-bold">${status?.balance?.toFixed(2) ?? '--'}</div>
        <div className="mt-2"><Sparkline points={equitySeries} /></div>
      </div>

      <div className="p-4 bg-card rounded-xl border border-slate-800">
        <div className="text-sm text-slate-400">Equity</div>
        <div className="text-2xl font-bold">${status?.equity?.toFixed(2) ?? '--'}</div>
        <div className="mt-2"><Sparkline points={equitySeries} /></div>
      </div>

      <div className="p-4 bg-card rounded-xl border border-slate-800">
        <div className="text-sm text-slate-400">Floating P&L</div>
        <div className={`text-2xl font-bold ${status?.floating_pnl >= 0 ? 'text-emerald-400' : 'text-crim'}`}>${status?.floating_pnl?.toFixed(2) ?? '--'}</div>
      </div>

      <div className="p-4 bg-card rounded-xl border border-slate-800">
        <div className="text-sm text-slate-400">Margin Level</div>
        <div className={`text-2xl font-bold ${status?.margin_level < 300 ? 'text-amber-400' : 'text-emerald-400'}`}>{status?.margin_level ? `${status.margin_level}%` : '--'}</div>
      </div>
    </div>
  )
}
