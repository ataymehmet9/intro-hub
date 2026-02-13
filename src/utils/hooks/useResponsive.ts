import { useEffect, useState } from 'react'

const twBreakpoint: Record<'2xl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs', string> = {
  '2xl': '1536',
  xl: '1280',
  lg: '1024',
  md: '768',
  sm: '640',
  xs: '576',
}

const breakpointInt = (str = '') => {
  return parseInt(str.replace('px', ''))
}

const breakpoint = {
  '2xl': breakpointInt(twBreakpoint['2xl']), // 1536
  xl: breakpointInt(twBreakpoint.xl), // 1280
  lg: breakpointInt(twBreakpoint.lg), // 1024
  md: breakpointInt(twBreakpoint.md), // 768
  sm: breakpointInt(twBreakpoint.sm), // 640
  xs: breakpointInt(twBreakpoint.xs), // 576
}

const useResponsive = () => {
  const getAllSizes = (comparator = 'smaller') => {
    // Check if window is available (client-side)
    if (typeof window === 'undefined') {
      return Object.fromEntries(
        Object.keys(breakpoint).map((key) => [key, false]),
      )
    }

    const currentWindowWidth = window.innerWidth
    return Object.fromEntries(
      Object.entries(breakpoint).map(([key, value]) => [
        key,
        comparator === 'larger'
          ? currentWindowWidth > value
          : currentWindowWidth < value,
      ]),
    )
  }

  const getResponsiveState = () => {
    // Check if window is available (client-side)
    if (typeof window === 'undefined') {
      return {
        windowWidth: 0,
        larger: getAllSizes('larger'),
        smaller: getAllSizes('smaller'),
      }
    }

    const currentWindowWidth = window.innerWidth
    return {
      windowWidth: currentWindowWidth,
      larger: getAllSizes('larger'),
      smaller: getAllSizes('smaller'),
    }
  }

  // Initialize with SSR-safe default state
  const [responsive, setResponsive] = useState(() => ({
    windowWidth: 0,
    larger: Object.fromEntries(
      Object.keys(breakpoint).map((key) => [key, false]),
    ),
    smaller: Object.fromEntries(
      Object.keys(breakpoint).map((key) => [key, false]),
    ),
  }))

  const resizeHandler = () => {
    const responsiveState = getResponsiveState()
    setResponsive(responsiveState)
  }

  useEffect(() => {
    // Update state with actual values on client-side
    setResponsive(getResponsiveState())

    window.addEventListener('resize', resizeHandler)
    return () => window.removeEventListener('resize', resizeHandler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return responsive
}

export default useResponsive
