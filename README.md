# Музей Негрони — Next.js + Tailwind

Онлайн-коллекция 100+ вариаций коктейля Негрони по городам России и мира.

## Запуск

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## Сборка

```bash
npm run build
npm start
```

## Структура проекта

```
src/
  app/                  # Маршруты (Next.js App Router)
    layout.tsx          # Общий layout (Header + Footer)
    providers.tsx       # ThemeProvider + I18nProvider
    page.tsx            # Главная страница
    collection/         # /collection — галерея рецептов
    recipe/[id]/        # /recipe/:id — детальный рецепт
    history/            # /history — таймлайн истории
    partners/           # /partners — партнёрская программа
    favorites/          # /favorites — избранные рецепты
    recipes/            # /recipes — карта рецептов
  components/           # Переиспользуемые компоненты
    Header.tsx
    Footer.tsx
    Reveal.tsx          # Анимация появления при скролле
  hooks/                # React-хуки
    useTheme.tsx        # Тёмная/светлая тема
    useI18n.tsx         # Интернационализация (ru/en)
    useFavorites.ts     # Избранное (localStorage)
    useReveal.ts        # IntersectionObserver
  data/
    recipes.ts          # Данные рецептов и фильтрация
  locales/
    ru.ts               # Русские тексты
    en.ts               # Английские тексты
legacy/                 # Старая HTML/CSS/JS версия (референс)
```

## Технологии

- **Next.js 15** (App Router, TypeScript)
- **Tailwind CSS 4**
- **React 19**

## Как добавить новый рецепт

1. Откройте `src/data/recipes.ts`
2. Добавьте новый объект в массив `recipes`
3. Заполните все поля: `id`, `city`, `lat`, `lng`, `recipe` (name, region, author, bar, tags, intro, image, method, glass, garnish, ice, prebatch, flavorProfile, ingredients, steps)

## Как добавить перевод

1. Добавьте ключ в `src/locales/ru.ts`
2. Добавьте перевод в `src/locales/en.ts`
3. Используйте `t('ваш.ключ')` в компонентах
