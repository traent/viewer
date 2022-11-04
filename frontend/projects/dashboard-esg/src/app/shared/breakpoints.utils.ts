import { BreakpointState } from '@angular/cdk/layout';

export enum TWBreakpoint {
  xs = 'xs',
  sm = 'sm',
  md = 'md',
  lg = 'lg',
  xl = 'xl',
  '2xl' = '2xl',
}

export const BreakpointsQuery = [
  '(max-width: 429px)',
  '(min-width: 430px) and (max-width: 767px)',
  '(min-width: 768px) and (max-width: 1023px)',
  '(min-width: 1024px) and (max-width: 1279px)',
  '(min-width: 1280px) and (max-width: 1535px)',
  '(min-width: 1536px)',
];

export const breakpointsMapper = (breakpointState: BreakpointState): TWBreakpoint => {
  if (breakpointState.breakpoints['(max-width: 429px)']) {
    return TWBreakpoint.xs;
  }
  if (breakpointState.breakpoints['(min-width: 430px) and (max-width: 767px)']) {
    return TWBreakpoint.sm;
  }
  if (breakpointState.breakpoints['(min-width: 768px) and (max-width: 1023px)']) {
    return TWBreakpoint.md;
  }
  if (breakpointState.breakpoints['(min-width: 1024px) and (max-width: 1279px)']) {
    return TWBreakpoint.lg;
  }
  if (breakpointState.breakpoints['(min-width: 1280px) and (max-width: 1535px)']) {
    return TWBreakpoint.xl;
  } else {
    return TWBreakpoint['2xl'];
  }
};
