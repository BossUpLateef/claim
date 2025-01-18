'use client';

interface AuditLog {
  timestamp: string;
  action: string;
  userId: string;
  details: any;
  ipAddress?: string;
  userAgent?: string;
}

class AuditLogger {
  private logs: AuditLog[] = [];
  private readonly MAX_LOGS = 1000;

  log(action: string, userId: string, details: any) {
    const logEntry: AuditLog = {
      timestamp: new Date().toISOString(),
      action,
      userId,
      details,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined
    };

    this.logs.push(logEntry);
    
    // Prevent memory leaks by limiting log size
    if (this.logs.length > this.MAX_LOGS) {
      this.logs = this.logs.slice(-this.MAX_LOGS);
    }

    // In production, you'd want to send this to your backend
    if (process.env.NODE_ENV === 'production') {
      this.persistLog(logEntry);
    }

    return logEntry;
  }

  private async persistLog(logEntry: AuditLog) {
    try {
      await fetch('/api/audit-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logEntry),
      });
    } catch (error) {
      console.error('Failed to persist audit log:', error);
    }
  }

  getLogs(filters?: Partial<AuditLog>) {
    return this.logs.filter(log => 
      Object.entries(filters || {}).every(([key, value]) => 
        log[key as keyof AuditLog] === value
      )
    );
  }
}

export const auditLogger = new AuditLogger(); 