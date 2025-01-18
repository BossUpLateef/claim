'use client';

import React, { useEffect, useState } from 'react';

interface A11yAnnouncerProps {
  message: string;
  assertive?: boolean;
}

export function A11yAnnouncer({ message, assertive = false }: A11yAnnouncerProps) {
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    if (message) {
      setAnnouncement(message);
      const timer = setTimeout(() => setAnnouncement(''), 1000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div
      aria-live={assertive ? 'assertive' : 'polite'}
      className="sr-only"
      role="status"
      aria-atomic="true"
    >
      {announcement}
    </div>
  );
} 