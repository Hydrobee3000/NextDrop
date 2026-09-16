import {
  buildParentPlatformsParam,
  gameMatchesPlatformFilter,
  isPlatformExcluded,
  platformIsActive,
  platformMatchesFilter,
} from './platform-filter';

describe('platformMatchesFilter', () => {
  it('matches everything when the filter is "all"', () => {
    expect(platformMatchesFilter('PlayStation 5', 'all')).toBe(true);
    expect(platformMatchesFilter('Xbox Series S/X', 'all')).toBe(true);
  });

  it('matches a platform to its filter key', () => {
    expect(platformMatchesFilter('PC', 'pc')).toBe(true);
    expect(platformMatchesFilter('Nintendo Switch', 'switch')).toBe(true);
    expect(platformMatchesFilter('macOS', 'apple')).toBe(true);
    expect(platformMatchesFilter('iOS', 'apple')).toBe(true);
  });

  it('does not match an unrelated platform', () => {
    expect(platformMatchesFilter('PlayStation 5', 'pc')).toBe(false);
  });
});

describe('isPlatformExcluded', () => {
  it('is false when nothing is excluded', () => {
    expect(isPlatformExcluded('PC', [])).toBe(false);
  });

  it('is true when the platform matches one of the excluded filters', () => {
    expect(isPlatformExcluded('Android', ['apple', 'android'])).toBe(true);
  });

  it('is false when the platform matches none of the excluded filters', () => {
    expect(isPlatformExcluded('PC', ['apple', 'android'])).toBe(false);
  });
});

describe('buildParentPlatformsParam', () => {
  it('returns the RAWG id for a single active filter, ignoring exclusions', () => {
    expect(buildParentPlatformsParam('pc', ['android'])).toBe('1');
  });

  it('returns undefined for "all" with no exclusions', () => {
    expect(buildParentPlatformsParam('all', [])).toBeUndefined();
  });

  it('returns every platform id except the excluded ones for "all"', () => {
    expect(buildParentPlatformsParam('all', ['android', 'apple'])).toBe('1,2,3,7,14');
  });
});

describe('platformIsActive', () => {
  it('behaves like platformMatchesFilter for a single active filter', () => {
    expect(platformIsActive('PC', 'pc', [])).toBe(true);
    expect(platformIsActive('PlayStation 5', 'pc', [])).toBe(false);
  });

  it('highlights everything in "all" mode with no exclusions', () => {
    expect(platformIsActive('PC', 'all', [])).toBe(true);
  });

  it('highlights only non-excluded platforms in "all" mode', () => {
    expect(platformIsActive('PC', 'all', ['pc'])).toBe(false);
    expect(platformIsActive('PlayStation 5', 'all', ['pc'])).toBe(true);
  });
});

describe('gameMatchesPlatformFilter', () => {
  it('matches when any platform fits a single active filter', () => {
    expect(gameMatchesPlatformFilter(['PlayStation 5', 'Xbox Series S/X'], 'pc', [])).toBe(false);
    expect(gameMatchesPlatformFilter(['PC', 'PlayStation 5'], 'pc', [])).toBe(true);
  });

  it('matches everything in "all" mode with no exclusions', () => {
    expect(gameMatchesPlatformFilter(['PC'], 'all', [])).toBe(true);
  });

  it('excludes a game whose only platforms are all excluded', () => {
    expect(gameMatchesPlatformFilter(['PC'], 'all', ['pc'])).toBe(false);
  });

  it('keeps a game that has at least one non-excluded platform', () => {
    expect(gameMatchesPlatformFilter(['PC', 'PlayStation 5'], 'all', ['pc'])).toBe(true);
  });
});
