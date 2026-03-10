import React from 'react'
import type { SignalType, StrategySignal } from '../../types'

function signalClass(s: SignalType) {
  return s === 'BUY' ? 'buy' : s === 'SELL' ? 'sell' : 'hold'
}

function ConfidenceBar({
  value,
  signal
}: {
  value: number
  signal: SignalType
}) {
  const colors: Record<SignalType, string> = {
    BUY: 'var(--buy)',
    SELL: 'var(--sell)',
    HOLD: 'var(--hold)'
  }
  return (
    <div style={{ marginTop: 12 }}>
      <div
        className='flex-between text-sm text-muted'
        style={{ marginBottom: 6 }}
      >
        <span>综合置信度</span>
        <span style={{ color: colors[signal], fontWeight: 700 }}>{value}%</span>
      </div>
      <div
        style={{
          background: 'var(--bg-input)',
          borderRadius: 20,
          height: 6,
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            width: `${value}%`,
            height: '100%',
            background: colors[signal],
            borderRadius: 20,
            transition: 'width 0.6s cubic-bezier(.16,1,.3,1)',
            boxShadow: `0 0 8px ${colors[signal]}80`
          }}
        />
      </div>
    </div>
  )
}

interface SignalCardProps {
  signal: StrategySignal
  compact?: boolean
}

export default function SignalCard({ signal, compact }: SignalCardProps) {
  const cls = signalClass(signal.signal)
  const emoji =
    signal.signal === 'BUY' ? '📈' : signal.signal === 'SELL' ? '📉' : '⏸'

  if (compact) {
    return (
      <div className='card' style={{ padding: '14px 16px' }}>
        <div className='flex-between'>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
              {signal.symbol}
            </div>
            <div className='text-muted text-xs'>${signal.price.toFixed(4)}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span className={`badge badge-${cls}`}>
              {emoji} {signal.signal}
            </span>
            <div className='text-muted text-xs' style={{ marginTop: 4 }}>
              置信度 {signal.confidence}%
            </div>
          </div>
        </div>
        <ConfidenceBar value={signal.confidence} signal={signal.signal} />
      </div>
    )
  }

  return (
    <div className={`card fade-in`} style={{ borderColor: `var(--${cls})30` }}>
      {/* Header */}
      <div className='flex-between' style={{ marginBottom: 16 }}>
        <div>
          <div
            style={{
              fontWeight: 700,
              fontSize: '1.1rem',
              letterSpacing: '-0.02em'
            }}
          >
            {signal.symbol}
          </div>
          <div className='text-muted text-sm' style={{ marginTop: 2 }}>
            {signal.interval} ·{' '}
            {new Date(signal.ts).toLocaleTimeString('zh-CN')}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span
            className={`badge badge-${cls}`}
            style={{ fontSize: '0.85rem', padding: '6px 14px' }}
          >
            {emoji} {signal.signal}
          </span>
          <div
            className='mono'
            style={{ marginTop: 6, fontSize: '0.95rem', fontWeight: 700 }}
          >
            $
            {signal.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      <ConfidenceBar value={signal.confidence} signal={signal.signal} />

      {/* Indicators */}
      <div style={{ marginTop: 16 }}>
        <div
          className='text-xs text-muted'
          style={{
            marginBottom: 8,
            textTransform: 'uppercase',
            letterSpacing: '0.06em'
          }}
        >
          指标详情
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {signal.indicators.map((ind) => (
            <div
              key={ind.name}
              style={{
                background: 'var(--bg-input)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: 12
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  className='flex gap-2'
                  style={{ alignItems: 'center', marginBottom: 4 }}
                >
                  <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                    {ind.name}
                  </span>
                  <span
                    className={`badge badge-${signalClass(ind.signal)}`}
                    style={{ padding: '1px 7px', fontSize: '0.65rem' }}
                  >
                    {ind.signal}
                  </span>
                </div>
                <div className='text-xs text-muted'>{ind.description}</div>
              </div>
              <div
                className='mono text-xs'
                style={{ color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}
              >
                {String(ind.value)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reasons */}
      {signal.reasons.length > 0 && (
        <div style={{ marginTop: 14 }}>
          <div
            className='text-xs text-muted'
            style={{
              marginBottom: 6,
              textTransform: 'uppercase',
              letterSpacing: '0.06em'
            }}
          >
            信号依据
          </div>
          {signal.reasons.map((r, i) => (
            <div
              key={i}
              style={{
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                marginBottom: 4,
                display: 'flex',
                gap: 6
              }}
            >
              <span style={{ color: `var(--${cls})`, marginTop: 1 }}>›</span>
              <span>{r}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
