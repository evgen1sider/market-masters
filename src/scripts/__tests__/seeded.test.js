const { LCG, hashStringToSeed } = require('../test-helpers/seeded.cjs');

describe('seeded LCG and hash', () => {
  test('LCG produces deterministic sequence for a given seed', () => {
    const r1 = LCG(12345);
    const seq1 = [r1(), r1(), r1(), r1()];
    const r2 = LCG(12345);
    const seq2 = [r2(), r2(), r2(), r2()];
    expect(seq1).toEqual(seq2);
  });

  test('hashStringToSeed returns consistent unsigned 32-bit int', () => {
    const s1 = hashStringToSeed('2025-10-07');
    const s2 = hashStringToSeed('2025-10-07');
    expect(typeof s1).toBe('number');
    expect(s1).toBe(s2);
    expect(Number.isInteger(s1)).toBe(true);
    expect(s1).toBeGreaterThanOrEqual(0);
  });
});
