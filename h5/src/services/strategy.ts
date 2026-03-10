import api from './api'
import type { StrategySignal, AnalyzeRequest, ApiResponse } from '../types'

export async function analyzeStrategy(
  req: AnalyzeRequest
): Promise<StrategySignal> {
  const res = await api.post<ApiResponse<StrategySignal>>(
    '/strategy/analyze',
    req
  )
  if (!res.data.data) throw new Error(res.data.message || 'Analysis failed')
  return res.data.data
}

export async function fetchSignals(interval = '1H'): Promise<StrategySignal[]> {
  const res = await api.get<ApiResponse<StrategySignal[]>>(
    '/strategy/signals',
    {
      params: { interval }
    }
  )
  return res.data.data || []
}
