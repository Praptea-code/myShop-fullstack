import { useState, useEffect } from 'react'
 
export function useWindowWidth() {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return width
}
 
export function useIsMobile() { return useWindowWidth() < 768 }
export function useIsTablet() { return useWindowWidth() < 1024 }