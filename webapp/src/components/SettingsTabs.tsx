import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function SettingsTabs() {
  const [active, setActive] = useState('risk')
  const [settings, setSettings] = useState<any>({})

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('strategy_settings').select('*').single()
      setSettings(data || {})
    }
    load()
  }, [])

  const save = async () => {
    await supabase.from('strategy_settings').upsert({ id: 1, ...settings }, { onConflict: 'id' })
    alert('Saved')
  }

  return (
    <div className="p-4 bg-card rounded-xl border border-slate-800">
      <div className="flex space-x-4">
        <button onClick={() => setActive('risk')} className={`px-3 py-2 rounded ${active==='risk' ? 'bg-slate-800' : ''}`}>Risk Management</button>
        <button onClick={() => setActive('msf')} className={`px-3 py-2 rounded ${active==='msf' ? 'bg-slate-800' : ''}`}>Market Filters</button>
        <button onClick={() => setActive('time')} className={`px-3 py-2 rounded ${active==='time' ? 'bg-slate-800' : ''}`}>Time Filters</button>
      </div>

      <div className="mt-4">
        {active === 'risk' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-400">Max Daily Drawdown %</label>
              <input className="w-full p-2 bg-slate-900 rounded" value={settings.max_drawdown || ''} onChange={e => setSettings({...settings, max_drawdown: e.target.value})} />
            </div>
            <div>
              <label className="text-sm text-slate-400">Risk Per Trade %</label>
              <input className="w-full p-2 bg-slate-900 rounded" value={settings.risk_per_trade || ''} onChange={e => setSettings({...settings, risk_per_trade: e.target.value})} />
            </div>
            <div>
              <label className="text-sm text-slate-400">Max Open Positions</label>
              <input className="w-full p-2 bg-slate-900 rounded" value={settings.max_open || ''} onChange={e => setSettings({...settings, max_open: e.target.value})} />
            </div>
            <div>
              <label className="text-sm text-slate-400">Smart Breakeven</label>
              <select className="w-full p-2 bg-slate-900 rounded" value={settings.smart_breakeven ? '1' : '0'} onChange={e => setSettings({...settings, smart_breakeven: e.target.value==='1'})}>
                <option value="1">True</option>
                <option value="0">False</option>
              </select>
            </div>
          </div>
        )}

        {active === 'msf' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-400">Min FVG (points)</label>
              <input className="w-full p-2 bg-slate-900 rounded" value={settings.min_fvg || ''} onChange={e => setSettings({...settings, min_fvg: e.target.value})} />
            </div>
            <div>
              <label className="text-sm text-slate-400">Order Block Depth</label>
              <input className="w-full p-2 bg-slate-900 rounded" value={settings.ob_depth || ''} onChange={e => setSettings({...settings, ob_depth: e.target.value})} />
            </div>
            <div>
              <label className="text-sm text-slate-400">Liquidity Sweep TF</label>
              <select className="w-full p-2 bg-slate-900 rounded" value={settings.ls_tf || 'M15'} onChange={e => setSettings({...settings, ls_tf: e.target.value})}>
                <option>M15</option>
                <option>H1</option>
                <option>H4</option>
              </select>
            </div>
          </div>
        )}

        {active === 'time' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-400">Start (HH:MM)</label>
              <input className="w-full p-2 bg-slate-900 rounded" value={settings.start_time || ''} onChange={e => setSettings({...settings, start_time: e.target.value})} />
            </div>
            <div>
              <label className="text-sm text-slate-400">End (HH:MM)</label>
              <input className="w-full p-2 bg-slate-900 rounded" value={settings.end_time || ''} onChange={e => setSettings({...settings, end_time: e.target.value})} />
            </div>
            <div>
              <label className="text-sm text-slate-400">Avoid News</label>
              <select className="w-full p-2 bg-slate-900 rounded" value={settings.avoid_news ? '1' : '0'} onChange={e => setSettings({...settings, avoid_news: e.target.value==='1'})}>
                <option value="1">True</option>
                <option value="0">False</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-end">
        <button className="px-4 py-2 bg-amber-400 text-black rounded font-semibold" onClick={save}>Save Settings</button>
      </div>
    </div>
  )
}
