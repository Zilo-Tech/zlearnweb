# CSRF Protection Implementation

## Overview

This document describes the Cross-Site Request Forgery (CSRF) protection implementation for the zlearn application. CSRF protection prevents unauthorized actions on behalf of authenticated users by validating that requests originate from the legitimate application.

## Security Issue Addressed

**Severity:** MEDIUM  
**Location:** API requests  
**Issue:** Missing CSRF protection for state-changing operations

### Risks Mitigated

- ✅ Cross-site request forgery attacks
- ✅ Unauthorized actions on behalf of users
- ✅ Malicious form submissions from external sites

## Implementation Details

### 1. CSRF Token Generation

**File:** `lib/csrf.ts`

The CSRF token system uses:
- **Cryptographically secure tokens**: Generated using Node.js `crypto.randomBytes()`
- **HttpOnly cookies**: Tokens stored in cookies that cannot be accessed via JavaScript
- **SameSite=Strict**: Cookies only sent with same-site requests
- **Secure flag**: Enabled in production for HTTPS-only transmission
- **24-hour expiration**: Tokens expire after 24 hours for security

### 2. Token Endpoint

**File:** `app/api/csrf/route.ts`

**Endpoint:** `GET /api/csrf`

Returns a CSRF token for the current session. The token is automatically stored in an httpOnly, SameSite=Strict cookie.

**Usage:**
```typescript
const response = await fetch('/api/csrf', {
  method: 'GET',
  credentials: 'include',
})
const { csrfToken } = await response.json()
```

### 3. CSRF Validation Middleware

**File:** `lib/csrf-middleware.ts`

The middleware validates:
1. **CSRF Token**: Checks for valid token in `X-CSRF-Token` header or request body
2. **Origin/Referer Headers**: Validates request origin against allowed origins
3. **Request Method**: Only validates state-changing methods (POST, PUT, DELETE, PATCH)

**Usage:**
```typescript
import { withCSRFProtection } from '@/lib/csrf-middleware'

export async function POST(request: NextRequest) {
  return withCSRFProtection(request, async (req) => {
    // Your handler logic
  })
}
```

### 4. Protected API Routes

**File:** `app/api/contact/route.ts`

Example implementation of a protected API route:

```typescript
export async function POST(request: NextRequest) {
  return withCSRFProtection(request, handleContactSubmission)
}
```

### 5. Client-Side Implementation

**File:** `app/contact/page.tsx`

Forms must:
1. Fetch CSRF token on component mount
2. Include token in `X-CSRF-Token` header
3. Include token in request body (as fallback)
4. Use `credentials: 'include'` to send cookies
5. Refresh token after successful submission

**Example:**
```typescript
const response = await fetch('/api/contact', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': csrfToken,
  },
  credentials: 'include',
  body: JSON.stringify({
    ...formData,
    csrfToken,
  }),
})
```

## Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Base URL of your application (required for production)
NEXT_PUBLIC_BASE_URL=https://yourdomain.com

# Allowed origins for CSRF validation (comma-separated)
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Cookie Configuration

CSRF tokens are stored in cookies with the following settings:

- **Name**: `csrf-token`
- **HttpOnly**: `true` (prevents JavaScript access)
- **Secure**: `true` in production (HTTPS only)
- **SameSite**: `Strict` (only sent with same-site requests)
- **MaxAge**: 24 hours
- **Path**: `/` (available site-wide)

## Security Features

### 1. SameSite=Strict Cookies

All CSRF tokens are stored in cookies with `SameSite=Strict` attribute. This ensures:
- Cookies are only sent with same-site requests
- Cross-site requests cannot include the cookie
- Protection against CSRF attacks even without explicit token validation

### 2. Origin/Referer Header Validation

The middleware validates the `Origin` and `Referer` headers to ensure requests come from allowed domains:

```typescript
validateOriginHeaders(origin, referer, allowedOrigins)
```

**Development**: Allows localhost origins  
**Production**: Validates against `ALLOWED_ORIGINS` environment variable

### 3. Constant-Time Token Comparison

Token validation uses `crypto.timingSafeEqual()` to prevent timing attacks:

```typescript
crypto.timingSafeEqual(
  Buffer.from(token),
  Buffer.from(storedToken)
)
```

### 4. Token Refresh

CSRF tokens are refreshed after successful form submissions to prevent token reuse attacks.

## Testing CSRF Protection

### Manual Testing

1. **Valid Request:**
   ```bash
   curl -X POST http://localhost:3000/api/contact \
     -H "Content-Type: application/json" \
     -H "X-CSRF-Token: <token>" \
     -H "Origin: http://localhost:3000" \
     --cookie "csrf-token=<token>" \
     -d '{"name":"Test","email":"test@example.com","subject":"Test","message":"Test"}'
   ```

2. **Invalid Token:**
   ```bash
   curl -X POST http://localhost:3000/api/contact \
     -H "Content-Type: application/json" \
     -H "X-CSRF-Token: invalid-token" \
     -d '{"name":"Test","email":"test@example.com"}'
   ```
   Expected: 403 Forbidden

3. **Missing Origin:**
   ```bash
   curl -X POST http://localhost:3000/api/contact \
     -H "Content-Type: application/json" \
     -H "X-CSRF-Token: <token>" \
     -d '{"name":"Test","email":"test@example.com"}'
   ```
   Expected: 403 Forbidden

### Automated Testing

Consider adding tests for:
- Token generation and validation
- Origin header validation
- Missing token scenarios
- Invalid token scenarios

## Best Practices

1. **Always use CSRF protection** for state-changing operations (POST, PUT, DELETE, PATCH)
2. **Never expose CSRF tokens** in URLs or client-side code (use httpOnly cookies)
3. **Refresh tokens** after successful submissions
4. **Validate Origin/Referer** headers in production
5. **Use HTTPS** in production to ensure secure cookie transmission
6. **Keep tokens short-lived** (24 hours maximum)

## Troubleshooting

### Token Not Loading

**Issue:** `CSRF token not loaded` error

**Solutions:**
- Ensure cookies are enabled in the browser
- Check that the `/api/csrf` endpoint is accessible
- Verify `credentials: 'include'` is set in fetch requests

### 403 Forbidden Errors

**Issue:** All requests return 403

**Solutions:**
- Verify CSRF token is included in `X-CSRF-Token` header
- Check that Origin/Referer headers are set correctly
- Ensure `ALLOWED_ORIGINS` includes your domain in production
- Verify cookie is being sent with requests (`credentials: 'include'`)

### Development vs Production

**Development:**
- Localhost origins are automatically allowed
- Secure cookie flag is disabled

**Production:**
- Must set `ALLOWED_ORIGINS` environment variable
- Secure cookie flag is enabled (requires HTTPS)

## Additional Resources

- [OWASP CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [Next.js Security Best Practices](https://nextjs.org/docs/app/building-your-application/configuring/security-headers)
- [MDN: SameSite Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite)

## Changelog

- **2025-01-XX**: Initial CSRF protection implementation
  - Added CSRF token generation and validation
  - Implemented SameSite=Strict cookies
  - Added Origin/Referer header validation
  - Protected contact form submission endpoint

