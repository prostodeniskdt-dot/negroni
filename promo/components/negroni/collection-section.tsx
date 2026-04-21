"use client"

import { useEffect, useRef, useState, useCallback } from "react"

const specimens = [
  {
    id: 1,
    name: "Classico 1919",
    origin: "Флоренция, Италия",
    year: "1919",
    description:
      "Оригинальный рецепт графа Камилло Негрони. Равные части джина, кампари и красного вермута.",
    color: "from-orange-600/20 to-red-800/20",
    accentHsl: "18, 85%, 45%",
  },
  {
    id: 2,
    name: "White Negroni",
    origin: "Бордо, Франция",
    year: "2001",
    description:
      "Элегантная вариация с Suze и Lillet Blanc вместо Campari и красного вермута.",
    color: "from-amber-300/20 to-yellow-500/20",
    accentHsl: "43, 96%, 56%",
  },
  {
    id: 3,
    name: "Boulevardier",
    origin: "Париж, Франция",
    year: "1927",
    description:
      "Виски заменяет джин, создавая более тёплый и насыщенный характер напитка.",
    color: "from-amber-700/20 to-red-900/20",
    accentHsl: "30, 80%, 40%",
  },
  {
    id: 4,
    name: "Sbagliato",
    origin: "Милан, Италия",
    year: "1972",
    description:
      "Счастливая ошибка — просекко вместо джина создаёт игристую лёгкость.",
    color: "from-rose-400/20 to-orange-400/20",
    accentHsl: "350, 80%, 60%",
  },
  {
    id: 5,
    name: "Negroni Aged",
    origin: "Лондон, Англия",
    year: "2009",
    description:
      "Выдержанный в дубовых бочках, обретающий ноты ванили и карамели.",
    color: "from-amber-800/20 to-orange-900/20",
    accentHsl: "25, 70%, 35%",
  },
  {
    id: 6,
    name: "Mezcal Negroni",
    origin: "Оахака, Мексика",
    year: "2015",
    description:
      "Дымный мескаль привносит глубину и загадочность в классическую формулу.",
    color: "from-stone-600/20 to-amber-700/20",
    accentHsl: "35, 50%, 35%",
  },
]

