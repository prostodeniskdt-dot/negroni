"use client"

export function MarqueeBand() {
  const items = [
    "GIN",
    "CAMPARI",
    "VERMOUTH",
    "NEGRONI",
    "SBAGLIATO",
    "BOULEVARDIER",
    "AMERICANO",
    "BITTER",
    "APERITIVO",
    "COCKTAIL",
  ]

  return (
    <div className="relative overflow-hidden py-6 bg-secondary/50 border-y border-border/30 group/marquee">
      {/* First row - left to right */}
      <div className="flex whitespace-nowrap" style={{ animation: "marquee 25s linear infinite" }}>
        {[...items, ...items].map((item, i) => (
          <span
            key={`a-${i}`}
            className="flex items-center gap-6 mx-6 text-sm md:text-base tracking-[0.3em] uppercase text-muted-foreground/60 font-light hover:text-primary/80 transition-colors duration-500 cursor-default"
          >
            {item}
            <span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover/marquee:bg-primary/60 transition-colors duration-500" />
          </span>
        ))}
      </div>

      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-secondary/50 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-secondary/50 to-transparent z-10 pointer-events-none" />
    </div>
  )
}
