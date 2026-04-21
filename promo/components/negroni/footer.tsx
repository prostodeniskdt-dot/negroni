"use client"

export function Footer() {
  return (
    <footer className="relative border-t border-border/30 bg-secondary/30">
      <div className="px-6 md:px-12 lg:px-20 py-16 md:py-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-6 h-6">
                <div className="absolute inset-0 rounded-full bg-primary/30 animate-liquid-wave" />
                <div className="absolute inset-1 rounded-full bg-primary/60" />
              </div>
              <span className="font-serif text-lg tracking-wide text-foreground">
                MUSEO NEGRONI
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Первый в мире музей, посвящённый искусству, истории и культуре
              легендарного коктейля Негрони.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-xs tracking-[0.2em] uppercase text-foreground mb-4">
                Музей
              </h4>
              <ul className="flex flex-col gap-3">
                {["Экспозиция", "История", "Галерея", "События"].map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs tracking-[0.2em] uppercase text-foreground mb-4">
                Информация
              </h4>
              <ul className="flex flex-col gap-3">
                {["Билеты", "Контакты", "Пресса", "Партнёры"].map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-foreground mb-4">
              Подписка на новости
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              Узнавайте первыми о новых экспонатах и событиях.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="email@example.com"
                className="flex-1 bg-card border border-border/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors"
              />
              <button className="px-5 py-3 bg-primary text-primary-foreground text-xs tracking-widest uppercase hover:bg-accent transition-colors duration-300">
                OK
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-border/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground/50">
            &copy; 2026 Museo Negroni. Все права защищены.
          </p>
          <div className="flex items-center gap-6">
            {["Instagram", "Telegram", "Facebook"].map((social) => (
              <a
                key={social}
                href="#"
                className="text-xs text-muted-foreground/50 hover:text-primary transition-colors duration-300 tracking-wide"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
