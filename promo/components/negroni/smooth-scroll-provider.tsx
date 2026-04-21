"use client"

import { useEffect } from "react"

export function SmoothScrollProvider() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth"
    return () => {
      document.documentElement.style.scrollBehavior = "auto"
    }
  }, [])

  return null
}
