import React, { useMemo } from 'react'
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Bar,
  Line,
  Cell
} from 'recharts'
import type { Candle } from '../../types'
import { format } from 'date-fns'

interface Props {
  candles: Candle[]
  height?: number
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const c: Candle = payload[0]?.payload
  const isBull = c.close >= c.open
  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: '10px 14px',
        fontSize: '0.78rem',
        lineHeight: 1.8
      }}
    >
      <div style={{ color: 'var(--text-secondary)', marginBottom: 4 }}>
        {format(new Date(c.ts), 'MM-dd HH:mm')}
      </div>
      <div>
        开{' '}
        <span className='mono' style={{ color: 'var(--text-primary)' }}>
          {c.open.toFixed(4)}
        </span>
      </div>
      <div>
        高{' '}
        <span className='mono' style={{ color: 'var(--buy)' }}>
          {c.high.toFixed(4)}
        </span>
      </div>
      <div>
        低{' '}
        <span className='mono' style={{ color: 'var(--sell)' }}>
          {c.low.toFixed(4)}
        </span>
      </div>
      <div>
        收{' '}
        <span
          className='mono'
          style={{ color: isBull ? 'var(--buy)' : 'var(--sell)' }}
        >
          {c.close.toFixed(4)}
        </span>
      </div>
      <div>
        量{' '}
        <span className='mono' style={{ color: 'var(--text-secondary)' }}>
          {c.vol.toFixed(2)}
        </span>
      </div>
    </div>
  )
}

export default function CandlestickChart({ candles, height = 320 }: Props) {
  const data = useMemo(
    () =>
      candles.map((c) => ({
        ...c,
        // For recharts: represent candle body as a range bar
        bodyLow: Math.min(c.open, c.close),
        bodyHigh: Math.max(c.open, c.close),
        wick: [c.low, c.high],
        isBull: c.close >= c.open,
        label: format(new Date(c.ts), 'HH:mm')
      })),
    [candles]
  )

  const prices = candles.flatMap((c) => [c.high, c.low])
  const minP = Math.min(...prices)
  const maxP = Math.max(...prices)
  const pad = (maxP - minP) * 0.05

  return (
    <ResponsiveContainer width='100%' height={height}>
      <ComposedChart
        data={data}
        margin={{ top: 8, right: 8, bottom: 0, left: 8 }}
      >
        <CartesianGrid
          stroke='var(--border)'
          strokeDasharray='3 3'
          vertical={false}
        />
        <XAxis
          dataKey='label'
          tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          interval={Math.floor(data.length / 6)}
        />
        <YAxis
          domain={[minP - pad, maxP + pad]}
          tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          width={70}
          tickFormatter={(v) => v.toFixed(2)}
          orientation='right'
        />
        <Tooltip content={<CustomTooltip />} />

        {/* Candlestick bodies */}
        <Bar dataKey='bodyHigh' stackId='candle' fill='transparent' />
        <Bar dataKey='bodyLow' stackId='candle'>
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={entry.isBull ? 'var(--buy)' : 'var(--sell)'}
              fillOpacity={0.85}
            />
          ))}
        </Bar>

        {/* High/Low close line */}
        <Line
          dataKey='close'
          stroke='var(--accent-cyan)'
          strokeWidth={1.5}
          dot={false}
          connectNulls
          strokeOpacity={0.6}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
