import { getReleaseUrgencyTier } from './release-urgency';

describe('getReleaseUrgencyTier', () => {
  it('returns 0 for an already-released game', () => {
    expect(getReleaseUrgencyTier(-1)).toBe(0);
  });

  it('returns 1 for today/tomorrow (< 2 days)', () => {
    expect(getReleaseUrgencyTier(0)).toBe(1);
    expect(getReleaseUrgencyTier(1)).toBe(1);
  });

  it('returns 2 for this week (< 7 days)', () => {
    expect(getReleaseUrgencyTier(2)).toBe(2);
    expect(getReleaseUrgencyTier(6)).toBe(2);
  });

  it('returns 3 for this month (< 30 days)', () => {
    expect(getReleaseUrgencyTier(7)).toBe(3);
    expect(getReleaseUrgencyTier(29)).toBe(3);
  });

  it('returns 4 for the next 3 months (< 90 days)', () => {
    expect(getReleaseUrgencyTier(30)).toBe(4);
    expect(getReleaseUrgencyTier(89)).toBe(4);
  });

  it('returns 5 for the next 6 months (< 180 days)', () => {
    expect(getReleaseUrgencyTier(90)).toBe(5);
    expect(getReleaseUrgencyTier(179)).toBe(5);
  });

  it('returns 6 for the next year (< 365 days)', () => {
    expect(getReleaseUrgencyTier(180)).toBe(6);
    expect(getReleaseUrgencyTier(364)).toBe(6);
  });

  it('returns 7 for anything a year or further out', () => {
    expect(getReleaseUrgencyTier(365)).toBe(7);
    expect(getReleaseUrgencyTier(1000)).toBe(7);
  });
});
