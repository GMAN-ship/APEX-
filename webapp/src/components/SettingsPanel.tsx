import React from 'react'

export default function SettingsPanel() {
  return (
    <section className="bg-slate-900 p-4 rounded-md">
      <h3 className="text-lg font-semibold text-sky-300">App Settings</h3>
      <div className="mt-3 space-y-3 text-slate-300">
        <div>
          <label className="block text-sm">Supabase URL</label>
          <input className="w-full mt-1 p-2 rounded bg-slate-800" placeholder="https://..." />
        </div>
        <div>
          <label className="block text-sm">Supabase Public Key</label>
          <input className="w-full mt-1 p-2 rounded bg-slate-800" placeholder="public-anon-key" />
        </div>
      </div>
    </section>
  )
}
