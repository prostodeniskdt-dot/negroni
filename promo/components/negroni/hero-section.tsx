"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Image from "next/image"
import { ChevronDown } from "lucide-react"

function useAnimatedCounter(target: number, duration: number, start: boolean) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!start) return
    let startTime: number | null = null
    let raf: number

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) {
        raf = requestAnimationFrame(step)
      }
    }

    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, duration, start])

  return count
}

export function HeroSection() {
  const [loaded, setLoaded] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const [scrollY, setScrollY] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const specimens = useAnimatedCounter(100, 2000, loaded)
  const countries = useAnimatedCounter(27, 1800, loaded)
  const yearCount = useAnimatedCounter(1919, 2200, loaded)

  useEffect(() => {
    setLoaded(true)
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePos({
      x: (e.clientX - rect.left) / rect.width - 0.5,
      y: (e.clientY - rect.top) / rect.height - 0.5,
    })
  }, [])

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Parallax */}
      <div
        className="absolute inset-0 z-0 transition-transform duration-100"
        style={{
          transform: `translateY(${scrollY * 0.3}px) scale(${1.1 + scrollY * 0.0002})`,
        }}
      >
        <Image
          src="/images/negroni-hero.jpg"
          alt="Негрони коктейль"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-background/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" />
      </div>

      {/* Animated liquid blobs with mouse-reactive parallax */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/5 animate-liquid-wave blur-sm"
          style={{
            animationDuration: "8s",
            transform: `translate(${mousePos.x * 30}px, ${mousePos.y * 30}px)`,
            transition: "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-56 h-56 bg-accent/5 animate-liquid-wave blur-sm"
          style={{
            animationDuration: "10s",
            animationDelay: "1s",
            transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)`,
            transition: "transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        />
        <div
          className="absolute top-1/2 right-1/3 w-40 h-40 bg-primary/8 animate-liquid-wave blur-sm"
          style={{
            animationDuration: "7s",
            animationDelay: "2s",
            transform: `translate(${mousePos.x * 40}px, ${mousePos.y * 40}px)`,
            transition: "transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        />

        {/* Extra ambient floating orbs */}
        <div
          className="absolute top-[15%] right-[15%] w-3 h-3 rounded-full bg-primary/30"
          style={{
            animation: "float 5s ease-in-out infinite",
            animationDelay: "0s",
          }}
        />
        <div
          className="absolute top-[60%] left-[10%] w-2 h-2 rounded-full bg-accent/25"
          style={{
            animation: "float 7s ease-in-out infinite",
            animationDelay: "1.5s",
          }}
        />
        <div
          className="absolute top-[40%] right-[8%] w-1.5 h-1.5 rounded-full bg-primary/20"
          style={{
            animation: "float 6s ease-in-out infinite",
            animationDelay: "3s",
          }}
        />
      </div>

      {/* Pour line animation - dripping effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px z-[1]">
        <div
          className={`w-full bg-gradient-to-b from-primary/0 via-primary/40 to-primary/0 transition-all duration-[3s] ease-out ${
            loaded ? "h-48" : "h-0"
          }`}
          style={{ transitionDelay: "1s" }}
        />
        {/* Drip droplet at the end */}
        <div
          className={`w-2 h-2 rounded-full bg-primary/50 -ml-[3px] transition-all duration-500 ${
            loaded ? "opacity-100 scale-100" : "opacity-0 scale-0"
          }`}
          style={{
            transitionDelay: "3.5s",
            animation: loaded ? "float 3s ease-in-out infinite 4s" : "none",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Overline with shimmer */}
        <div
          className={`transition-all duration-1000 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "0.5s" }}
        >
          <span className="inline-flex items-center gap-3 text-xs tracking-[0.35em] uppercase text-primary">
            <span className="w-12 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent shimmer-line" />
            EST. 1919
            <span className="w-12 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent shimmer-line" />
          </span>
        </div>

        {/* Main Title with clip-path text reveal */}
        <h1
          className={`mt-8 font-serif text-5xl md:text-7xl lg:text-9xl font-bold leading-[0.9] tracking-tight text-balance`}
        >
          <span
            className="block text-foreground overflow-hidden"
          >
            <span
              className={`inline-block transition-all duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                loaded ? "translate-y-0 opacity-100" : "translate-y-[120%] opacity-0"
              }`}
              style={{ transitionDelay: "0.7s" }}
            >
              MUSEO
            </span>
          </span>
          <span
            className="block text-primary mt-1 overflow-hidden"
          >
            <span
              className={`inline-block transition-all duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                loaded ? "translate-y-0 opacity-100" : "translate-y-[120%] opacity-0"
              }`}
              style={{ transitionDelay: "0.95s" }}
            >
              NEGRONI
            </span>
          </span>
        </h1>

        {/* Subtitle with word-by-word fade */}
        <p
          className={`mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed transition-all duration-1000 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "1.3s" }}
        >
          Первый в мире музей, посвящённый легендарному коктейлю.
          <br className="hidden md:block" />
          Более{" "}
          <span className="text-primary font-semibold inline-block hover:scale-110 transition-transform duration-300 cursor-default">
            100 уникальных экземпляров
          </span>{" "}
          со всего мира.
        </p>

        {/* CTA Buttons with magnetic hover */}
        <div
          className={`mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-1000 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "1.6s" }}
        >
          <MagneticButton href="#collection" variant="primary">
            Исследовать коллекцию
          </MagneticButton>
          <MagneticButton href="#history" variant="outline">
            Узнать историю
          </MagneticButton>
        </div>

        {/* Animated counter stats */}
        <div
          className={`mt-20 flex items-center justify-center gap-8 md:gap-16 transition-all duration-1000 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "1.9s" }}
        >
          {[
            { value: `${specimens}+`, label: "Экземпляров" },
            { value: String(countries), label: "Стран" },
            { value: String(yearCount), label: "Год создания" },
          ].map((stat) => (
            <div key={stat.label} className="text-center group cursor-default">
              <div className="font-serif text-2xl md:text-4xl font-bold text-primary tabular-nums group-hover:scale-110 transition-transform duration-300">
                {stat.value}
              </div>
              <div className="mt-1 text-xs tracking-widest uppercase text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator with pulse ring */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <a
          href="#collection"
          className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase">Листайте</span>
          <div className="relative">
            <ChevronDown
              size={20}
              className="animate-bounce group-hover:text-primary relative z-10"
            />
            <div className="absolute inset-0 -m-2 rounded-full border border-primary/20 animate-ping" />
          </div>
        </a>
      </div>
    </section>
  )
}

function MagneticButton({
  children,
  href,
  variant,
}: {
  children: React.ReactNode
  href: string
  variant: "primary" | "outline"
}) {
  const btnRef = useRef<HTMLAnchorElement>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    const btn = btnRef.current
    if (!btn) return
    const rect = btn.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    setOffset({ x: x * 0.2, y: y * 0.2 })
  }

  const handleMouseLeave = () => setOffset({ x: 0, y: 0 })

  if (variant === "primary") {
    return (
      <a
        ref={btnRef}
        href={href}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative overflow-hidden px-8 py-4 bg-primary text-primary-foreground text-sm tracking-widest uppercase font-medium transition-all duration-500 hover:shadow-[0_0_40px_rgba(191,87,0,0.3)]"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px)`,
          transition: "transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.5s",
        }}
      >
        <span className="relative z-10">{children}</span>
        <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
        {/* Shine sweep on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      </a>
    )
  }

  return (
    <a
      ref={btnRef}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative px-8 py-4 border border-foreground/20 text-foreground text-sm tracking-widest uppercase font-medium hover:border-primary/50 hover:text-primary transition-all duration-500 overflow-hidden"
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        transition: "transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), border-color 0.5s, color 0.5s",
      }}
    >
      <span className="relative z-10">{children}</span>
      {/* Bottom fill animation */}
      <div className="absolute bottom-0 left-0 right-0 h-0 group-hover:h-full bg-primary/5 transition-all duration-700" />
    </a>
  )
}
