import { useQuery } from '@tanstack/react-query'
import { fetchTopMovers } from '../services/market'
import { fetchSignals } from '../services/strategy'
import SignalCard from '../components/Strategy/SignalCard'
import type { Ticker } from '../types'

function TickerRow({ ticker }: { ticker: Ticker }) {
  const up = ticker.changePct24h >= 0
  return (
    <div
      className='flex-between'
      style={{
        padding: '12px 0',
        borderBottom: '1px solid var(--border)'
      }}
    >
      <div>
        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
          {ticker.symbol}
        </div>
        <div className='text-xs text-muted'>
          Vol {(ticker.volCcy24h / 1e6).toFixed(1)}M USDT
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div className='mono' style={{ fontWeight: 700 }}>
          ${ticker.last.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </div>
        <div
          style={{
            fontSize: '0.78rem',
            fontWeight: 600,
            color: up ? 'var(--buy)' : 'var(--sell)'
          }}
        >
          {up ? '+' : ''}
          {ticker.changePct24h.toFixed(2)}%
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { data: movers, isLoading: loadingMovers } = useQuery({
    queryKey: ['top-movers'],
    queryFn: () => fetchTopMovers(8),
    refetchInterval: 30000
  })

  const { data: signals, isLoading: loadingSignals } = useQuery({
    queryKey: ['signals', '1H'],
    queryFn: () => fetchSignals('1H'),
    staleTime: 60000
  })

  const buySignals = signals?.filter((s) => s.signal === 'BUY') ?? []
  const sellSignals = signals?.filter((s) => s.signal === 'SELL') ?? []
  const holdSignals = signals?.filter((s) => s.signal === 'HOLD') ?? []

  return (
    <div>
      {/* Stats row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 12,
          marginBottom: 24
        }}
      >
        {[
          {
            label: '买入信号',
            count: buySignals.length,
            color: 'var(--buy)',
            bg: 'var(--buy-dim)',
            emoji: '📈'
          },
          {
            label: '卖出信号',
            count: sellSignals.length,
            color: 'var(--sell)',
            bg: 'var(--sell-dim)',
            emoji: '📉'
          },
          {
            label: '观望信号',
            count: holdSignals.length,
            color: 'var(--hold)',
            bg: 'var(--hold-dim)',
            emoji: '⏸'
          }
        ].map((stat) => (
          <div
            key={stat.label}
            className='card'
            style={{
              padding: '16px',
              textAlign: 'center',
              border: `1px solid ${stat.color}30`
            }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>
              {stat.emoji}
            </div>
            <div
              style={{
                fontSize: '1.6rem',
                fontWeight: 800,
                color: stat.color,
                lineHeight: 1
              }}
            >
              {loadingSignals ? '—' : stat.count}
            </div>
            <div className='text-xs text-muted' style={{ marginTop: 4 }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Top Movers */}
        <div className='card' style={{ gridColumn: '1' }}>
          <div
            style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 4 }}
          >
            🔥 涨跌榜
          </div>
          <div className='text-xs text-muted' style={{ marginBottom: 12 }}>
            24h 涨跌幅 Top 8
          </div>
          {loadingMovers ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className='skeleton' style={{ height: 40 }} />
              ))}
            </div>
          ) : (
            movers?.map((t) => <TickerRow key={t.symbol} ticker={t} />)
          )}
        </div>

        {/* Signal Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className='card' style={{ padding: '16px' }}>
            <div
              style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 12 }}
            >
              ⚡ 实时信号 <span className='text-muted text-xs'>(1H)</span>
            </div>
            {loadingSignals ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className='skeleton' style={{ height: 60 }} />
                ))}
              </div>
            ) : signals?.length === 0 ? (
              <div
                className='text-muted text-sm'
                style={{ textAlign: 'center', padding: '20px 0' }}
              >
                无数据，请确认后端服务已启动
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {signals?.slice(0, 6).map((s) => (
                  <SignalCard key={s.symbol} signal={s} compact />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile: stack columns */}
      <style>{`
        @media (max-width: 768px) {
          .dashboard-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
