import { describe, it, expect, beforeEach } from 'vitest';
import { Queue } from '../Queue';

describe('Queue', () => {
  let queue: Queue<number>;

  beforeEach(() => {
    queue = new Queue<number>();
  });

  describe('add', () => {
    it('should add items to the queue', () => {
      queue.add(1);
      queue.add(2);
      queue.add(3);

      expect(queue.size()).toBe(3);
      expect(queue.isEmpty()).toBe(false);
    });

    it('should update head and tail correctly', () => {
      queue.add(1);
      expect(queue.peek()).toBe(1);
      
      queue.add(2);
      expect(queue.peek()).toBe(1); // Head should still be 1
    });
  });

  describe('remove', () => {
    it('should remove items in FIFO order', () => {
      queue.add(1);
      queue.add(2);
      queue.add(3);

      expect(queue.remove()).toBe(1);
      expect(queue.remove()).toBe(2);
      expect(queue.remove()).toBe(3);
    });

    it('should return null when queue is empty', () => {
      expect(queue.remove()).toBe(null);
    });

    it('should update size correctly', () => {
      queue.add(1);
      queue.add(2);
      
      expect(queue.size()).toBe(2);
      queue.remove();
      expect(queue.size()).toBe(1);
      queue.remove();
      expect(queue.size()).toBe(0);
    });
  });

  describe('peek', () => {
    it('should return the first item without removing it', () => {
      queue.add(1);
      queue.add(2);

      expect(queue.peek()).toBe(1);
      expect(queue.size()).toBe(2);
    });

    it('should return null when queue is empty', () => {
      expect(queue.peek()).toBe(null);
    });
  });

  describe('isEmpty', () => {
    it('should return true for empty queue', () => {
      expect(queue.isEmpty()).toBe(true);
    });

    it('should return false for non-empty queue', () => {
      queue.add(1);
      expect(queue.isEmpty()).toBe(false);
    });
  });

  describe('clear', () => {
    it('should clear all items from the queue', () => {
      queue.add(1);
      queue.add(2);
      queue.add(3);

      queue.clear();

      expect(queue.isEmpty()).toBe(true);
      expect(queue.size()).toBe(0);
      expect(queue.peek()).toBe(null);
    });
  });

  describe('toJSON and fromJSON', () => {
    it('should serialize queue to JSON', () => {
      queue.add(1);
      queue.add(2);
      queue.add(3);

      const json = queue.toJSON();
      expect(JSON.parse(json)).toEqual([1, 2, 3]);
    });

    it('should deserialize queue from JSON', () => {
      const items = [1, 2, 3];
      const newQueue = Queue.fromJSON<number>(items);

      expect(newQueue.size()).toBe(3);
      expect(newQueue.remove()).toBe(1);
      expect(newQueue.remove()).toBe(2);
      expect(newQueue.remove()).toBe(3);
    });

    it('should handle empty array', () => {
      const newQueue = Queue.fromJSON<number>([]);
      expect(newQueue.isEmpty()).toBe(true);
    });
  });
});
