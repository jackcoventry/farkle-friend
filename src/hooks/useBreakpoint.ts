'use client';

import { useEffect, useMemo, useState } from 'react';

const BREAKPOINTS = {
  sm: '40rem',
  md: '48rem',
  lg: '64rem',
  xl: '80rem',
} as const;

const BREAKPOINT_ORDER = ['base', 'sm', 'md', 'lg', 'xl'] as const;

type ActiveBreakpoint = (typeof BREAKPOINT_ORDER)[number];
type Breakpoint = Exclude<ActiveBreakpoint, 'base'>;

function getActiveBreakpoint(): ActiveBreakpoint {
  if (typeof window === 'undefined') return 'base';

  if (window.matchMedia(`(min-width: ${BREAKPOINTS.xl})`).matches) return 'xl';
  if (window.matchMedia(`(min-width: ${BREAKPOINTS.lg})`).matches) return 'lg';
  if (window.matchMedia(`(min-width: ${BREAKPOINTS.md})`).matches) return 'md';
  if (window.matchMedia(`(min-width: ${BREAKPOINTS.sm})`).matches) return 'sm';

  return 'base';
}

export function useBreakpoint() {
  const [activeBreakpoint, setActiveBreakpoint] = useState<ActiveBreakpoint>('base');

  useEffect(() => {
    const queries = Object.values(BREAKPOINTS).map((value) =>
      window.matchMedia(`(min-width: ${value})`)
    );

    const updateBreakpoint = () => {
      setActiveBreakpoint(getActiveBreakpoint());
    };

    updateBreakpoint();

    queries.forEach((query) => {
      query.addEventListener('change', updateBreakpoint);
    });

    return () => {
      queries.forEach((query) => {
        query.removeEventListener('change', updateBreakpoint);
      });
    };
  }, []);

  return useMemo(() => {
    const activeIndex = BREAKPOINT_ORDER.indexOf(activeBreakpoint);

    return {
      activeBreakpoint,

      isBase: activeBreakpoint === 'base',
      isSm: activeBreakpoint === 'sm',
      isMd: activeBreakpoint === 'md',
      isLg: activeBreakpoint === 'lg',
      isXl: activeBreakpoint === 'xl',

      isAtLeast: (breakpoint: Breakpoint) => activeIndex >= BREAKPOINT_ORDER.indexOf(breakpoint),

      isBelow: (breakpoint: Breakpoint) => activeIndex < BREAKPOINT_ORDER.indexOf(breakpoint),
    };
  }, [activeBreakpoint]);
}
