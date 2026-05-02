/**
 * Server-side HTML sanitizer for dangerouslySetInnerHTML usage.
 *
 * Since this is a server-rendered application where all HTML is generated
 * from trusted server-side code (not user input), we apply a lightweight
 * sanitization pass to strip potentially dangerous patterns as an extra
 * defense-in-depth measure against XSS.
 */

// Patterns that should never appear in our server-generated HTML
const DANGEROUS_PATTERNS = [
  // Script tags (opening and closing)
  /<script\b[^>]*>[\s\S]*?<\/script>/gi,
  /<script\b[^>]*\/?>/gi,

  // Event handlers in attributes (onclick, onerror, onload, etc.)
  /\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi,

  // javascript: protocol in href/src/action attributes
  /(?:href|src|action)\s*=\s*(?:"javascript:[^"]*"|'javascript:[^']*')/gi,

  // data: URIs in src (can carry JS payloads)
  /src\s*=\s*(?:"data:text\/html[^"]*"|'data:text\/html[^']*')/gi,

  // Expression-based CSS attacks
  /style\s*=\s*(?:"[^"]*expression\s*\([^"]*"|'[^']*expression\s*\([^']*')/gi,

  // iframe/object/embed/base tags (potential clickjacking/phishing)
  /<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi,
  /<object\b[^>]*>[\s\S]*?<\/object>/gi,
  /<embed\b[^>]*\/?>/gi,
  /<base\b[^>]*\/?>/gi,
];

/**
 * Sanitize server-generated HTML by removing known dangerous patterns.
 * This is a defense-in-depth measure — the HTML is generated from trusted
 * server code, not user input, so this acts as a safety net.
 */
export function sanitizeServerHtml(html: string): string {
  let sanitized = html;
  for (const pattern of DANGEROUS_PATTERNS) {
    sanitized = sanitized.replace(pattern, "");
  }
  return sanitized;
}
