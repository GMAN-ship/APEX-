import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function MasterToggle() {
  const [active, setActive] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase.from('engine_status').select('*').eq('id', 1).single()
      if (!error && data) setActive(data.is_engine_active)
    }
    load()
    const chan = supabase
      .channel('engine-status')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'engine_status' }, payload => setActive(payload.new?.is_engine_active))
      .subscribe()
    return () => supabase.removeChannel(chan)
  }, [])

  const toggle = async (v: boolean) => {
    setLoading(true)
    const u = await supabase.auth.getUser()
    const uid = (u.data?.user?.id) ?? null
    const { error } = await supabase.from('engine_status').upsert({ id: 1, is_engine_active: v, updated_by: uid }, { onConflict: 'id' })
    setLoading(false)
    if (!error) setActive(v)
  }

  return (
    <div className="p-4 bg-card rounded-xl border border-slate-800 flex items-center justify-between">
      <div>
        <div className="text-lg font-bold">Master Automation</div>
        <div className="text-sm text-slate-400">Control the remote EA's global execution state</div>
      </div>
      <div className="flex items-center space-x-3">
        <button className="px-6 py-3 rounded-lg font-semibold text-black bg-emerald-400 shadow-lg" onClick={() => toggle(true)} disabled={loading}>
          START AUTOMATION
        </button>
        <button className="px-6 py-3 rounded-lg font-semibold text-white bg-red-600 shadow-inner" onClick={() => toggle(false)} disabled={loading}>
          STOP AUTOMATION
        </button>
      </div>
    </div>
  )
}
