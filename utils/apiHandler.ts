'use client';

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

import { rateLimiter } from './security/rateLimit';
import { sanitizeInput } from './security/inputSanitizer';
import { auditLogger } from './security/auditLogger';
import { encryption } from './security/encryption';

export const apiHandler = {
  async get<T>(url: string, options = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        ...options,
      });

      if (!response.ok) {
        throw new ApiError(
          'API request failed',
          response.status,
          await response.json()
        );
      }

      const data = await response.json();
      return { data, error: null, status: response.status };
    } catch (error) {
      if (error instanceof ApiError) {
        return {
          data: null,
          error: error.message,
          status: error.status,
        };
      }
      return {
        data: null,
        error: 'An unexpected error occurred',
        status: 500,
      };
    }
  },

  async post<T>(url: string, body: any, options = {}): Promise<ApiResponse<T>> {
    const clientId = 'user-session-id'; // Replace with actual user/session ID

    if (rateLimiter.isRateLimited(clientId)) {
      return {
        data: null,
        error: 'Too many requests. Please try again later.',
        status: 429
      };
    }

    // Sanitize input
    const sanitizedBody = sanitizeInput.object(body);

    // Log the request
    auditLogger.log('API_REQUEST', clientId, {
      url,
      method: 'POST',
      body: sanitizedBody
    });

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sanitizedBody),
        ...options,
      });

      const data = await response.json();

      // Log the response
      auditLogger.log('API_RESPONSE', clientId, {
        url,
        status: response.status,
        data
      });

      return {
        data: encryption.encrypt(data),
        error: null,
        status: response.status
      };
    } catch (error) {
      auditLogger.log('API_ERROR', clientId, {
        url,
        error: error.message
      });

      return {
        data: null,
        error: 'An unexpected error occurred',
        status: 500
      };
    }
  }
}; 