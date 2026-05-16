"""
Example MT5 bridge service for VPS.

- Polls `trade_commands` where processed = false
- Fetches `engine_status` and calls Postgres RPC `decrypt_broker_password` using SUPABASE_SERVICE_ROLE_KEY and BROKER_SECRET to obtain plaintext password
- (Dry-run) prints the action or simulates MT5 order execution
- Marks commands as processed and logs to `trade_actions`

Environment variables required:
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- BROKER_SECRET
- (optional) DRY_RUN=true

Run:
  pip install -r integration/requirements.txt
  python integration/mt5_bridge_example.py

Note: Replace dry-run sections with real MetaTrader5 API calls on the VPS where MT5 is available.
"""

import os
import time
import requests
from typing import Any, Dict

SUPABASE_URL = os.environ.get('SUPABASE_URL')
SERVICE_KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
BROKER_SECRET = os.environ.get('BROKER_SECRET')
DRY_RUN = os.environ.get('DRY_RUN', '1') == '1'
POLL_INTERVAL = int(os.environ.get('POLL_INTERVAL', '5'))

HEADERS = {
    'apikey': SERVICE_KEY,
    'Content-Type': 'application/json',
}

if not SUPABASE_URL or not SERVICE_KEY or not BROKER_SECRET:
    raise SystemExit('Missing SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY or BROKER_SECRET')


def rpc_decrypt(encrypted_base64: str) -> str:
    url = f"{SUPABASE_URL}/rest/v1/rpc/decrypt_broker_password"
    payload = {"p_encrypted_base64": encrypted_base64, "p_secret": BROKER_SECRET}
    r = requests.post(url, headers=HEADERS, json=payload)
    r.raise_for_status()
    # RPC returns plaintext body
    return r.json()


def get_broker_credentials() -> Dict[str, Any]:
    url = f"{SUPABASE_URL}/rest/v1/engine_status?select=*"
    r = requests.get(url, headers=HEADERS)
    r.raise_for_status()
    data = r.json()
    if not data:
        raise SystemExit('No engine status row found')
    # Use the first row
    return data[0]


def fetch_pending_commands():
    url = f"{SUPABASE_URL}/rest/v1/trade_commands?processed=eq.false&order=created_at.asc"
    r = requests.get(url, headers=HEADERS)
    r.raise_for_status()
    return r.json()


def mark_command_processed(command_id: str):
    url = f"{SUPABASE_URL}/rest/v1/trade_commands?id=eq.{command_id}"
    payload = {"processed": True}
    r = requests.patch(url, headers=HEADERS, json=payload)
    r.raise_for_status()


def insert_trade_action(action: Dict[str, Any]):
    url = f"{SUPABASE_URL}/rest/v1/trade_actions"
    r = requests.post(url, headers=HEADERS, json=action)
    r.raise_for_status()


def handle_command(cmd: Dict[str, Any], creds: Dict[str, Any]):
    # Decrypt password
    encrypted = creds['encrypted_password']
    try:
        plaintext = rpc_decrypt(encrypted)
    except Exception as e:
        print('Failed to decrypt broker password:', e)
        return

    account_id = creds['account_id']
    server = creds['server_name']
    print(f'Using broker {server} account {account_id} with decrypted password (len={len(str(plaintext))})')

    command = cmd.get('command_type')
    symbol = cmd.get('symbol')
    volume = cmd.get('lots')
    target_position_id = cmd.get('target_position_id')

    # Replace with actual MT5 API calls on the VPS
    if DRY_RUN:
        print(f"DRY RUN: would execute {command} symbol={symbol} volume={volume} target_position_id={target_position_id}")
    else:
        # Example: execute via MetaTrader5 Python package
        import MetaTrader5 as mt5
        # Initialize and login logic here using account_id and plaintext
        # ...
        pass

    # Log action (example minimal fields)
    action = {
        'ticket': None,
        'symbol': symbol,
        'direction': command if command in ('BUY', 'SELL') else 'CLOSE',
        'volume': volume or 0,
        'profit': 0,
    }
    insert_trade_action(action)


def main_loop():
    creds = get_broker_credentials()
    print('Loaded broker credentials for', creds['server_name'])

    while True:
        try:
            cmds = fetch_pending_commands()
            if cmds:
                for c in cmds:
                    print('Processing command', c['id'], c)
                    handle_command(c, creds)
                    mark_command_processed(c['id'])
            time.sleep(POLL_INTERVAL)
        except Exception as e:
            print('Bridge error:', e)
            time.sleep(5)


if __name__ == '__main__':
    main_loop()
