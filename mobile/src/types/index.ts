export type AccountMetrics = {
  id: string;
  balance: number;
  equity: number;
  floating_pnl: number;
  margin_level: number;
  updated_at: string;
};

export type OpenPosition = {
  ticket: number;
  symbol: string;
  order_type: 'BUY' | 'SELL';
  lots: number;
  entry_price: number;
  current_price: number;
  pnl: number;
  stop_loss: number | null;
  take_profit: number | null;
  opened_at: string;
};

export type TradeCommandPayload = {
  command_type: 'BUY' | 'SELL' | 'CLOSE_ALL';
  symbol?: string;
  lots?: number;
  user_id: string;
};
