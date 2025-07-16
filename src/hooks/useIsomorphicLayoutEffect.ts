import { useEffect, useLayoutEffect } from "react"

// Hook para evitar warnings de hidratação com useLayoutEffect
export const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect
