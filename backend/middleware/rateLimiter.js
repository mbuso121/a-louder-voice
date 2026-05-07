// Simple in-memory rate limiter (no extra deps needed)
// For production scale, swap the store for Redis

const requests = new Map();

function rateLimiter({ windowMs = 15 * 60 * 1000, max = 100, message = "Too many requests" } = {}) {
  return (req, res, next) => {
    const key = req.ip || req.headers["x-forwarded-for"] || "unknown";
    const now = Date.now();
    const record = requests.get(key) || { count: 0, resetAt: now + windowMs };

    if (now > record.resetAt) {
      record.count = 0;
      record.resetAt = now + windowMs;
    }

    record.count += 1;
    requests.set(key, record);

    if (record.count > max) {
      res.setHeader("Retry-After", Math.ceil((record.resetAt - now) / 1000));
      return res.status(429).json({ error: message });
    }

    next();
  };
}

// Strict limiter for auth endpoints — 10 attempts per 15 min
export const authLimiter = rateLimiter({ windowMs: 15 * 60 * 1000, max: 10, message: "Too many login attempts. Try again in 15 minutes." });

// General API limiter — 200 requests per 15 min
export const apiLimiter = rateLimiter({ windowMs: 15 * 60 * 1000, max: 200, message: "Rate limit exceeded." });

// Upload limiter — 20 per hour
export const uploadLimiter = rateLimiter({ windowMs: 60 * 60 * 1000, max: 20, message: "Upload limit reached. Try again in an hour." });

// Submit limiter — 5 submissions per hour
export const submitLimiter = rateLimiter({ windowMs: 60 * 60 * 1000, max: 5, message: "You've reached the submission limit. Please wait an hour before submitting again." });
