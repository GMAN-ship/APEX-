import os
import time
from datetime import datetime

import MetaTrader5 as mt5
from supabase import create_client, Client

SUPABASE_URL = os.environ.get('SUPABASE_URL')
SUPABASE_KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

ACCOUNT_ID = int(os.environ.get('MT5_ACCOUNT', '0'))
SERVER = os.environ.get('MT5_SERVER')


def connect_mt5() -> bool:
    if not mt5.initialize():
        print(f"MT5 initialize failed: {mt5.last_error()}")
        return False
    authorized = mt5.login(ACCOUNT_ID, server=SERVER)
    if not authorized:
        print(f"MT5 login failed: {mt5.last_error()}")
        return False
    return True


def push_account_metrics():
    account_info = mt5.account_info()
    if account_info is None:
        print('Could not fetch account info')
        return

    positions = mt5.positions_get()
    open_positions = []
    if positions:
        for pos in positions:
            open_positions.append({
                'ticket': pos.ticket,
                'symbol': pos.symbol,
                'order_type': 'BUY' if pos.type == mt5.ORDER_TYPE_BUY else 'SELL',
                'lots': pos.volume,
                'entry_price': pos.price_open,
                'current_price': pos.price_current,
                'pnl': pos.profit,
                'stop_loss': pos.sl,
                'take_profit': pos.tp,
                'opened_at': datetime.fromtimestamp(pos.time_setup).isoformat(),
            })

    metrics_payload = {
        'balance': account_info.balance,
        'equity': account_info.equity,
        'floating_pnl': account_info.profit,
        'margin_level': account_info.margin_level,
    }

    response_metrics = supabase.table('account_metrics').insert(metrics_payload).execute()
    if response_metrics.error:
        print('Supabase account_metrics insert error:', response_metrics.error)
    else:
        print('Account metrics pushed at', datetime.utcnow().isoformat())

    # Replace stale open positions atomically for this demo integration.
    supabase.table('open_positions').delete().neq('ticket', 0).execute()
    response_positions = supabase.table('open_positions').insert(open_positions).execute()
    if response_positions.error:
        print('Supabase open_positions insert error:', response_positions.error)
    else:
        print('Open positions pushed at', datetime.utcnow().isoformat())


if __name__ == '__main__':
    if not connect_mt5():
        raise SystemExit('MT5 connection failed')

    while True:
        push_account_metrics()
        time.sleep(10)
