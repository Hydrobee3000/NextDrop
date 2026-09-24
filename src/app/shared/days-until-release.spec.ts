import { getDaysUntilRelease } from './days-until-release';

describe('getDaysUntilRelease', () => {
  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date('2026-01-01T00:00:00.000Z'));
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('returns null when there is no release date', () => {
    expect(getDaysUntilRelease(null)).toBeNull();
  });

  it('returns 0 when the release date is today', () => {
    expect(getDaysUntilRelease('2026-01-01')).toBe(0);
  });

  it('returns a positive count for a future release date', () => {
    expect(getDaysUntilRelease('2026-01-05')).toBe(4);
  });

  it('returns a negative count for an already-released game', () => {
    expect(getDaysUntilRelease('2025-12-30')).toBe(-2);
  });

  it('rounds a partial day up (ceil), not down', () => {
    jasmine.clock().mockDate(new Date('2026-01-01T12:00:00.000Z'));
    // Half a day away — ceil should push this to 1, not 0.
    expect(getDaysUntilRelease('2026-01-02')).toBe(1);
  });
});
