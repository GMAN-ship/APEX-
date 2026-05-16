import { serve } from 'std/server'

serve(async (req: Request) => {
  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const BROKER_SECRET = Deno.env.get('BROKER_SECRET')!

    const auth = req.headers.get('authorization') || ''
    if (!auth.startsWith('Bearer ')) return new Response('Missing auth', { status: 401 })
    const token = auth.split(' ')[1]

    const verify = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: SUPABASE_SERVICE_ROLE_KEY,
      },
    })

    if (!verify.ok) return new Response('Invalid user token', { status: 401 })
    const userInfo = await verify.json()
    if (!userInfo || !userInfo.id) return new Response('Unauthorized', { status: 401 })

    const body = await req.json()
    const { broker_server, account_id, password } = body
    if (!broker_server || !account_id || !password) return new Response('Invalid payload', { status: 400 })

    const rpcBody = { p_server: broker_server, p_account: account_id, p_password: password, p_secret: BROKER_SECRET }

    const resp = await fetch(`${SUPABASE_URL}/rest/v1/rpc/store_engine_status`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rpcBody),
    })

    if (!resp.ok) {
      const text = await resp.text()
      return new Response(text, { status: 500 })
    }

    return new Response('OK', { status: 200 })
  } catch (err) {
    return new Response((err as Error).message, { status: 500 })
  }
})
