"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

const timelineEvents = [
  {
    year: "1919",
    title: "Рождение легенды",
    description:
      "Граф Камилло Негрони просит бартендера усилить свой Американо, заменив содовую на джин. Так рождается один из величайших коктейлей в истории.",
  },
  {
    year: "1947",
    title: "Первое упоминание",
    description:
      "Рецепт Негрони впервые появляется в печати в книге Орсона Тоотса о барном деле.",
  },
  {
    year: "1972",
    title: "Сбальято",
    description:
      "Миланский бартендер случайно добавляет просекко вместо джина — и создаёт знаменитую вариацию.",
  },
  {
    year: "2013",
    title: "Negroni Week",
    description:
      "Ilvardo и Campari запускают глобальную Negroni Week, которая становится ежегодной традицией.",
  },
  {
    year: "2026",
    title: "Museo Negroni",
    description:
      "Открытие первого в мире музея, посвящённого культуре Негрони, с коллекцией из 100+ экземпляров.",
  },
]

export function HistorySection() {
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
      id="history"
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Background decorative elements with slow parallax */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-30 pointer-events-none">
        <div
          className="absolute top-20 right-20 w-96 h-96 bg-primary/5 animate-liquid-wave rounded-full"
          style={{ animation: "liquid-wave 8s ease-in-out infinite, float 12s ease-in-out infinite" }}
        />
        <div
          className="absolute bottom-40 right-40 w-64 h-64 bg-accent/5 animate-liquid-wave rounded-full"
          style={{ animation: "liquid-wave 10s ease-in-out infinite 2s, float 14s ease-in-out infinite 3s" }}
        />
      </div>

      <div className="relative z-10 px-6 md:px-12 lg:px-20">
        {/* Section header */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-20">
          <div
            className={`transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"
            }`}
          >
            <span className="inline-flex items-center gap-3 text-xs tracking-[0.35em] uppercase text-primary mb-6">
              <span className="w-8 h-px bg-primary/60 shimmer-line" />
              История
              <span className="w-8 h-px bg-primary/60 shimmer-line" />
            </span>
            <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-foreground text-balance">
              <span className="overflow-hidden inline-block">
                <span
                  className={`inline-block transition-all duration-[1s] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    visible ? "translate-y-0" : "translate-y-full"
                  }`}
                >
                  Более века
                </span>
              </span>{" "}
              <span className="overflow-hidden inline-block">
                <span
                  className={`inline-block text-primary transition-all duration-[1s] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    visible ? "translate-y-0" : "translate-y-full"
                  }`}
                  style={{ transitionDelay: "150ms" }}
                >
                  совершенства
                </span>
              </span>
            </h2>
          </div>
          <div
            className={`flex items-end transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <p className="text-muted-foreground text-lg leading-relaxed max-w-lg">
              От случайной замены в баре Флоренции до глобального символа
              элегантности — путешествие Негрони через время и культуры.
            </p>
          </div>
        </div>

        {/* Image + Timeline */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Image with reveal clip-path */}
          <div
            className="relative aspect-[4/5] overflow-hidden"
            style={{
              clipPath: visible ? "inset(0 0 0 0)" : "inset(100% 0 0 0)",
              transition: "clip-path 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.4s",
            }}
          >
            <Image
              src="/images/negroni-pour.jpg"
              alt="Процесс приготовления Негрони"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />

            {/* Floating quote over image */}
            <div
              className={`absolute bottom-6 left-6 right-6 transition-all duration-700 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "1.2s" }}
            >
              <p className="font-serif text-2xl text-foreground">
                {'"'}Искусство в каждой капле{'"'}
              </p>
              <p className="mt-2 text-xs tracking-[0.2em] uppercase text-muted-foreground">
                Процесс переливания, как ритуал
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical pour line with gradient drip */}
            <div className="absolute left-4 top-0 bottom-0 w-px overflow-hidden">
              <div
                className={`w-full bg-gradient-to-b from-primary/60 via-primary/30 to-transparent transition-all duration-[3s] ease-out ${
                  visible ? "h-full" : "h-0"
                }`}
                style={{ transitionDelay: "800ms" }}
              />
              {/* Dripping drop at the bottom */}
              <div
                className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary/40 transition-all duration-500 ${
                  visible ? "opacity-100 scale-100" : "opacity-0 scale-0"
                }`}
                style={{
                  transitionDelay: "3.5s",
                  animation: visible ? "float 3s ease-in-out infinite 4s" : "none",
                }}
              />
            </div>

            <div className="flex flex-col gap-10">
              {timelineEvents.map((event, i) => (
                <TimelineItem
                  key={event.year}
                  event={event}
                  index={i}
                  parentVisible={visible}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function TimelineItem({
  event,
  index,
  parentVisible,
}: {
  event: (typeof timelineEvents)[0]
  index: number
  parentVisible: boolean
}) {
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    if (parentVisible) {
      const timer = setTimeout(() => setVisible(true), 800 + index * 250)
      return () => clearTimeout(timer)
    }
  }, [parentVisible, index])

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative pl-12 transition-all duration-700 cursor-default group ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {/* Dot on timeline with pulse */}
      <div className="absolute left-2.5 top-1">
        <div
          className={`w-3 h-3 rounded-full border-2 transition-all duration-500 ${
            visible
              ? "border-primary bg-primary shadow-[0_0_12px_rgba(191,87,0,0.5)]"
              : "border-border bg-background"
          }`}
        />
        {/* Pulse ring on hover */}
        {hovered && (
          <div className="absolute inset-0 -m-1 rounded-full border border-primary/40 animate-ping" />
        )}
      </div>

      {/* Horizontal connecting line */}
      <div
        className={`absolute left-[22px] top-[10px] h-px bg-primary/30 transition-all duration-700 ${
          visible ? "w-6" : "w-0"
        }`}
        style={{ transitionDelay: `${index * 100}ms` }}
      />

      <span className="text-xs tracking-[0.3em] uppercase text-primary font-medium group-hover:tracking-[0.5em] transition-all duration-500">
        {event.year}
      </span>
      <h3 className="mt-2 font-serif text-xl md:text-2xl text-foreground group-hover:text-primary transition-colors duration-500">
        {event.title}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-md group-hover:text-secondary-foreground transition-colors duration-500">
        {event.description}
      </p>
    </div>
  )
}
