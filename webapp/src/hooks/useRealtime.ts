import { useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useRealtime(table: string, callback: (payload: any) => void) {
  useEffect(() => {
    const chan = supabase
      .channel(`realtime-${table}`)
      .on('postgres_changes', { event: '*', schema: 'public', table }, payload => callback(payload))
      .subscribe()

    return () => {
      supabase.removeChannel(chan)
    }
  }, [table, callback])
}
