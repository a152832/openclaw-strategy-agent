import React from 'react'
import { useAppStore } from '../store/useAppStore'

export default function Settings() {
  const { symbol, interval, strategies } = useAppStore()

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2
          style={{
            fontWeight: 700,
            fontSize: '1.2rem',
            letterSpacing: '-0.02em'
          }}
        >
          设置
        </h2>
        <div className='text-muted text-sm' style={{ marginTop: 4 }}>
          当前配置与 API 连接状态
        </div>
      </div>

      <div style={{ display: 'grid', gap: 16, maxWidth: 600 }}>
        {/* Current Config */}
        <div className='card'>
          <div style={{ fontWeight: 700, marginBottom: 16 }}>当前配置</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: '选中交易对', value: symbol },
              { label: '时间周期', value: interval },
              { label: '启用策略', value: strategies.join(' · ') }
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  background: 'var(--bg-input)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px 14px',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                <span className='text-muted text-sm'>{item.label}</span>
                <span
                  style={{
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    color: 'var(--accent-cyan)'
                  }}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* API Config */}
        <div className='card'>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>数据源配置</div>
          <div className='text-muted text-sm' style={{ marginBottom: 16 }}>
            Phase 1 使用 OKX 公开行情接口，无需 API Key
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              {
                label: 'API Base URL',
                value: 'https://www.okx.com',
                status: 'ok'
              },
              { label: '数据类型', value: '公开行情（无签名）', status: 'ok' },
              {
                label: '后端地址',
                value: 'http://localhost:3001',
                status: 'ok'
              }
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  background: 'var(--bg-input)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px 14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div className='text-sm' style={{ fontWeight: 500 }}>
                    {item.label}
                  </div>
                  <div className='text-xs text-muted mono'>{item.value}</div>
                </div>
                <span className='badge badge-buy'>● 正常</span>
              </div>
            ))}
          </div>
        </div>

        {/* Phase Roadmap */}
        <div className='card'>
          <div style={{ fontWeight: 700, marginBottom: 16 }}>开发阶段</div>
          {[
            {
              phase: 'Phase 1',
              title: '策略分析',
              desc: '行情获取 + 技术指标 + 信号输出',
              done: true
            },
            {
              phase: 'Phase 2',
              title: 'OpenClaw 接入',
              desc: '注册为 Agent 工具，支持自然语言查询',
              done: false
            },
            {
              phase: 'Phase 3',
              title: '自动交易',
              desc: 'Binance 账户接口 + 风控 + 自动下单',
              done: false
            }
          ].map((item) => (
            <div
              key={item.phase}
              style={{
                display: 'flex',
                gap: 14,
                padding: '12px 0',
                borderBottom: '1px solid var(--border)'
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: item.done ? 'var(--buy-dim)' : 'var(--bg-input)',
                  border: `2px solid ${item.done ? 'var(--buy)' : 'var(--border)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: '0.7rem',
                  color: item.done ? 'var(--buy)' : 'var(--text-muted)',
                  fontWeight: 700
                }}
              >
                {item.done ? '✓' : '○'}
              </div>
              <div>
                <div
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    marginBottom: 2
                  }}
                >
                  {item.phase}
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                  {item.title}
                </div>
                <div className='text-xs text-muted' style={{ marginTop: 2 }}>
                  {item.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
