import type { NextRequest } from 'next/server'
import sanitizeHtmlLib from 'sanitize-html'

// Admin allowlist via env vars
// Set one of: ADMIN_EMAILS (comma-separated) or ADMIN_USER_IDS (comma-separated)
export function isAdminUser(user: { email?: string | null; id?: string | null } | null | undefined): boolean {
  const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map((s) => s.trim()).filter(Boolean)
  const adminIds = (process.env.ADMIN_USER_IDS || '').split(',').map((s) => s.trim()).filter(Boolean)
  const byEmail = !!(user && user.email && adminEmails.length > 0 && adminEmails.includes(user.email))
  const byId = !!(user && user.id && adminIds.length > 0 && adminIds.includes(user.id))
  return byEmail || byId
}

// Same-origin protection for state-changing requests
export function isSameOrigin(request: NextRequest | Request): boolean {
  const headers = 'headers' in request ? request.headers : new Headers()
  const origin = headers.get('origin') || ''
  const referer = headers.get('referer') || ''

  const allowedOriginsEnv = process.env.ALLOWED_ORIGINS || process.env.NEXT_PUBLIC_SITE_URL || ''
  const allowedOrigins = allowedOriginsEnv
    .split(',')
    .map((s) => s.trim().replace(/\/$/, ''))
    .filter(Boolean)

  // Fallback: infer from the request URL itself
  let requestOrigin = ''
  try {
    const url = new URL('url' in request ? request.url : '')
    requestOrigin = `${url.protocol}//${url.host}`
  } catch {
    // ignore
  }

  const candidates = [origin, referer ? safeOriginFromUrl(referer) : '', requestOrigin].filter(Boolean)
  if (allowedOrigins.length === 0) {
    // If not configured, only allow exact same origin as request URL
    return candidates.includes(requestOrigin)
  }
  return candidates.some((c) => allowedOrigins.includes(c.replace(/\/$/, '')))
}

function safeOriginFromUrl(urlString: string): string {
  try {
    const u = new URL(urlString)
    return `${u.protocol}//${u.host}`
  } catch {
    return ''
  }
}

// Sanitize rich HTML content (Tiptap)
export function sanitizeRichHtml(dirtyHtml: string): string {
  return sanitizeHtmlLib(dirtyHtml, {
    allowedTags: [
      'p', 'a', 'b', 'strong', 'i', 'em', 'u', 'blockquote', 'code', 'pre',
      'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'br', 'span'
    ],
    allowedAttributes: {
      a: ['href', 'name', 'target', 'rel'],
      span: ['class'],
      code: ['class']
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    // Prevent target=_blank tabnabbing
    transformTags: {
      a: sanitizeHtmlLib.simpleTransform('a', { rel: 'noopener noreferrer' }, true),
    },
    // Disallow all comments and unknown tags
    allowProtocolRelative: false,
    enforceHtmlBoundary: true,
  })
}

// Sanitize plain text fields by stripping all tags
export function sanitizePlainText(input: string): string {
  return sanitizeHtmlLib(input, { allowedTags: [], allowedAttributes: {} })
}

// Escape JSON-LD to prevent </script> breakouts
export function safeJsonLd(object: unknown): string {
  return JSON.stringify(object)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
}

// Utility to get client IP (best-effort)
export function getClientIp(req: NextRequest | Request): string {
  const headers = 'headers' in req ? req.headers : new Headers()
  const xff = headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0].trim()
  const ip = (req as unknown as { ip?: string }).ip || ''
  return ip || 'unknown'
}


