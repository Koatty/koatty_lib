/**
 * Regression tests for plan item B-9 (koatty_lib hardening)
 *
 * - SEC-09 / COR-16: escapeHtml emitted the invalid entity `&quote;` for `"`
 *   and did not escape `&`; the inverse function now restores `&amp;` last.
 * - SEC-13: `chmod` default mode hardened '777' -> '755';
 *   `rand` now uses crypto.randomInt (CSPRNG), legacy Math.random version
 *   kept as `randFast`; md5/md5Salt documented as non-password-safe.
 * - SEC-17: `isNumberString` legacy regex backtracked quadratically
 *   (ReDoS) on inputs like `${'1'.repeat(n)}!`; rewritten to a linear,
 *   language-equivalent pattern.
 */

import fs from 'fs';
import {
  chmod,
  escapeHtml,
  escapeSpecial,
  isNumberString,
  md5,
  md5Salt,
  rand,
  randFast,
  unescapeHtml
} from '../../src/lib';

describe('SEC-09 / COR-16: escapeHtml and its inverse', () => {
  it('escapes & first: escapeHtml("&lt;") === "&amp;lt;"', () => {
    expect(escapeHtml('&lt;')).toBe('&amp;lt;');
  });

  it('escapes " as the valid entity &quot; (no more invalid &quote;)', () => {
    expect(escapeHtml('"')).toBe('&quot;');
    expect(escapeHtml('><"')).toBe('&gt;&lt;&quot;');
  });

  it('escapes all five special characters', () => {
    expect(escapeHtml('&<>"\'')).toBe('&amp;&lt;&gt;&quot;&#39;');
  });

  it('script tag output contains no raw <, > or quotes', () => {
    const out = escapeHtml("<script>alert('x')</script>");
    expect(out).toBe('&lt;script&gt;alert(&#39;x&#39;)&lt;/script&gt;');
    expect(out).not.toContain('<');
    expect(out).not.toContain('>');
    expect(out).not.toContain('"');
    expect(out).not.toContain("'");
  });

  it('attribute-context injection is neutralized: no bare double quote', () => {
    const out = escapeHtml('" onmouseover="alert(1)');
    expect(out).toBe('&quot; onmouseover=&quot;alert(1)');
    expect(out).not.toContain('"');
  });

  it('unescapeHtml("&amp;lt;") === "&lt;" (&amp; handled last)', () => {
    expect(unescapeHtml('&amp;lt;')).toBe('&lt;');
    expect(unescapeHtml('&amp;gt;')).toBe('&gt;');
    expect(unescapeHtml('&amp;quot;')).toBe('&quot;');
    expect(unescapeHtml('&amp;#39;')).toBe('&#39;');
    expect(unescapeHtml('&amp;amp;')).toBe('&amp;');
  });

  it('decodes the legacy invalid &quote; entity for backward compatibility', () => {
    // `&quote;` was emitted by historical versions of escapeHtml; it is never
    // produced anymore but is still restored to `"` when decoding legacy data.
    expect(unescapeHtml('&gt;&lt;&quote;')).toBe('><"');
    expect(escapeSpecial('&gt;&lt;&quote;')).toBe('><"');
  });

  it('round-trip: unescapeHtml(escapeHtml(x)) === x', () => {
    const samples = [
      '&',
      '&&&',
      '<>',
      '><"\'',
      'a&b<c>d"e\'f',
      '&amp;lt;',
      '&quot;&quote;&#39;&lt;&gt;',
      '中文测试&<>"\'混合',
      'emoji 🎉🚀 & <script>"hello"</script>',
      'plain text 123 -_',
      ''
    ];
    for (const x of samples) {
      expect(unescapeHtml(escapeHtml(x))).toBe(x);
    }
  });

  it('round-trip also works through the legacy name escapeSpecial', () => {
    const samples = ['&<>"\'', '中文&<>"\'', '🎉 & <b>"b"</b> \'i\''];
    for (const x of samples) {
      expect(escapeSpecial(escapeHtml(x))).toBe(x);
    }
  });
});

