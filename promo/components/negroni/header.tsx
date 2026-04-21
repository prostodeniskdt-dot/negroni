"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"

const navLinks = [
  { label: "Экспозиция", href: "#collection" },
  { label: "История", href: "#history" },
  { label: "Коллекция", href: "#gallery" },
  { label: "Посещение", href: "#visit" },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled
          ? "bg-background/90 backdrop-blur-xl border-b border-border"
          : "bg-transparent"
      }`}
    >
      <nav className="flex items-center justify-between px-6 py-4 md:px-12 lg:px-20">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-liquid-wave" />
            <div className="absolute inset-1 rounded-full bg-primary/40 animate-liquid-wave [animation-delay:0.5s]" />
            <div className="absolute inset-2 rounded-full bg-primary/70" />
          </div>
          <span className="font-serif text-xl tracking-wide text-foreground group-hover:text-primary transition-colors duration-500">
            MUSEO NEGRONI
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors duration-500 group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-500" />
            </a>
          ))}
          <a
            href="#visit"
            className="ml-4 px-5 py-2 text-sm tracking-widest uppercase border border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-500"
          >
            Билеты
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-foreground hover:text-primary transition-colors"
          aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-6 bg-background/95 backdrop-blur-xl flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-lg tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors py-2 border-b border-border/30"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#visit"
            onClick={() => setMenuOpen(false)}
            className="mt-2 px-5 py-3 text-center text-sm tracking-widest uppercase border border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-500"
          >
            Билеты
          </a>
        </div>
      </div>
    </header>
  )
}
