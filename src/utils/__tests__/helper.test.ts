import { describe, it, expect } from 'vitest';
import { getSlug, getValueFromLanguage, getLanguageExtension } from '../helper';

describe('helper utilities', () => {
  describe('getSlug', () => {
    it('should extract slug from problemset URL', () => {
      const url = 'https://codeforces.com/problemset/problem/2030/A';
      expect(getSlug(url)).toBe('2030/A');
    });

    it('should extract slug from contest URL', () => {
      const url = 'https://codeforces.com/contest/2030/problem/A';
      expect(getSlug(url)).toBe('2030/A');
    });

    it('should extract slug from gym URL', () => {
      const url = 'https://codeforces.com/gym/105846/problem/A';
      expect(getSlug(url)).toBe('105846/A');
    });

    it('should return null for invalid URL', () => {
      const url = 'https://example.com/invalid';
      expect(getSlug(url)).toBe(null);
    });

    it('should return null for malformed URL', () => {
      const url = 'not-a-valid-url';
      expect(getSlug(url)).toBe(null);
    });
  });

  describe('getValueFromLanguage', () => {
    it('should return correct value for cpp', () => {
      expect(getValueFromLanguage('cpp')).toBe('89');
    });

    it('should return correct value for java', () => {
      expect(getValueFromLanguage('java')).toBe('87');
    });

    it('should return correct value for python', () => {
      expect(getValueFromLanguage('python')).toBe('31');
    });

    it('should return correct value for javascript', () => {
      expect(getValueFromLanguage('javascript')).toBe('34');
    });

    it('should return correct value for kotlin', () => {
      expect(getValueFromLanguage('kotlin')).toBe('88');
    });

    it('should return correct value for go', () => {
      expect(getValueFromLanguage('go')).toBe('32');
    });

    it('should return correct value for rust', () => {
      expect(getValueFromLanguage('rust')).toBe('75');
    });

    it('should return correct value for ruby', () => {
      expect(getValueFromLanguage('ruby')).toBe('67');
    });

    it('should return default value for unknown language', () => {
      expect(getValueFromLanguage('unknown')).toBe('89');
    });
  });

  describe('getLanguageExtension', () => {
    it('should return extension with dot prefix', () => {
      expect(getLanguageExtension('cpp')).toBe('.cpp');
      expect(getLanguageExtension('java')).toBe('.java');
      expect(getLanguageExtension('python')).toBe('.python');
    });

    it('should return undefined for empty string', () => {
      expect(getLanguageExtension('')).toBeUndefined();
    });
  });
});
