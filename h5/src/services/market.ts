import api from './api'
import type { Ticker, Candle, ApiResponse } from '../types/index.ts'

export async function fetchTickers(symbols: string[] = []): Promise<Ticker[]> {
  const params = symbols.length ? { symbols: symbols.join(',') } : {}
  const res = await api.get<ApiResponse<Ticker[]>>('/market/tickers', {
    params
  })
  return res.data.data || []
}

export async function fetchTopMovers(limit = 10): Promise<Ticker[]> {
  const res = await api.get<ApiResponse<Ticker[]>>('/market/top-movers', {
    params: { limit }
  })
  return res.data.data || []
}

export async function fetchCandles(
  symbol: string,
  interval = '1H',
  limit = 100
): Promise<Candle[]> {
  const res = await api.get<ApiResponse<Candle[]>>(
    `/market/candles/${symbol}`,
    {
      params: { interval, limit }
    }
  )
  return res.data.data || []
}
