Store Engine Status Edge Function

This Edge Function receives JSON with { broker_server, account_id, password } and uses the Supabase service role key (configured as env var `SUPABASE_SERVICE_ROLE_KEY`) along with a secret `BROKER_SECRET` to call the Postgres RPC `store_engine_status` which encrypts and stores the broker credentials into the `engine_status` table.

Security notes:
- Deploy this function in Supabase Edge Functions and set `SUPABASE_SERVICE_ROLE_KEY` and `BROKER_SECRET` as environment variables.
- The function verifies the incoming user's JWT against Supabase Auth to ensure only authenticated users may call it.
- The actual encryption is performed by the Postgres RPC `store_engine_status` defined in `supabase/schema.sql`.

Example deployment steps:
1. Deploy `store-engine-status` to Supabase Edge Functions.
2. Set env vars: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `BROKER_SECRET` in the function settings.
3. Call the function from the frontend at `/functions/v1/store-engine-status` with the user's bearer token.

Response codes:
- 200: OK
- 401: Unauthorized
- 500: Internal error
