import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function TradesList() {
  const [trades, setTrades] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('open_positions').select('*').order('updated_at', { ascending: false })
      if (data) setTrades(data)
    }
    load()
    const chan = supabase
      .channel('open-positions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'open_positions' }, payload => {
        setTrades(current => {
          if (!payload.new) return current
          const updated = current.filter(t => t.ticket !== payload.new.ticket)
          return [payload.new, ...updated]
        })
      })
      .subscribe()
    return () => supabase.removeChannel(chan)
  }, [])

  const closePosition = async (ticket: number) => {
    const u = await supabase.auth.getUser()
    const uid = (u.data?.user?.id) ?? null
    await supabase.from('trade_commands').insert({ command_type: 'CLOSE_ID', target_position_id: ticket.toString(), user_id: uid })
  }

  const closeAll = async () => {
    const u = await supabase.auth.getUser()
    const uid = (u.data?.user?.id) ?? null
    await supabase.from('trade_commands').insert({ command_type: 'CLOSE_ALL', user_id: uid })
  }

  return (
    <div className="p-4 bg-card rounded-xl border border-slate-800">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">Active Trades</h3>
        <button className="text-sm text-white bg-red-600 px-3 py-2 rounded" onClick={closeAll}>CLOSE ALL ACTIVE POSITIONS</button>
      </div>
      <div className="mt-4 space-y-3">
        {trades.length === 0 && <div className="text-slate-400">No open positions</div>}
        {trades.map((t: any) => (
          <div key={t.ticket} className="p-3 bg-slate-900 rounded flex justify-between items-center">
            <div>
              <div className="font-semibold">{t.symbol} <span className="text-sm text-slate-400">{t.order_type}</span></div>
              <div className="text-sm text-slate-400">Entry {t.entry_price?.toFixed(5)} • Lots {t.lots}</div>
              <div className="text-sm text-slate-400">Current {t.current_price?.toFixed(5)}</div>
            </div>
            <div className="text-right">
              <div className={`font-bold ${t.pnl >= 0 ? 'text-emerald-400' : 'text-crim'}`}>${t.pnl?.toFixed(2)}</div>
              <button className="mt-2 text-xs text-white bg-red-500 px-2 py-1 rounded" onClick={() => closePosition(t.ticket)}>X</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
