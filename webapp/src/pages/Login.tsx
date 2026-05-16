import React from 'react'
import { supabase } from '../lib/supabase'

export default function Login() {
  const signIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'github' })
    if (error) alert(error.message)
  }

  return (
    <div className="p-6 bg-card rounded-xl border border-slate-800 max-w-md mx-auto mt-12">
      <h2 className="text-2xl font-bold mb-2">Sign in to APEX EA</h2>
      <p className="text-slate-400 mb-4">Use Supabase Auth to access your remote trading dashboard.</p>
      <button className="px-4 py-2 bg-emerald-400 text-black rounded" onClick={signIn}>Sign in with GitHub</button>
    </div>
  )
}
