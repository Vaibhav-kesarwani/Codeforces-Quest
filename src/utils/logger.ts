/**
 * Logger utility for consistent logging across the application
 * Can be toggled off in production environments
 */

type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';

interface LoggerConfig {
  enabled: boolean;
  level: LogLevel;
  includeTimestamp: boolean;
}

class Logger {
  private config: LoggerConfig;

  constructor(config?: Partial<LoggerConfig>) {
    this.config = {
      enabled: process.env.NODE_ENV !== 'production',
      level: 'log',
      includeTimestamp: true,
      ...config,
    };
  }

  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = this.config.includeTimestamp 
      ? `[${new Date().toISOString()}]` 
      : '';
    const levelPrefix = `[${level.toUpperCase()}]`;
    return `${timestamp} ${levelPrefix} ${message}`;
  }

  private shouldLog(): boolean {
    return this.config.enabled;
  }

  log(message: string, ...args: unknown[]): void {
    if (this.shouldLog()) {
      console.log(this.formatMessage('log', message), ...args);
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (this.shouldLog()) {
      console.info(this.formatMessage('info', message), ...args);
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.shouldLog()) {
      console.warn(this.formatMessage('warn', message), ...args);
    }
  }

  error(message: string, ...args: unknown[]): void {
    // Always log errors, even in production
    console.error(this.formatMessage('error', message), ...args);
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.shouldLog()) {
      console.debug(this.formatMessage('debug', message), ...args);
    }
  }

  setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;
  }

  setLevel(level: LogLevel): void {
    this.config.level = level;
  }

  setIncludeTimestamp(include: boolean): void {
    this.config.includeTimestamp = include;
  }
}

// Export a singleton instance
export const logger = new Logger();

// Export the class for custom instances if needed
export { Logger };
export type { LogLevel, LoggerConfig };