function TiltCard({
  specimen,
  index,
}: {
  specimen: (typeof specimens)[0]
  index: number
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 })
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 })

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    if (cardRef.current) observer.observe(cardRef.current)
    return () => observer.disconnect()
  }, [])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!cardRef.current) return
      const rect = cardRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height
      setTilt({
        rotateX: (y - 0.5) * -12,
        rotateY: (x - 0.5) * 12,
      })
      setGlarePos({ x: x * 100, y: y * 100 })
    },
    []
  )

  const handleMouseLeave = () => {
    setHovered(false)
    setTilt({ rotateX: 0, rotateY: 0 })
  }

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative overflow-hidden bg-card border border-border/50 cursor-pointer hover:border-primary/30 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
      }`}
      style={{
        transform: `perspective(800px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) ${
          visible ? "translateY(0)" : "translateY(64px)"
        }`,
        transition: hovered
          ? "transform 0.15s ease-out, opacity 0.7s, border-color 0.7s"
          : "transform 0.5s ease-out, opacity 0.7s, border-color 0.7s",
        transitionDelay: visible ? `${index * 150}ms` : "0ms",
      }}
    >
      {/* Glare effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
        style={{
          background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, hsla(${specimen.accentHsl}, 0.08) 0%, transparent 60%)`,
        }}
      />

      {/* Glass fill animation on hover */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${specimen.color} transition-all duration-1000 ease-out ${
          hovered ? "h-full" : "h-0"
        }`}
      />

      {/* Ripple wave at liquid surface */}
      {hovered && (
        <div
          className="absolute left-0 right-0 h-1 z-10"
          style={{
            top: "0%",
            animation: "liquid-rise 1s ease-out forwards",
          }}
        >
          <svg viewBox="0 0 200 10" className="w-full h-2 opacity-30" preserveAspectRatio="none">
            <path fill={`hsla(${specimen.accentHsl}, 0.4)`}>
              <animate
                attributeName="d"
                dur="2s"
                repeatCount="indefinite"
                values="
                  M0,5 C40,2 80,8 120,5 C160,2 200,8 200,5 L200,10 L0,10 Z;
                  M0,5 C40,8 80,2 120,5 C160,8 200,2 200,5 L200,10 L0,10 Z;
                  M0,5 C40,2 80,8 120,5 C160,2 200,8 200,5 L200,10 L0,10 Z
                "
              />
            </path>
          </svg>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <span className="font-serif text-5xl font-bold text-primary/20 group-hover:text-primary/40 transition-colors duration-500">
            {String(specimen.id).padStart(2, "0")}
          </span>
          <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
            {specimen.year}
          </span>
        </div>

        <h3 className="font-serif text-2xl md:text-3xl text-foreground group-hover:text-primary transition-colors duration-500">
          {specimen.name}
        </h3>

        <p className="mt-2 text-xs tracking-[0.2em] uppercase text-primary/70">
          {specimen.origin}
        </p>

        {/* Divider with pour animation */}
        <div className="relative my-5 h-px bg-border/30 overflow-hidden">
          <div
            className={`absolute inset-y-0 left-0 bg-primary/50 transition-all duration-1000 ${
              hovered ? "w-full" : "w-0"
            }`}
          />
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-secondary-foreground transition-colors duration-500">
          {specimen.description}
        </p>

        <div className="mt-6 flex items-center gap-3">
          <div
            className={`w-2 h-2 rounded-full bg-primary transition-all duration-500 ${
              hovered ? "scale-150 shadow-[0_0_12px_rgba(191,87,0,0.5)]" : ""
            }`}
          />
          <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground group-hover:text-primary/60 transition-colors">
            Подробнее
          </span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            className={`ml-auto transition-all duration-500 text-muted-foreground/30 group-hover:text-primary/60 ${
              hovered ? "translate-x-1" : ""
            }`}
          >
            <path
              d="M5 12h14M12 5l7 7-7 7"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}

export function CollectionSection() {
  const titleRef = useRef<HTMLDivElement>(null)
  const [titleVisible, setTitleVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTitleVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    if (titleRef.current) observer.observe(titleRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="collection" className="relative py-24 md:py-32 px-6 md:px-12 lg:px-20">
      <div
        ref={titleRef}
        className={`max-w-4xl mx-auto text-center mb-16 md:mb-24 transition-all duration-1000 ${
          titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
      >
        <span className="inline-flex items-center gap-3 text-xs tracking-[0.35em] uppercase text-primary mb-6">
          <span className="w-8 h-px bg-primary/60" />
          Коллекция
          <span className="w-8 h-px bg-primary/60" />
        </span>
        <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-foreground text-balance mt-4">
          <span className="overflow-hidden inline-block">
            <span
              className={`inline-block transition-all duration-[1s] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                titleVisible ? "translate-y-0" : "translate-y-full"
              }`}
            >
              Избранные
            </span>
          </span>{" "}
          <span className="overflow-hidden inline-block">
            <span
              className={`inline-block text-primary transition-all duration-[1s] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                titleVisible ? "translate-y-0" : "translate-y-full"
              }`}
              style={{ transitionDelay: "150ms" }}
            >
              экземпляры
            </span>
          </span>
        </h2>
        <p className="mt-6 text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
          Каждый экземпляр — это уникальная история, рассказанная через призму
          вкуса, аромата и культуры.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {specimens.map((specimen, i) => (
          <TiltCard key={specimen.id} specimen={specimen} index={i} />
        ))}
      </div>

      <div className="mt-16 text-center">
        <a
          href="#gallery"
          className="group inline-flex items-center gap-3 text-sm tracking-[0.2em] uppercase text-muted-foreground hover:text-primary transition-colors duration-500"
        >
          <span>Смотреть все 100+ экземпляров</span>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="group-hover:translate-x-2 transition-transform duration-300"
          >
            <path
              d="M5 12h14M12 5l7 7-7 7"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </section>
  )
}
