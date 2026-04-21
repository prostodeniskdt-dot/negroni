"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin, Clock, Ticket, GlassWater } from "lucide-react"

const infoCards = [
  {
    icon: MapPin,
    title: "Местоположение",
    detail: "Флоренция, Италия",
    sub: "Via del Conte, 14",
  },
  {
    icon: Clock,
    title: "Часы работы",
    detail: "Ежедневно 12:00 — 23:00",
    sub: "Последний вход в 22:00",
  },
  {
    icon: Ticket,
    title: "Входной билет",
    detail: "от 25 EUR",
    sub: "Включает дегустацию",
  },
  {
    icon: GlassWater,
    title: "Дегустация",
    detail: "3 экземпляра",
    sub: "По выбору сомелье",
  },
]

export function VisitSection() {
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
      id="visit"
      className="relative py-24 md:py-32 px-6 md:px-12 lg:px-20"
    >
      {/* Animated background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]"
          style={{ animation: "float 10s ease-in-out infinite" }}
        />
        <div
          className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-accent/3 rounded-full blur-[80px]"
          style={{ animation: "float 8s ease-in-out infinite 2s" }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Heading with text reveal */}
        <div
          className={`text-center mb-16 md:mb-20 transition-all duration-1000 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <span className="inline-flex items-center gap-3 text-xs tracking-[0.35em] uppercase text-primary mb-6">
            <span className="w-8 h-px bg-primary/60" />
            Посещение
            <span className="w-8 h-px bg-primary/60" />
          </span>
          <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-foreground text-balance mt-4">
            <span className="overflow-hidden inline-block">
              <span
                className={`inline-block transition-all duration-[1s] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  visible ? "translate-y-0" : "translate-y-full"
                }`}
              >
                Погрузитесь в
              </span>
            </span>{" "}
            <span className="overflow-hidden inline-block">
              <span
                className={`inline-block text-primary transition-all duration-[1s] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  visible ? "translate-y-0" : "translate-y-full"
                }`}
                style={{ transitionDelay: "150ms" }}
              >
                мир Негрони
              </span>
            </span>
          </h2>
          <p
            className={`mt-6 text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed transition-all duration-1000 ${
              visible ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDelay: "500ms" }}
          >
            Забронируйте визит и прикоснитесь к вековой истории одного из
            самых изысканных коктейлей мира.
          </p>
        </div>

        {/* Info Cards with staggered reveal and hover flip effect */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {infoCards.map((card, i) => {
            const Icon = card.icon
            return (
              <div
                key={card.title}
                className={`group relative overflow-hidden bg-card border border-border/50 p-6 md:p-8 text-center hover:border-primary/30 cursor-pointer ${
                  visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
                style={{
                  transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${300 + i * 120}ms`,
                }}
              >
                {/* Animated liquid fill from bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-0 group-hover:h-full bg-gradient-to-t from-primary/10 via-primary/5 to-transparent transition-all duration-[1.2s] ease-out" />

                {/* Shine sweep */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[1.5s] bg-gradient-to-r from-transparent via-primary/5 to-transparent" />
                </div>

                <div className="relative z-10">
                  <div className="mx-auto w-14 h-14 flex items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-all duration-500 group-hover:scale-110">
                    <Icon
                      size={22}
                      className="text-primary group-hover:rotate-12 transition-all duration-500"
                    />
                  </div>
                  <h3 className="mt-4 text-xs tracking-[0.2em] uppercase text-muted-foreground">
                    {card.title}
                  </h3>
                  <p className="mt-2 font-serif text-xl text-foreground group-hover:text-primary transition-colors duration-500">
                    {card.detail}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {card.sub}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA with ripple */}
        <div
          className={`text-center transition-all duration-1000 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "900ms" }}
        >
          <a
            href="#"
            className="group relative inline-flex overflow-hidden px-12 py-5 bg-primary text-primary-foreground text-sm tracking-widest uppercase font-medium transition-all duration-500 hover:shadow-[0_0_60px_rgba(191,87,0,0.3)]"
          >
            <span className="relative z-10">Забронировать визит</span>
            <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            {/* Shine effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>
          </a>
          <p className="mt-4 text-xs text-muted-foreground tracking-wide">
            Бесплатная отмена за 24 часа до визита
          </p>
        </div>
      </div>
    </section>
  )
}
