# MT5 Integration Notes

This folder contains example integration patterns for synchronizing your MetaTrader 5 terminal with Supabase.

## `mt5_supabase.py`

- Connects to MT5 with the official Python API.
- Reads account balance, equity, open positions, and floating profit.
- Pushes `account_metrics` and `open_positions` records into Supabase.

## `mql5_signal_bridge.mq5`

- Skeleton file for an Expert Advisor or signal bridge.
- In production, use a Python service to read `trade_commands` and execute them in MT5.
- The mobile app writes commands into `trade_commands`, and the EA or bridge monitors that table.

## Recommended flow

1. MT5/Python service updates `account_metrics` and `open_positions` every few seconds.
2. Mobile app subscribes to `account_metrics` and `open_positions` realtime updates.
3. Mobile app writes commands to `trade_commands`.
4. MT5 Expert Advisor or bridge polls `trade_commands` and executes orders.
5. Optionally log executions in `trade_actions`.
