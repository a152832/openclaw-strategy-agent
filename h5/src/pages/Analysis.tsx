import React, { useState, useRef, useEffect, useCallback } from 'react'
import { sendToOpenClaw, sendToLocalChat, USE_OPENCLAW } from '../services/chat'
import type { ChatResponse } from '../services/chat'
import type { StrategySignal, SignalType } from '../types'

// ─── Types ────────────────────────────────────────────────────────────────

interface Message {
  id: string
  role: 'user' | 'agent'
  text: string
  response?: ChatResponse
  ts: number
  loading?: boolean
}

// ─── Suggestion Chips ─────────────────────────────────────────────────────

const SUGGESTIONS = [
  '今日市场大盘行情分析',
  'BTC 现在适合买入吗？',
  'ETH 1小时策略分析',
  '扫描全市场信号',
  'SOL 价格多少？',
  'DOGE 走势如何？'
]

// ─── Signal helpers ───────────────────────────────────────────────────────

function signalCls(s: SignalType) {
  return s === 'BUY' ? 'buy' : s === 'SELL' ? 'sell' : 'hold'
}

// ─── Sub-components ───────────────────────────────────────────────────────

function ThinkingDots() {
  return (
    <div
      style={{
        display: 'flex',
        gap: 5,
        alignItems: 'center',
        padding: '4px 0'
      }}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: 'var(--accent-cyan)',
            animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`
          }}
        />
      ))}
    </div>
  )
}

function InlineSignalCard({ signal }: { signal: StrategySignal }) {
  const cls = signalCls(signal.signal)
  const emoji =
    signal.signal === 'BUY' ? '📈' : signal.signal === 'SELL' ? '📉' : '⏸'

  return (
    <div
      style={{
        marginTop: 12,
        background: 'var(--bg-secondary)',
        border: `1px solid var(--${cls})40`,
        borderRadius: 'var(--radius-md)',
        padding: '14px 16px',
        minWidth: 260
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 10
        }}
      >
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
            {signal.symbol}
          </div>
          <div
            style={{
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              marginTop: 2
            }}
          >
            {signal.interval} ·{' '}
            {new Date(signal.ts).toLocaleTimeString('zh-CN')}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span
            className={`badge badge-${cls}`}
            style={{ fontSize: '0.78rem' }}
          >
            {emoji} {signal.signal}
          </span>
          <div
            className='mono'
            style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: 5 }}
          >
            $
            {signal.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Confidence bar */}
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 4,
            fontSize: '0.72rem',
            color: 'var(--text-muted)'
          }}
        >
          <span>综合置信度</span>
          <span style={{ color: `var(--${cls})`, fontWeight: 700 }}>
            {signal.confidence}%
          </span>
        </div>
        <div
          style={{
            background: 'var(--bg-input)',
            borderRadius: 20,
            height: 5,
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              width: `${signal.confidence}%`,
              height: '100%',
              background: `var(--${cls})`,
              borderRadius: 20,
              boxShadow: `0 0 6px var(--${cls})80`,
              transition: 'width 0.8s cubic-bezier(.16,1,.3,1)'
            }}
          />
        </div>
      </div>

      {/* Indicators */}
      <div
        style={{
          marginTop: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: 6
        }}
      >
        {signal.indicators.map((ind) => (
          <div
            key={ind.name}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.72rem'
            }}
          >
            <span style={{ color: 'var(--text-muted)' }}>{ind.name}</span>
            <span
              className={`badge badge-${signalCls(ind.signal)}`}
              style={{ padding: '1px 7px', fontSize: '0.62rem' }}
            >
              {ind.signal}
            </span>
          </div>
        ))}
      </div>

      {/* Top reason */}
      {signal.reasons[0] && (
        <div
          style={{
            marginTop: 10,
            fontSize: '0.72rem',
            color: 'var(--text-secondary)',
            borderTop: '1px solid var(--border)',
            paddingTop: 8,
            lineHeight: 1.5
          }}
        >
          › {signal.reasons[0]}
        </div>
      )}
    </div>
  )
}

function InlineSignalsList({ signals }: { signals: StrategySignal[] }) {
  return (
    <div
      style={{
        marginTop: 12,
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }}
    >
      {signals.map((s) => {
        const cls = signalCls(s.signal)
        const emoji =
          s.signal === 'BUY' ? '📈' : s.signal === 'SELL' ? '📉' : '⏸'
        return (
          <div
            key={s.symbol}
            style={{
              background: 'var(--bg-secondary)',
              border: `1px solid var(--${cls})30`,
              borderRadius: 'var(--radius-sm)',
              padding: '10px 12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>
                {s.symbol}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                ${s.price.toFixed(2)}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span
                className={`badge badge-${cls}`}
                style={{ fontSize: '0.68rem' }}
              >
                {emoji} {s.signal}
              </span>
              <div
                style={{
                  fontSize: '0.68rem',
                  color: 'var(--text-muted)',
                  marginTop: 3
                }}
              >
                {s.confidence}% 置信
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/** Render markdown-lite: **bold**, \n newlines */
function MsgText({ text }: { text: string }) {
  const html = text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>')
  return (
    <div
      style={{ fontSize: '0.875rem', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

function AgentBubble({ msg }: { msg: Message }) {
  return (
    <div
      className='fade-in'
      style={{ display: 'flex', gap: 10, maxWidth: '85%' }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: '50%',
          flexShrink: 0,
          background:
            'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1rem',
          boxShadow: 'var(--shadow-glow-cyan)'
        }}
      >
        ⚡
      </div>
      {/* Bubble */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '4px 16px 16px 16px',
          padding: '12px 14px',
          boxShadow: 'var(--shadow-card)'
        }}
      >
        {msg.loading ? (
          <>
            <div
              style={{
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                marginBottom: 8
              }}
            >
              进入研究模式，正在进行深度分析...
            </div>
            <ThinkingDots />
          </>
        ) : (
          <>
            <MsgText text={msg.text} />
            {msg.response?.type === 'signal' && msg.response.signal && (
              <InlineSignalCard signal={msg.response.signal} />
            )}
            {msg.response?.type === 'signals_list' && msg.response.signals && (
              <InlineSignalsList signals={msg.response.signals} />
            )}
          </>
        )}
      </div>
    </div>
  )
}

function UserBubble({ msg }: { msg: Message }) {
  return (
    <div
      className='fade-in'
      style={{ display: 'flex', justifyContent: 'flex-end' }}
    >
      <div
        style={{
          background:
            'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(59,130,246,0.15))',
          border: '1px solid rgba(0,212,255,0.25)',
          borderRadius: '16px 4px 16px 16px',
          padding: '10px 14px',
          maxWidth: '75%',
          fontSize: '0.875rem',
          lineHeight: 1.6
        }}
      >
        {msg.text}
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────

export default function Analysis() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'agent',
      text: `你好！我是 OpenClaw 加密策略 Agent 🤖${USE_OPENCLAW ? '\n\n⚡ 已连接 OpenClaw AI（Qwen 模型驱动）' : ''}\n\n我可以帮你分析交易策略、查询行情、扫描市场信号。\n\n试试下面的快捷提问，或者直接输入你的问题 👇`,
      ts: Date.now()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  // Keep conversation history for OpenClaw multi-turn context
  const historyRef = useRef<{ role: 'user' | 'assistant'; content: string }[]>(
    []
  )
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return

      const userMsg: Message = {
        id: Date.now().toString(),
        role: 'user',
        text,
        ts: Date.now()
      }
      const agentId = (Date.now() + 1).toString()
      const agentMsg: Message = {
        id: agentId,
        role: 'agent',
        text: '',
        ts: Date.now(),
        loading: true
      }

      setMessages((prev) => [...prev, userMsg, agentMsg])
      setInput('')
      setIsLoading(true)

      if (USE_OPENCLAW) {
        // ── OpenClaw streaming path ──────────────────────────────────────
        abortRef.current = new AbortController()
        let accumulated = ''

        // Show thinking dots briefly, then switch to streaming text
        try {
          // await sendToOpenClaw(
          //   text,
          //   historyRef.current,
          //   (chunk) => {
          //     console.log('chunk', chunk)
          //     accumulated += chunk
          //     const snapshot = accumulated
          //     setMessages((prev) =>
          //       prev.map((m) =>
          //         m.id === agentId
          //           ? { ...m, loading: false, text: snapshot }
          //           : m
          //       )
          //     )
          //   },
          //   abortRef.current.signal
          // )

          await sendToOpenClaw(text, historyRef.current, (chunk) => {
            accumulated += chunk
            setMessages((prev) =>
              prev.map((m) =>
                m.id === agentId
                  ? { ...m, loading: false, text: accumulated }
                  : m
              )
            )
          })
          // Save to history for next turn
          historyRef.current = [
            ...historyRef.current,
            { role: 'user', content: text },
            { role: 'assistant', content: accumulated }
          ]
        } catch (err: any) {
          const errText =
            err.name === 'AbortError'
              ? '已停止'
              : `⚠ OpenClaw 连接失败：${err.message}\n\n请检查：\n1. Ubuntu 上 OpenClaw 是否正在运行\n2. VITE_OPENCLAW_BASE_URL 地址是否正确\n3. VITE_OPENCLAW_TOKEN 是否有效`
          setMessages((prev) =>
            prev.map((m) =>
              m.id === agentId ? { ...m, loading: false, text: errText } : m
            )
          )
        }
      } else {
        // ── Local /api/chat fallback path ────────────────────────────────
        try {
          const response = await sendToLocalChat(text)
          setMessages((prev) =>
            prev.map((m) =>
              m.id === agentId
                ? { ...m, loading: false, text: response.text, response }
                : m
            )
          )
        } catch (err: any) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === agentId
                ? {
                    ...m,
                    loading: false,
                    text: `⚠ 出错了：${err.message}\n\n请确认后端服务已启动 (http://localhost:3001)`
                  }
                : m
            )
          )
        }
      }

      setIsLoading(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    },
    [isLoading]
  )

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 60px - 48px)',
        maxHeight: 900
      }}
    >
      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '8px 0 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16
        }}
      >
        {messages.map((msg) =>
          msg.role === 'user' ? (
            <UserBubble key={msg.id} msg={msg} />
          ) : (
            <AgentBubble key={msg.id} msg={msg} />
          )
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestion chips - shown only when few messages */}
      {messages.length <= 2 && (
        <div
          style={{
            paddingBottom: 12,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8
          }}
        >
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              disabled={isLoading}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                fontSize: '0.78rem',
                fontWeight: 500,
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
                background: 'var(--bg-card)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.borderColor =
                  'var(--accent-cyan)'
                ;(e.currentTarget as HTMLButtonElement).style.color =
                  'var(--accent-cyan)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.borderColor =
                  'var(--border)'
                ;(e.currentTarget as HTMLButtonElement).style.color =
                  'var(--text-secondary)'
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          boxShadow: '0 -4px 24px rgba(0,0,0,0.2)'
        }}
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder='任何加密交易问题...'
          rows={1}
          disabled={isLoading}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text-primary)',
            fontSize: '0.9rem',
            resize: 'none',
            lineHeight: 1.5,
            maxHeight: 120,
            overflow: 'auto',
            fontFamily: 'inherit'
          }}
          onInput={(e) => {
            const el = e.currentTarget
            el.style.height = 'auto'
            el.style.height = Math.min(el.scrollHeight, 120) + 'px'
          }}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={isLoading || !input.trim()}
          style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            flexShrink: 0,
            background:
              input.trim() && !isLoading
                ? 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))'
                : 'var(--bg-input)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
            boxShadow:
              input.trim() && !isLoading
                ? '0 0 16px rgba(0,212,255,0.3)'
                : 'none'
          }}
        >
          {isLoading ? (
            <div className='spinner' style={{ width: 16, height: 16 }} />
          ) : (
            <svg
              width='16'
              height='16'
              viewBox='0 0 24 24'
              fill='none'
              stroke={input.trim() ? '#000' : 'var(--text-muted)'}
              strokeWidth='2.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <line x1='22' y1='2' x2='11' y2='13' />
              <polygon points='22 2 15 22 11 13 2 9 22 2' />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}
