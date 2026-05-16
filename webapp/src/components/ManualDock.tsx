import React, { useState } from 'react'
import { supabase } from '../lib/supabase'

const SYMBOLS = ['EURUSD', 'GBPUSD', 'XAUUSD']

export default function ManualDock() {
  const [symbol, setSymbol] = useState(SYMBOLS[0])
  const [lots, setLots] = useState('0.1')
  const [userId, setUserId] = useState<string | null>(null)

  const exec = async (cmd: 'BUY' | 'SELL') => {
    const u = await supabase.auth.getUser()
    const uid = (u.data?.user?.id) ?? null
    await supabase.from('trade_commands').insert({ command_type: cmd, symbol, lots: parseFloat(lots), user_id: uid })
  }

  return (
    <div className="p-4 bg-card rounded-xl border border-slate-800">
      <div className="flex items-center space-x-3">
        <select value={symbol} onChange={e => setSymbol(e.target.value)} className="bg-slate-900 text-white p-2 rounded">
          {SYMBOLS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <input className="bg-slate-900 text-white p-2 rounded w-24" value={lots} onChange={e => setLots(e.target.value)} />
        <button className="px-4 py-2 bg-emerald-400 text-black rounded font-semibold" onClick={() => exec('BUY')}>MANUAL BUY</button>
        <button className="px-4 py-2 bg-crim text-white rounded font-semibold" onClick={() => exec('SELL')}>MANUAL SELL</button>
      </div>
    </div>
  )
}
