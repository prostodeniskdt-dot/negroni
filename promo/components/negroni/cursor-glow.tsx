"use client"

import { useEffect, useRef } from "react"

export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const glow = glowRef.current
    if (!glow) return

    let mouseX = 0
    let mouseY = 0
    let currentX = 0
    let currentY = 0

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const animate = () => {
      currentX += (mouseX - currentX) * 0.08
      currentY += (mouseY - currentY) * 0.08
      glow.style.transform = `translate(${currentX - 200}px, ${currentY - 200}px)`
      requestAnimationFrame(animate)
    }

    window.addEventListener("mousemove", onMouseMove)
    const raf = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={glowRef}
      className="fixed top-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none z-[9999] opacity-0 md:opacity-100 transition-opacity"
      style={{
        background:
          "radial-gradient(circle, hsl(18 85% 45% / 0.06) 0%, transparent 70%)",
        willChange: "transform",
      }}
    />
  )
}
