"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

function RevealOnScroll({
  children,
  delay = 0,
  direction = "up",
  className = "",
}: {
  children: React.ReactNode
  delay?: number
  direction?: "up" | "left" | "right" | "scale"
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const transforms: Record<string, string> = {
    up: visible ? "translateY(0) scale(1)" : "translateY(60px) scale(0.97)",
    left: visible ? "translateX(0)" : "translateX(-60px)",
    right: visible ? "translateX(0)" : "translateX(60px)",
    scale: visible ? "scale(1)" : "scale(0.85)",
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: transforms[direction],
        opacity: visible ? 1 : 0,
        transition: `all 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

export function GallerySection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="gallery"
      className="relative py-24 md:py-32 overflow-hidden"
    >
      <div className="px-6 md:px-12 lg:px-20">
        {/* Section heading with text reveal */}
        <div
          className={`max-w-4xl mx-auto text-center mb-16 transition-all duration-1000 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <span className="inline-flex items-center gap-3 text-xs tracking-[0.35em] uppercase text-primary mb-6">
            <span className="w-8 h-px bg-primary/60" />
            Галерея
            <span className="w-8 h-px bg-primary/60" />
          </span>
          <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-foreground text-balance mt-4">
            <span className="overflow-hidden inline-block">
              <span
                className={`inline-block transition-all duration-[1s] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  visible ? "translate-y-0" : "translate-y-full"
                }`}
              >
                Эстетика
              </span>
            </span>{" "}
            <span className="overflow-hidden inline-block">
              <span
                className={`inline-block text-primary transition-all duration-[1s] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  visible ? "translate-y-0" : "translate-y-full"
                }`}
                style={{ transitionDelay: "150ms" }}
              >
                напитка
              </span>
            </span>
          </h2>
        </div>

        {/* Bento Grid Gallery */}
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[200px] md:auto-rows-[250px]">
          {/* Large hero card */}
          <RevealOnScroll
            delay={200}
            direction="scale"
            className="relative col-span-2 row-span-2 overflow-hidden group cursor-pointer"
          >
            <Image
              src="/images/negroni-collection.jpg"
              alt="Коллекция Негрони"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover group-hover:scale-110 transition-transform duration-[2s] ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
            {/* Reveal overlay from bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <span className="text-[10px] tracking-[0.3em] uppercase text-primary">
                Избранное
              </span>
              <h3 className="mt-2 font-serif text-xl md:text-3xl text-foreground">
                Палитра вкусов
              </h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-sm opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                Каждый оттенок — от бледного розового до глубокого рубинового —
                рассказывает свою историю.
              </p>
            </div>
            {/* Animated border on hover */}
            <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/20 transition-all duration-700 pointer-events-none" />
            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-700" />
          </RevealOnScroll>

          {/* Ingredient card */}
          <RevealOnScroll
            delay={400}
            direction="right"
            className="relative col-span-1 row-span-1 overflow-hidden group cursor-pointer"
          >
            <Image
              src="/images/negroni-ingredients.jpg"
              alt="Ингредиенты Негрони"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover group-hover:scale-110 transition-transform duration-[2s] ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            <div className="absolute bottom-4 left-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
              <span className="text-[10px] tracking-[0.3em] uppercase text-primary">
                Ингредиенты
              </span>
              <h3 className="mt-1 font-serif text-lg text-foreground">
                Триада совершенства
              </h3>
            </div>
            <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/20 transition-all duration-700 pointer-events-none" />
          </RevealOnScroll>

          {/* Stats card with animated ring */}
          <RevealOnScroll
            delay={500}
            direction="left"
            className="relative col-span-1 row-span-1 overflow-hidden bg-card border border-border/30 flex flex-col items-center justify-center group cursor-pointer hover:border-primary/30 transition-colors duration-700"
          >
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary/10 to-transparent transition-all duration-1000 group-hover:h-full h-0" />
            </div>
            <div className="relative z-10 text-center p-4">
              {/* Rotating ring */}
              <div className="relative mx-auto w-24 h-24 mb-2">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(25 15% 18%)" strokeWidth="1" />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="hsl(18 85% 45%)"
                    strokeWidth="2"
                    strokeDasharray="264"
                    strokeDashoffset="264"
                    strokeLinecap="round"
                    className="group-hover:animate-[circle-draw_1.5s_ease-out_forwards]"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      from="264"
                      to="0"
                      dur="2s"
                      begin="0.5s"
                      fill="freeze"
                    />
                  </circle>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-serif text-3xl font-bold text-primary">100+</span>
                </div>
              </div>
              <div className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
                Уникальных рецептов
              </div>
            </div>
          </RevealOnScroll>

          {/* Pour image */}
          <RevealOnScroll
            delay={600}
            direction="up"
            className="relative col-span-1 row-span-1 overflow-hidden group cursor-pointer"
          >
            <Image
              src="/images/negroni-pour.jpg"
              alt="Переливание Негрони"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover group-hover:scale-110 transition-transform duration-[2s] ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            <div className="absolute bottom-4 left-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
              <span className="text-[10px] tracking-[0.3em] uppercase text-primary">
                Процесс
              </span>
              <h3 className="mt-1 font-serif text-lg text-foreground">
                Ритуал переливания
              </h3>
            </div>
            <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/20 transition-all duration-700 pointer-events-none" />
          </RevealOnScroll>

          {/* Quote card with typewriter feel */}
          <RevealOnScroll
            delay={700}
            direction="scale"
            className="relative col-span-1 row-span-1 overflow-hidden bg-secondary/50 border border-border/30 flex items-center justify-center group cursor-pointer hover:border-primary/30 transition-colors duration-700"
          >
            <div className="p-6 text-center">
              <div className="font-serif text-5xl text-primary/30 leading-none group-hover:text-primary/50 transition-colors duration-500 group-hover:scale-110 inline-block">
                {'"'}
              </div>
              <p className="mt-2 font-serif text-sm md:text-base italic text-foreground/80 leading-relaxed">
                Негрони — это не просто коктейль, это философия баланса.
              </p>
              <p className="mt-3 text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                Граф Негрони
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  )
}
