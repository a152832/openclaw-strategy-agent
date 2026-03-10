import api from './api'
import type { StrategySignal } from '../types'

// ─── Config ───────────────────────────────────────────────────────────────

const USE_OPENCLAW = import.meta.env.VITE_USE_OPENCLAW === 'true'

// ─── Response types ───────────────────────────────────────────────────────

export interface ChatResponse {
  type: 'text' | 'signal' | 'signals_list'
  text: string
  signal?: StrategySignal
  signals?: StrategySignal[]
}

export interface ChatApiResponse {
  code: number
  data: ChatResponse
  message?: string
}

// ─── System prompt injected into OpenClaw messages ────────────────────────

const SYSTEM_PROMPT = `你是 OpenClaw 加密货币策略分析助手。你被集成在一个专业的加密交易策略分析平台中。

你的核心职责：
1. 分析加密货币市场行情和走势
2. 提供专业的交易策略建议（BUY/SELL/HOLD）
3. 解读技术指标（MA均线、RSI、MACD、成交量）
4. 回答加密市场相关问题

你连接了以下实时数据工具（由后端 Node.js 服务提供，地址 http://localhost:3001）：
- 行情查询：GET /api/market/tickers
- K线数据：GET /api/market/candles/:symbol
- 策略分析：POST /api/strategy/analyze（支持 MA/RSI/MACD/VOLUME 策略）
- 全市场扫描：GET /api/strategy/signals

请用简洁专业的中文回复，每条建议尽量包含：信号方向、置信度、主要原因。`

// ─── OpenClaw streaming call (via backend proxy — no CORS) ───────────────

/**
 * Calls the Node.js backend proxy → OpenClaw /v1/chat/completions.
 * Routing through our own backend avoids browser CORS restrictions.
 * onChunk is called with each text fragment as it streams in.
 */
export async function sendToOpenClaw(
  message: string,
  history: { role: 'user' | 'assistant'; content: string }[],
  onChunk: (chunk: string) => void,
  signal?: AbortSignal
): Promise<void> {
  const res = await fetch('/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_OPENCLAW_TOKEN || ''}`,
      'x-openclaw-agent-id': 'main'
    },
    body: JSON.stringify({
      model: import.meta.env.VITE_OPENCLAW_MODEL || 'bailian/qwen-plus',
      input: message,
      stream: true,
      temperature: 0.7
    }),
    signal
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`代理请求失败 ${res.status}: ${err}`)
  }

  const reader = res.body!.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || !trimmed.startsWith('data:')) continue
      const data = trimmed.slice(5).trim()
      if (data === '[DONE]') return

      try {
        const json = JSON.parse(data)

        // 只处理流式文本 delta
        if (json.type === 'response.output_text.delta' && json.delta) {
          onChunk(json.delta)
        }

        // 可选：处理最终完成文本
        if (json.type === 'response.output_text.done' && json.text) {
          onChunk(json.text) // 最终文本也触发一次
        }
      } catch {
        // 忽略解析错误
      }
    }
  }
}

// ─── Local fallback (Phase 1 keyword matching) ────────────────────────────

export async function sendToLocalChat(message: string): Promise<ChatResponse> {
  const res = await api.post<ChatApiResponse>('/chat', { message })
  if (res.data.code !== 0) throw new Error(res.data.message || '请求失败')
  return res.data.data
}

// ─── Unified entry point ──────────────────────────────────────────────────

export { USE_OPENCLAW }
