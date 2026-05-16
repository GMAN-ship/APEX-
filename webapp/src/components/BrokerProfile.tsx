import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function BrokerProfile() {
  const [server, setServer] = useState('')
  const [accountId, setAccountId] = useState('')
  const [password, setPassword] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('engine_status').select('broker_server, account_id').eq('id', 1).single()
      if (data) {
        setServer(data.broker_server)
        setAccountId(data.account_id?.toString() || '')
      }
    }
    load()
  }, [])

  const save = async () => {
    setSaving(true)
    try {
      const session = await supabase.auth.getSession()
      const token = session.data?.session?.access_token
      const res = await fetch('/functions/v1/store-engine-status', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ broker_server: server, account_id: accountId, password }),
      })
      if (!res.ok) throw new Error(await res.text())
      alert('Broker profile saved securely via Edge Function')
    } catch (err: any) {
      alert('Failed to save broker profile: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-4 bg-card rounded-xl border border-slate-800">
      <h3 className="font-bold text-lg">Broker Connection Profile</h3>
      <div className="mt-3 grid grid-cols-1 gap-3">
        <input className="p-2 bg-slate-900 rounded" placeholder="Broker Server Name" value={server} onChange={e => setServer(e.target.value)} />
        <input className="p-2 bg-slate-900 rounded" placeholder="Account Login ID" value={accountId} onChange={e => setAccountId(e.target.value)} />
        <input type="password" className="p-2 bg-slate-900 rounded" placeholder="Master Password" value={password} onChange={e => setPassword(e.target.value)} />
        <div className="flex justify-end">
          <button className="px-4 py-2 bg-amber-400 text-black rounded" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
        </div>
      </div>
    </div>
  )
}
