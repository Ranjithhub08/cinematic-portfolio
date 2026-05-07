import { describe, it, expect, vi } from 'vitest';

describe('Core JS utilities', () => {
  it('trims strings correctly', () => {
    expect('  hello  '.trim()).toBe('hello');
  });
  it('deduplicates arrays', () => {
    expect([...new Set([1, 2, 2, 3])]).toEqual([1, 2, 3]);
  });
  it('spreads objects', () => {
    expect({ ...{ a: 1 }, ...{ b: 2 } }).toEqual({ a: 1, b: 2 });
  });
  it('resolves promises', async () => {
    const val = await Promise.resolve(42);
    expect(val).toBe(42);
  });
  it('handles null coalescing', () => {
    const val = null ?? 'default';
    expect(val).toBe('default');
  });
  it('handles optional chaining', () => {
    const obj = { a: { b: 42 } };
    expect(obj?.a?.b).toBe(42);
    expect(obj?.x?.y).toBeUndefined();
  });
  it('filters falsy values', () => {
    expect([0, 1, '', 'a', null, undefined, 2].filter(Boolean)).toEqual([1, 'a', 2]);
  });
  it('maps arrays', () => {
    expect([1, 2, 3].map(n => n * 2)).toEqual([2, 4, 6]);
  });
  it('reduces arrays', () => {
    expect([1, 2, 3, 4].reduce((a, b) => a + b, 0)).toBe(10);
  });
});
