// ─── Shared API Types (mirrors server types) ───────────────────────────────

export interface Ticker {
  symbol: string
  last: number
  open24h: number
  high24h: number
  low24h: number
  vol24h: number
  volCcy24h: number
  change24h: number
  changePct24h: number
  ts: number
}

export interface Candle {
  ts: number
  open: number
  high: number
  low: number
  close: number
  vol: number
  volCcy: number
}

export type SignalType = 'BUY' | 'SELL' | 'HOLD'

export interface IndicatorResult {
  name: string
  value: number | string
  signal: SignalType
  description: string
}

export interface StrategySignal {
  symbol: string
  interval: string
  signal: SignalType
  confidence: number
  price: number
  indicators: IndicatorResult[]
  reasons: string[]
  ts: number
}

export interface AnalyzeRequest {
  symbol: string
  interval: string
  strategies: ('MA' | 'RSI' | 'MACD' | 'VOLUME')[]
}

export interface ApiResponse<T> {
  code: number
  data?: T
  message?: string
}
