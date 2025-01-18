'use client';

import CryptoJS from 'crypto-js';

export class Encryption {
  private readonly key: string;

  constructor(key = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'default-key') {
    this.key = key;
  }

  encrypt(data: any): string {
    const stringData = typeof data === 'string' ? data : JSON.stringify(data);
    return CryptoJS.AES.encrypt(stringData, this.key).toString();
  }

  decrypt(encryptedData: string): any {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, this.key);
      const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
      try {
        return JSON.parse(decryptedString);
      } catch {
        return decryptedString;
      }
    } catch (error) {
      console.error('Decryption failed:', error);
      return null;
    }
  }

  // For sensitive data in localStorage
  secureStorage = {
    setItem: (key: string, value: any) => {
      const encrypted = this.encrypt(value);
      localStorage.setItem(key, encrypted);
    },

    getItem: (key: string) => {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;
      return this.decrypt(encrypted);
    },

    removeItem: (key: string) => {
      localStorage.removeItem(key);
    }
  };
}

export const encryption = new Encryption(); 