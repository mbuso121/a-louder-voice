// Input sanitization — strip HTML tags and trim strings
// Prevents XSS stored in the database

function stripTags(str) {
  if (typeof str !== "string") return str;
  return str
    .replace(/<[^>]*>/g, "")       // strip HTML tags
    .replace(/javascript:/gi, "")   // remove JS protocol
    .replace(/on\w+\s*=/gi, "")     // remove event handlers
    .trim();
}

function sanitizeObject(obj) {
  if (!obj || typeof obj !== "object") return obj;
  const clean = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      clean[key] = stripTags(value);
    } else if (typeof value === "object" && !Array.isArray(value)) {
      clean[key] = sanitizeObject(value);
    } else if (Array.isArray(value)) {
      clean[key] = value.map(v => typeof v === "string" ? stripTags(v) : v);
    } else {
      clean[key] = value;
    }
  }
  return clean;
}

export const sanitizeBody = (req, res, next) => {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  next();
};
