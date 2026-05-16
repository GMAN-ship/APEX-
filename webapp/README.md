APEX EA — Frontend (Vite + React + Tailwind)

Quick start

1. Install dependencies:

```bash
cd webapp
npm install
```

2. Configure Supabase keys in `src/lib/supabase.ts`:
- `SUPABASE_URL` and `SUPABASE_ANON_KEY` for client app.

3. Run dev server:

```bash
npm run dev
```

Build

```bash
npm run build
```

Deploy Edge Function (store engine status / broker credentials)

1. Create a Supabase Edge Function named `store-engine-status` and upload `supabase/functions/store_broker/index.ts`.
2. In the function settings add environment variables:
   - `SUPABASE_URL` (your project URL)
   - `SUPABASE_SERVICE_ROLE_KEY` (service role key)
   - `BROKER_SECRET` (secret used to encrypt passwords via `pgp_sym_encrypt`)
3. Deploy the function and call it from the frontend at `/functions/v1/store-engine-status` with a POST body `{"broker_server":..., "account_id":..., "password":...}` and the user's Bearer token in `Authorization` header.

Apply Supabase schema

Use the Supabase SQL editor or CLI to run `supabase/schema.sql` in your project. Ensure `pgcrypto` extension is available (the SQL attempts to create it).

Android APK (Capacitor)

See `ANDROID_README.md` for steps to package the built web assets as an Android application using Capacitor and Android Studio.

Security notes

- The `engine_status` table stores `encrypted_password` as a base64-encoded PGP blob. Use the service role key and the `BROKER_SECRET` to encrypt/decrypt server-side only.
- RLS policies require `user_id = auth.uid()` for `trade_commands` inserts.

Next steps I can do for you:
- Harden token verification in the Edge Function.
- Create Supabase Edge Function to decrypt credentials for the MT5 bridge (service-role-only).
- Add CI workflow to build and produce an APK automatically.
