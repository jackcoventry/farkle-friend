import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useBreakpoint } from './useBreakpoint';

type BreakpointName = 'base' | 'sm' | 'md' | 'lg' | 'xl';

type ChangeListener = (event: MediaQueryListEvent) => void;

type MockMediaQueryList = MediaQueryList & {
  triggerChange: (matches: boolean) => void;
};

const mediaQueries = new Map<string, MockMediaQueryList>();

function createMediaQueryList(query: string): MockMediaQueryList {
  let matches = false;
  const listeners = new Set<ChangeListener>();

  const mediaQueryList = {
    media: query,

    get matches() {
      return matches;
    },

    onchange: null,

    addEventListener: vi.fn((type: string, listener: EventListenerOrEventListenerObject | null) => {
      if (type !== 'change' || listener === null) return;

      if (typeof listener === 'function') {
        listeners.add(listener as ChangeListener);
      }
    }),

    removeEventListener: vi.fn(
      (type: string, listener: EventListenerOrEventListenerObject | null) => {
        if (type !== 'change' || listener === null) return;

        if (typeof listener === 'function') {
          listeners.delete(listener as ChangeListener);
        }
      }
    ),

    addListener: vi.fn(),
    removeListener: vi.fn(),

    dispatchEvent: vi.fn(() => true),

    triggerChange(nextMatches: boolean) {
      matches = nextMatches;

      const event = {
        matches,
        media: query,
      } as MediaQueryListEvent;

      listeners.forEach((listener) => {
        listener(event);
      });
    },
  } as MockMediaQueryList;

  return mediaQueryList;
}

function createMatchMediaMock() {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => {
      const existingMediaQueryList = mediaQueries.get(query);
      if (existingMediaQueryList) return existingMediaQueryList;

      const mediaQueryList = createMediaQueryList(query);

      mediaQueries.set(query, mediaQueryList);

      return mediaQueryList;
    })
  );
}

function setBreakpoint(breakpoint: BreakpointName) {
  const states = {
    base: { sm: false, md: false, lg: false, xl: false },
    sm: { sm: true, md: false, lg: false, xl: false },
    md: { sm: true, md: true, lg: false, xl: false },
    lg: { sm: true, md: true, lg: true, xl: false },
    xl: { sm: true, md: true, lg: true, xl: true },
  } satisfies Record<BreakpointName, Record<Exclude<BreakpointName, 'base'>, boolean>>;

  mediaQueries.get('(min-width: 40rem)')?.triggerChange(states[breakpoint].sm);
  mediaQueries.get('(min-width: 48rem)')?.triggerChange(states[breakpoint].md);
  mediaQueries.get('(min-width: 64rem)')?.triggerChange(states[breakpoint].lg);
  mediaQueries.get('(min-width: 80rem)')?.triggerChange(states[breakpoint].xl);
}

describe('useBreakpoint', () => {
  beforeEach(() => {
    mediaQueries.clear();
    vi.unstubAllGlobals();
    createMatchMediaMock();
  });

  it('returns base by default', () => {
    const { result } = renderHook(() => useBreakpoint());

    expect(result.current.activeBreakpoint).toBe('base');
    expect(result.current.isBase).toBe(true);
    expect(result.current.isSm).toBe(false);
    expect(result.current.isMd).toBe(false);
    expect(result.current.isLg).toBe(false);
    expect(result.current.isXl).toBe(false);
  });

  it('detects the sm breakpoint', () => {
    const { result } = renderHook(() => useBreakpoint());

    act(() => {
      setBreakpoint('sm');
    });

    expect(result.current.activeBreakpoint).toBe('sm');
    expect(result.current.isSm).toBe(true);
  });

  it('detects the md breakpoint', () => {
    const { result } = renderHook(() => useBreakpoint());

    act(() => {
      setBreakpoint('md');
    });

    expect(result.current.activeBreakpoint).toBe('md');
    expect(result.current.isMd).toBe(true);
  });

  it('detects the lg breakpoint', () => {
    const { result } = renderHook(() => useBreakpoint());

    act(() => {
      setBreakpoint('lg');
    });

    expect(result.current.activeBreakpoint).toBe('lg');
    expect(result.current.isLg).toBe(true);
  });

  it('detects the xl breakpoint', () => {
    const { result } = renderHook(() => useBreakpoint());

    act(() => {
      setBreakpoint('xl');
    });

    expect(result.current.activeBreakpoint).toBe('xl');
    expect(result.current.isXl).toBe(true);
  });

  it('supports isAtLeast', () => {
    const { result } = renderHook(() => useBreakpoint());

    act(() => {
      setBreakpoint('lg');
    });

    expect(result.current.isAtLeast('sm')).toBe(true);
    expect(result.current.isAtLeast('md')).toBe(true);
    expect(result.current.isAtLeast('lg')).toBe(true);
    expect(result.current.isAtLeast('xl')).toBe(false);
  });

  it('supports isBelow', () => {
    const { result } = renderHook(() => useBreakpoint());

    act(() => {
      setBreakpoint('md');
    });

    expect(result.current.isBelow('sm')).toBe(false);
    expect(result.current.isBelow('md')).toBe(false);
    expect(result.current.isBelow('lg')).toBe(true);
    expect(result.current.isBelow('xl')).toBe(true);
  });

  it('removes media query listeners on unmount', () => {
    const { unmount } = renderHook(() => useBreakpoint());

    const queries = Array.from(mediaQueries.values());

    unmount();

    queries.forEach((query) => {
      expect(query.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    });
  });
});
