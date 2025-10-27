import { describe, it, expect, beforeEach, vi } from 'vitest';
import { logger, Logger } from '../logger';

describe('Logger', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  describe('singleton instance', () => {
    it('should create a logger instance', () => {
      expect(logger).toBeDefined();
      expect(logger).toBeInstanceOf(Logger);
    });
  });

  describe('log methods', () => {
    it('should call console.log for log method', () => {
      const consoleSpy = vi.spyOn(console, 'log');
      logger.setEnabled(true);
      logger.log('test message');
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('should call console.info for info method', () => {
      const consoleSpy = vi.spyOn(console, 'info');
      logger.setEnabled(true);
      logger.info('test info');
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('should call console.warn for warn method', () => {
      const consoleSpy = vi.spyOn(console, 'warn');
      logger.setEnabled(true);
      logger.warn('test warning');
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('should always call console.error for error method', () => {
      const consoleSpy = vi.spyOn(console, 'error');
      logger.setEnabled(false);
      logger.error('test error');
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe('enabled/disabled behavior', () => {
    it('should not log when disabled', () => {
      const consoleSpy = vi.spyOn(console, 'log');
      logger.setEnabled(false);
      logger.log('should not appear');
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('should log when enabled', () => {
      const consoleSpy = vi.spyOn(console, 'log');
      logger.setEnabled(true);
      logger.log('should appear');
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe('configuration', () => {
    it('should allow setting timestamp inclusion', () => {
      const customLogger = new Logger({ includeTimestamp: false });
      expect(customLogger).toBeDefined();
    });

    it('should allow custom configuration', () => {
      const customLogger = new Logger({
        enabled: false,
        includeTimestamp: false,
      });
      expect(customLogger).toBeDefined();
    });
  });
});
