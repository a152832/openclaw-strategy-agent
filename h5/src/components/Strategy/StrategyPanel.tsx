import React, { useState } from 'react'
import { useAppStore } from '../../store/useAppStore'
import type { AnalyzeRequest } from '../../types'

const STRATEGY_OPTIONS: {
  key: AnalyzeRequest['strategies'][0]
  label: string
  desc: string
}[] = [
  { key: 'MA', label: 'EMA 均线', desc: '5/20 EMA 交叉' },
  { key: 'RSI', label: 'RSI', desc: '14周期超买超卖' },
  { key: 'MACD', label: 'MACD', desc: '12/26/9 动量' },
  { key: 'VOLUME', label: '量能', desc: '成交量异常' }
]

const INTERVALS = [
  '1m',
  '5m',
  '15m',
  '30m',
  '1H',
  '2H',
  '4H',
  '6H',
  '12H',
  '1D'
]

const POPULAR_SYMBOLS = [
  'BTC-USDT',
  'ETH-USDT',
  'SOL-USDT',
  'BNB-USDT',
  'XRP-USDT',
  'DOGE-USDT',
  'ADA-USDT',
  'AVAX-USDT'
]

interface Props {
  onRunAnalysis: () => void
  isLoading: boolean
}

export default function StrategyPanel({ onRunAnalysis, isLoading }: Props) {
  const {
    symbol,
    setSymbol,
    interval,
    setInterval,
    strategies,
    setStrategies
  } = useAppStore()
  const [customSymbol, setCustomSymbol] = useState('')

  function toggleStrategy(key: AnalyzeRequest['strategies'][0]) {
    if (strategies.includes(key)) {
      if (strategies.length === 1) return // keep at least one
      setStrategies(strategies.filter((s) => s !== key))
    } else {
      setStrategies([...strategies, key])
    }
  }

  function handleCustomSymbol() {
    if (customSymbol.trim()) {
      const formatted = customSymbol.trim().toUpperCase()
      setSymbol(formatted.includes('-') ? formatted : `${formatted}-USDT`)
      setCustomSymbol('')
    }
  }

  return (
    <div className='card'>
      <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 16 }}>
        策略配置
      </div>

      {/* Symbol Select */}
      <div style={{ marginBottom: 16 }}>
        <label
          className='text-xs text-muted'
          style={{
            display: 'block',
            marginBottom: 6,
            textTransform: 'uppercase',
            letterSpacing: '0.06em'
          }}
        >
          交易对
        </label>
        <div
          style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}
        >
          {POPULAR_SYMBOLS.map((s) => (
            <button
              key={s}
              onClick={() => setSymbol(s)}
              style={{
                padding: '4px 10px',
                borderRadius: 20,
                fontSize: '0.75rem',
                fontWeight: 600,
                border: `1px solid ${symbol === s ? 'var(--accent-cyan)' : 'var(--border)'}`,
                color:
                  symbol === s ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                background:
                  symbol === s ? 'rgba(0,212,255,0.08)' : 'transparent',
                transition: 'all 0.2s'
              }}
            >
              {s.replace('-USDT', '')}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type='text'
            placeholder='自定义 e.g. LINK-USDT'
            value={customSymbol}
            onChange={(e) => setCustomSymbol(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCustomSymbol()}
            style={{
              flex: 1,
              background: 'var(--bg-input)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              borderRadius: 'var(--radius-sm)',
              padding: '7px 12px',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          />
          <button
            className='btn btn-ghost'
            style={{ padding: '7px 14px' }}
            onClick={handleCustomSymbol}
          >
            确认
          </button>
        </div>
        <div
          style={{
            marginTop: 6,
            fontSize: '0.8rem',
            color: 'var(--accent-cyan)',
            fontWeight: 600
          }}
        >
          当前: {symbol}
        </div>
      </div>

      {/* Interval */}
      <div style={{ marginBottom: 16 }}>
        <label
          className='text-xs text-muted'
          style={{
            display: 'block',
            marginBottom: 6,
            textTransform: 'uppercase',
            letterSpacing: '0.06em'
          }}
        >
          时间周期
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {INTERVALS.map((iv) => (
            <button
              key={iv}
              onClick={() => setInterval(iv)}
              style={{
                padding: '4px 12px',
                borderRadius: 20,
                fontSize: '0.75rem',
                fontWeight: 600,
                border: `1px solid ${interval === iv ? 'var(--accent-blue)' : 'var(--border)'}`,
                color:
                  interval === iv
                    ? 'var(--accent-blue)'
                    : 'var(--text-secondary)',
                background:
                  interval === iv ? 'rgba(59,130,246,0.1)' : 'transparent',
                transition: 'all 0.2s'
              }}
            >
              {iv}
            </button>
          ))}
        </div>
      </div>

      {/* Strategies */}
      <div style={{ marginBottom: 20 }}>
        <label
          className='text-xs text-muted'
          style={{
            display: 'block',
            marginBottom: 6,
            textTransform: 'uppercase',
            letterSpacing: '0.06em'
          }}
        >
          分析策略
        </label>
        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}
        >
          {STRATEGY_OPTIONS.map((opt) => {
            const active = strategies.includes(opt.key)
            return (
              <button
                key={opt.key}
                onClick={() => toggleStrategy(opt.key)}
                style={{
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: `1px solid ${active ? 'var(--accent-cyan)' : 'var(--border)'}`,
                  background: active
                    ? 'rgba(0,212,255,0.06)'
                    : 'var(--bg-input)',
                  textAlign: 'left',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 4,
                      border: `2px solid ${active ? 'var(--accent-cyan)' : 'var(--border)'}`,
                      background: active ? 'var(--accent-cyan)' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    {active && (
                      <svg
                        width='10'
                        height='10'
                        viewBox='0 0 10 10'
                        fill='none'
                      >
                        <path
                          d='M2 5l2 2 4-4'
                          stroke='#000'
                          strokeWidth='1.5'
                          strokeLinecap='round'
                        />
                      </svg>
                    )}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: active
                          ? 'var(--accent-cyan)'
                          : 'var(--text-primary)'
                      }}
                    >
                      {opt.label}
                    </div>
                    <div
                      style={{
                        fontSize: '0.68rem',
                        color: 'var(--text-muted)'
                      }}
                    >
                      {opt.desc}
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Run Button */}
      <button
        className='btn btn-primary'
        style={{
          width: '100%',
          justifyContent: 'center',
          padding: '13px 0',
          fontSize: '0.95rem'
        }}
        onClick={onRunAnalysis}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <div className='spinner' style={{ width: 16, height: 16 }} />
            分析中...
          </>
        ) : (
          <>⚡ 运行策略分析</>
        )}
      </button>
    </div>
  )
}
