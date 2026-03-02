/**
 * In-memory rate limiter for API routes
 * Tracks request counts per IP address with a sliding window
 * 
 * Note: This works per-server-instance. For multi-instance deployments,
 * use Redis or a similar distributed store instead.
 */

const rateLimitStore = new Map();

// Clean up expired entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, data] of rateLimitStore.entries()) {
        if (now - data.windowStart > data.windowMs * 2) {
            rateLimitStore.delete(key);
        }
    }
}, 5 * 60 * 1000);

/**
 * Rate limiter function
 * @param {Request} request - The incoming request
 * @param {Object} options - Rate limit configuration
 * @param {number} options.maxRequests - Maximum requests per window (default: 5)
 * @param {number} options.windowMs - Time window in milliseconds (default: 15 minutes)
 * @param {string} options.keyPrefix - Prefix for rate limit key (default: 'global')
 * @returns {{ success: boolean, remaining: number, retryAfter?: number }}
 */
export function rateLimit(request, options = {}) {
    const {
        maxRequests = 5,
        windowMs = 15 * 60 * 1000,  // 15 minutes
        keyPrefix = 'global',
    } = options;

    // Get client IP from headers
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0]?.trim() ||
        request.headers.get('x-real-ip') ||
        'unknown';

    const key = `${keyPrefix}:${ip}`;
    const now = Date.now();

    let entry = rateLimitStore.get(key);

    if (!entry || now - entry.windowStart > windowMs) {
        // New window
        entry = {
            count: 1,
            windowStart: now,
            windowMs,
        };
        rateLimitStore.set(key, entry);

        return {
            success: true,
            remaining: maxRequests - 1,
        };
    }

    // Within existing window
    entry.count += 1;

    if (entry.count > maxRequests) {
        const retryAfter = Math.ceil((entry.windowStart + windowMs - now) / 1000);
        return {
            success: false,
            remaining: 0,
            retryAfter,
        };
    }

    return {
        success: true,
        remaining: maxRequests - entry.count,
    };
}

/**
 * Create a rate-limited response (429 Too Many Requests)
 * @param {number} retryAfter - Seconds until the client can retry
 * @returns {Response}
 */
export function rateLimitResponse(retryAfter) {
    return Response.json(
        {
            success: false,
            error: `Too many requests. Please try again in ${retryAfter} seconds.`
        },
        {
            status: 429,
            headers: {
                'Retry-After': String(retryAfter),
            },
        }
    );
}
