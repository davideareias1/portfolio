import type { NextRequest } from 'next/server'

type RateLimitEntry = {
  count: number
  resetAtMs: number
}

type RateLimitStore = Map<string, RateLimitEntry>

// Use a global store to persist across hot reloads in dev
const globalAny = globalThis as unknown as { __rateLimitStore?: RateLimitStore }
if (!globalAny.__rateLimitStore) {
  globalAny.__rateLimitStore = new Map()
}
const store: RateLimitStore = globalAny.__rateLimitStore

function getKey(request: NextRequest | Request, identifier?: string): string {
  let ip = ''
  const headers = 'headers' in request ? request.headers : new Headers()
  const xff = headers.get('x-forwarded-for')
  if (xff) ip = xff.split(',')[0].trim()
  ip = ip || (request as unknown as { ip?: string }).ip || ''
  const url = new URL('url' in request ? request.url : 'http://localhost')
  const path = url.pathname
  return `${identifier || path}:${ip || 'unknown'}`
}

export type RateLimitResult = {
  allowed: boolean
  headers: Record<string, string>
}

export function applyRateLimit(params: {
  request: NextRequest | Request
  limit: number
  windowMs: number
  identifier?: string
}): RateLimitResult {
  const { request, limit, windowMs, identifier } = params
  const now = Date.now()
  const key = getKey(request, identifier)
  const entry = store.get(key)

  if (!entry || entry.resetAtMs <= now) {
    store.set(key, { count: 1, resetAtMs: now + windowMs })
    return {
      allowed: true,
      headers: {
        'RateLimit-Limit': String(limit),
        'RateLimit-Remaining': String(Math.max(0, limit - 1)),
        'RateLimit-Reset': String(Math.ceil(windowMs / 1000)),
      },
    }
  }

  entry.count += 1
  const remaining = Math.max(0, limit - entry.count)
  const allowed = entry.count <= limit
  const resetSec = Math.max(0, Math.ceil((entry.resetAtMs - now) / 1000))
  return {
    allowed,
    headers: {
      'RateLimit-Limit': String(limit),
      'RateLimit-Remaining': String(remaining),
      'RateLimit-Reset': String(resetSec),
    },
  }
}


