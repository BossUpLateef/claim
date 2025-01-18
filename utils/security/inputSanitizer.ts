'use client';

import DOMPurify from 'dompurify';

export const sanitizeInput = {
  text(input: string): string {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: []
    });
  },

  html(input: string): string {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
      ALLOWED_ATTR: ['href', 'target', 'rel']
    });
  },

  object<T extends object>(obj: T): T {
    return Object.entries(obj).reduce((acc, [key, value]) => ({
      ...acc,
      [key]: typeof value === 'string' ? this.text(value) : value
    }), {} as T);
  },

  validateEmail(email: string): boolean {
    const sanitized = this.text(email);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(sanitized);
  }
}; 