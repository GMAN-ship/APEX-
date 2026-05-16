# APEX- Mobile Trading Dashboard

A mobile dashboard for MetaTrader 5 remote trade control using Supabase as the real-time backend.

This project contains:

- `mobile/`: Expo React Native app with a dark financial dashboard, trade controls, and settings.
- `supabase/`: Recommended Supabase schema and security policies.
- `integration/`: Example Python + MQL5 integration patterns to sync MT5 account status and execute commands.

## Goals

- Display live account metrics from MT5 via Supabase realtime.
- Send manual trade commands to `trade_commands`.
- Allow remote configuration of risk, stop-loss padding, and take-profit targets.
- Show connection status and offline indicators.

## Quick start

1. Install dependencies in `mobile/`:
   ```bash
   cd /workspaces/APEX-/mobile
   npm install
   ```
2. Create a Supabase project and enable Realtime.
3. Apply the schema in `supabase/schema.sql`.
4. Add Supabase environment values in `mobile/src/lib/supabase.ts` or use a secure env manager.
5. Run locally with Expo:
   ```bash
   npm start
   ```

## Supabase tables

- `engine_status`
- `account_metrics`
- `open_positions`
- `trade_commands`
- `trade_actions`

## Integration guidance

The `integration/` folder includes example code for:

- synchronizing MT5 account metrics to Supabase (`mt5_supabase.py`)
- bridging MQL5 to Python or database updates (`mql5_signal_bridge.mq5`)