describe('SEC-13: rand / randFast / chmod / md5', () => {
  it('rand returns integers within [min, max]', () => {
    for (let i = 0; i < 200; i++) {
      const v = rand(1, 10);
      expect(Number.isInteger(v)).toBe(true);
      expect(v).toBeGreaterThanOrEqual(1);
      expect(v).toBeLessThanOrEqual(10);
    }
  });

  it('rand returns min when min === max', () => {
    expect(rand(5, 5)).toBe(5);
    expect(rand(-3, -3)).toBe(-3);
    expect(rand(0, 0)).toBe(0);
  });

  it('rand never exceeds bounds over 100 calls, including negative ranges', () => {
    for (let i = 0; i < 100; i++) {
      const v = rand(-100, -10);
      expect(Number.isInteger(v)).toBe(true);
      expect(v).toBeGreaterThanOrEqual(-100);
      expect(v).toBeLessThanOrEqual(-10);
    }
  });

  it('rand rounds non-integer bounds into the requested range', () => {
    for (let i = 0; i < 50; i++) {
      const v = rand(1.2, 2.8);
      expect(Number.isInteger(v)).toBe(true);
      expect(v).toBeGreaterThanOrEqual(Math.ceil(1.2));
      expect(v).toBeLessThanOrEqual(Math.floor(2.8));
    }
  });

  it('rand returns min when max < min', () => {
    expect(rand(10, 1)).toBe(10);
    expect(rand(2.9, 1.1)).toBe(3); // rounded min
  });

  it('rand rejects non-finite arguments', () => {
    expect(() => rand(NaN, 1)).toThrow(TypeError);
    expect(() => rand(1, Infinity)).toThrow(TypeError);
  });

  it('randFast returns integers within [min, max] (non-secure legacy path)', () => {
    for (let i = 0; i < 100; i++) {
      const v = randFast(1, 10);
      expect(Number.isInteger(v)).toBe(true);
      expect(v).toBeGreaterThanOrEqual(1);
      expect(v).toBeLessThanOrEqual(10);
    }
  });

  it('chmod defaults to mode 755 instead of 777 (fs mocked)', async () => {
    const statResult = { isFile: () => true, isDirectory: () => false };
    const statSpy = jest.spyOn(fs, 'stat').mockImplementation(((p: any, cb: any) => cb(null, statResult)) as any);
    const chmodSpy = jest.spyOn(fs, 'chmod').mockImplementation(((p: any, mode: any, cb: any) => cb(null)) as any);
    try {
      const res = await chmod('/tmp/koatty-sec13-fake-path');
      expect(chmodSpy).toHaveBeenCalledWith('/tmp/koatty-sec13-fake-path', '755', expect.any(Function));
      expect(statSpy).toHaveBeenCalled();
      expect(res).toBe(statResult);
    } finally {
      statSpy.mockRestore();
      chmodSpy.mockRestore();
    }
  });

  it('chmod honors an explicitly provided mode (fs mocked)', async () => {
    const statSpy = jest.spyOn(fs, 'stat').mockImplementation(((p: any, cb: any) => cb(null, {})) as any);
    const chmodSpy = jest.spyOn(fs, 'chmod').mockImplementation(((p: any, mode: any, cb: any) => cb(null)) as any);
    try {
      await chmod('/tmp/koatty-sec13-fake-path', '600');
      expect(chmodSpy).toHaveBeenCalledWith('/tmp/koatty-sec13-fake-path', '600', expect.any(Function));
    } finally {
      statSpy.mockRestore();
      chmodSpy.mockRestore();
    }
  });

  it('md5/md5Salt outputs are unchanged (only their JSDoc was hardened)', () => {
    expect(md5('abcde')).toBe('ab56b4d92b40713acc5af89985d4b786');
    expect(md5Salt('abcde')).toBe('7f7d52a001b9d2c71b6bae1f189f41f3');
  });
});

describe('SEC-17: isNumberString hardening', () => {
  it('preserves matching behavior for valid number strings', () => {
    const valid = [
      '0', '1', '123', '-1', '-123', '1.5', '.5', '5.', '.',
      '007', '0123', '0x1f', '0X1F', '0xdeadbeef',
      '1e5', '1E5', '1e+5', '1e-5', '-1.5e-5',
      // historical laxity preserved on purpose (legacy behavior):
      '1e', '1e5.5', '1e.5', '1.'
    ];
    for (const s of valid) {
      expect(isNumberString(s)).toBe(true);
    }
  });

  it('preserves rejecting invalid number strings', () => {
    const invalid = [
      '', ' ', 'abc', '1ab', '1.2.3', '+1', '1 2', 'NaN', 'Infinity',
      '0x', '0xg', '--1', '1e++5', '1..2', '1,5', '0b101'
    ];
    for (const s of invalid) {
      expect(isNumberString(s)).toBe(false);
    }
  });

  it('rejects non-string inputs', () => {
    expect(isNumberString(1 as any)).toBe(false);
    expect(isNumberString(null as any)).toBe(false);
    expect(isNumberString(undefined as any)).toBe(false);
    expect(isNumberString(['1'] as any)).toBe(false);
    expect(isNumberString(Symbol('1') as any)).toBe(false);
  });

  it('runs in linear time on adversarial input (no quadratic backtracking)', () => {
    // Input shape that forced O(n^2) split-backtracking in the legacy regex.
    const mk = (n: number) => `${'1'.repeat(n)}!`;
    const measure = (n: number) => {
      const s = mk(n);
      let best = Infinity;
      for (let i = 0; i < 3; i++) {
        const t0 = process.hrtime.bigint();
        isNumberString(s);
        const t1 = process.hrtime.bigint();
        best = Math.min(best, Number(t1 - t0) / 1e6);
      }
      return best;
    };

    isNumberString(mk(2000)); // warmup
    const t10k = measure(10000);
    const t40k = measure(40000);
    const t80k = measure(80000);
    // eslint-disable-next-line no-console
    console.log(
      `[SEC-17 benchmark] 10k=${t10k.toFixed(3)}ms 40k=${t40k.toFixed(3)}ms ` +
      `80k=${t80k.toFixed(3)}ms | ratios 40k/10k=${(t40k / t10k).toFixed(2)} ` +
      `(linear~4, legacy quadratic~16), 80k/40k=${(t80k / t40k).toFixed(2)} (linear~2, quadratic~4)`
    );

    // Linear scaling: quadrupling length -> ~4x, doubling -> ~2x.
    // The legacy regex scaled 16x / 4x. Generous bounds avoid CI flakiness.
    expect(t40k / t10k).toBeLessThan(10);
    expect(t80k / t40k).toBeLessThan(6);
    // Absolute sanity cap: the legacy regex needed several seconds at 80k.
    expect(t80k).toBeLessThan(1000);
  });
});
