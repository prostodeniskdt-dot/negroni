"use client"

import { useEffect, useRef, useState } from "react"

const ingredients = [
  {
    name: "Джин",
    amount: "30 мл",
    description: "Можжевеловая основа, придающая структуру и характер",
    color: "bg-foreground/10",
    accentColor: "text-foreground/70",
    fillColor: "from-foreground/5 to-foreground/15",
  },
  {
    name: "Кампари",
    amount: "30 мл",
    description: "Горькое сердце коктейля с нотами апельсина и трав",
    color: "bg-accent/20",
    accentColor: "text-accent",
    fillColor: "from-accent/10 to-accent/30",
  },
  {
    name: "Красный Вермут",
    amount: "30 мл",
    description: "Сладкая глубина с ароматами специй и сухофруктов",
    color: "bg-primary/20",
    accentColor: "text-primary",
    fillColor: "from-primary/10 to-primary/30",
  },
]

export function IngredientsSection() {
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
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32 px-6 md:px-12 lg:px-20">
      {/* Section heading */}
      <div
        className={`max-w-4xl mx-auto text-center mb-16 md:mb-24 transition-all duration-1000 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
      >
        <span className="inline-flex items-center gap-3 text-xs tracking-[0.35em] uppercase text-primary mb-6">
          <span className="w-8 h-px bg-primary/60" />
          Формула
          <span className="w-8 h-px bg-primary/60" />
        </span>
        <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-foreground text-balance mt-4">
          Баланс трёх
          <span className="text-primary"> начал</span>
        </h2>
        <p className="mt-6 text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
          Совершенная пропорция 1:1:1 — три равных части, создающие гармонию.
        </p>
      </div>

      {/* Ingredients display */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {ingredients.map((ingredient, i) => (
          <div
            key={ingredient.name}
            className={`group relative overflow-hidden bg-card border border-border/30 hover:border-primary/20 transition-all duration-700 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
            }`}
            style={{ transitionDelay: `${400 + i * 200}ms` }}
          >
            {/* Glass visualization */}
            <div className="relative h-48 flex items-end justify-center overflow-hidden">
              {/* Liquid fill animation */}
              <div
                className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${ingredient.fillColor} transition-all duration-[2s] ease-out ${
                  visible ? "h-3/4" : "h-0"
                }`}
                style={{ transitionDelay: `${800 + i * 300}ms` }}
              />

              {/* Animated surface wave */}
              <div
                className={`absolute left-0 right-0 transition-all duration-[2s] ${
                  visible ? "top-[25%]" : "top-full"
                }`}
                style={{ transitionDelay: `${800 + i * 300}ms` }}
              >
                <svg viewBox="0 0 200 20" className="w-full h-4 opacity-30">
                  <path fill="currentColor" className={ingredient.accentColor}>
                    <animate
                      attributeName="d"
                      dur="3s"
                      repeatCount="indefinite"
                      values="
                        M0,10 C50,5 100,15 150,10 C175,7 200,13 200,10 L200,20 L0,20 Z;
                        M0,10 C50,15 100,5 150,10 C175,13 200,7 200,10 L200,20 L0,20 Z;
                        M0,10 C50,5 100,15 150,10 C175,7 200,13 200,10 L200,20 L0,20 Z
                      "
                    />
                  </path>
                </svg>
              </div>

              {/* Bubbles */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(5)].map((_, j) => (
                  <div
                    key={j}
                    className={`absolute rounded-full ${ingredient.color} opacity-0 group-hover:opacity-60`}
                    style={{
                      width: `${4 + j * 2}px`,
                      height: `${4 + j * 2}px`,
                      left: `${20 + j * 15}%`,
                      bottom: `${10 + j * 8}%`,
                      animation: `bubble-float ${2 + j * 0.5}s ease-out infinite`,
                      animationDelay: `${j * 0.3}s`,
                    }}
                  />
                ))}
              </div>

              {/* Amount label */}
              <div className="relative z-10 mb-6">
                <span className={`font-serif text-4xl font-bold ${ingredient.accentColor}`}>
                  {ingredient.amount}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="relative z-10 p-6 border-t border-border/20">
              <h3 className="font-serif text-2xl text-foreground">
                {ingredient.name}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {ingredient.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Mixing animation */}
      <div
        className={`mt-16 flex items-center justify-center transition-all duration-1000 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDelay: "1500ms" }}
      >
        <div className="flex items-center gap-6 text-muted-foreground">
          <div className="w-16 h-px bg-border/50" />
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full bg-primary/10 animate-swirl" />
            <div className="absolute inset-2 rounded-full bg-primary/20 animate-swirl [animation-delay:0.5s]" />
            <div className="absolute inset-3 rounded-full bg-primary/40" />
          </div>
          <span className="text-xs tracking-[0.3em] uppercase">Смешайте и наслаждайтесь</span>
          <div className="w-16 h-px bg-border/50" />
        </div>
      </div>
    </section>
  )
}
