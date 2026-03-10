import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AnalyzeRequest } from '../types'

interface AppState {
  // Selected symbol for analysis
  symbol: string
  setSymbol: (s: string) => void

  // Strategy config
  interval: string
  setInterval: (i: string) => void
  strategies: AnalyzeRequest['strategies']
  setStrategies: (s: AnalyzeRequest['strategies']) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      symbol: 'BTC-USDT',
      setSymbol: (symbol) => set({ symbol }),

      interval: '1H',
      setInterval: (interval) => set({ interval }),

      strategies: ['MA', 'RSI', 'MACD', 'VOLUME'],
      setStrategies: (strategies) => set({ strategies })
    }),
    {
      name: 'openclaw-app-store'
    }
  )
)
