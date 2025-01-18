'use client';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

class RateLimiter {
  private requests: Map<string, number[]>;
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.requests = new Map();
    this.config = config;
  }

  isRateLimited(clientId: string): boolean {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;
    
    // Get or initialize request timestamps for this client
    const timestamps = this.requests.get(clientId) || [];
    
    // Filter out old requests
    const recentRequests = timestamps.filter(time => time > windowStart);
    
    // Update requests for this client
    this.requests.set(clientId, recentRequests);
    
    // Check if rate limit is exceeded
    if (recentRequests.length >= this.config.maxRequests) {
      return true;
    }
    
    // Add new request timestamp
    recentRequests.push(now);
    this.requests.set(clientId, recentRequests);
    
    return false;
  }

  getRemainingRequests(clientId: string): number {
    const timestamps = this.requests.get(clientId) || [];
    return Math.max(0, this.config.maxRequests - timestamps.length);
  }
}

export const rateLimiter = new RateLimiter({
  maxRequests: 100,
  windowMs: 60000 // 1 minute
}); 