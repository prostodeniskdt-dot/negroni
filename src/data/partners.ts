/**
 * Партнёры, категории напитков и каталог напитков.
 * Используется на странице «Партнёры» для каталога джинов, вермутов, биттеров и т.д.
 */

export interface Partner {
  id: string;
  name: string;
  nameEn: string;
  isGeneralPartner: boolean;
  logo?: string;
  description: string;
  descriptionEn: string;
  link?: string;
}

export interface DrinkCategory {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  icon?: string;
  description: string;
  descriptionEn: string;
}

export interface Drink {
  id: string;
  categoryId: string;
  name: string;
  nameEn: string;
  partnerId: string;
  image?: string;
  description: string;
  descriptionEn: string;
}

// Партнёры (заглушки)
export const partners: Partner[] = [
  {
    id: 'general',
    name: 'Генеральный партнёр',
    nameEn: 'General Partner',
    isGeneralPartner: true,
    description: 'Общие рецепты без указания конкретного бара и бренда. Классические вариации Негрони от генерального партнёра.',
    descriptionEn: 'General recipes without a specific bar or brand. Classic Negroni variations from the general partner.',
  },
  {
    id: 'partner-gin',
    name: 'Gin House',
    nameEn: 'Gin House',
    isGeneralPartner: false,
    logo: '/placeholder-logo.svg',
    description: 'Крафтовые джины для экспериментов с Негрони.',
    descriptionEn: 'Craft gins for Negroni experiments.',
    link: '#',
  },
  {
    id: 'partner-vermouth',
    name: 'Vermouth & Co',
    nameEn: 'Vermouth & Co',
    isGeneralPartner: false,
    logo: '/placeholder-logo.svg',
    description: 'Красные и белые вермуты для классики и твистов.',
    descriptionEn: 'Red and white vermouths for classic and twisted Negronis.',
    link: '#',
  },
  {
    id: 'partner-bitter',
    name: 'Bitter Lab',
    nameEn: 'Bitter Lab',
    isGeneralPartner: false,
    logo: '/placeholder-logo.svg',
    description: 'Биттеры и аперитивы для горьких акцентов.',
    descriptionEn: 'Bitters and aperitivi for bitter accents.',
    link: '#',
  },
];

// Категории напитков
export const drinkCategories: DrinkCategory[] = [
  {
    id: 'gin',
    slug: 'gin',
    name: 'Джины',
    nameEn: 'Gins',
    description: 'База классического Негрони. Сухой джин даёт структуру и крепость.',
    descriptionEn: 'The base of the classic Negroni. Dry gin adds structure and strength.',
  },
  {
    id: 'vermouth',
    slug: 'vermouth',
    name: 'Вермуты',
    nameEn: 'Vermouths',
    description: 'Красный или белый вермут добавляет сладость и аромат.',
    descriptionEn: 'Red or white vermouth adds sweetness and aroma.',
  },
  {
    id: 'bitter',
    slug: 'bitter',
    name: 'Биттеры',
    nameEn: 'Bitters',
    description: 'Кампари и другие биттеры — душа горького профиля Негрони.',
    descriptionEn: 'Campari and other bitters are the soul of the Negroni\'s bitter profile.',
  },
  {
    id: 'liqueur',
    slug: 'liqueur',
    name: 'Ликёры',
    nameEn: 'Liqueurs',
    description: 'Дополнительные ликёры для твистов и региональных вариаций.',
    descriptionEn: 'Additional liqueurs for twists and regional variations.',
  },
];

// Напитки (заглушки по 2–3 на категорию)
export const drinks: Drink[] = [
  {
    id: 'gin-classic',
    categoryId: 'gin',
    name: 'Джин классический',
    nameEn: 'Classic Gin',
    partnerId: 'general',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400',
    description: 'Универсальный лондонский сухой джин для классической тройки.',
    descriptionEn: 'Universal London dry gin for the classic trio.',
  },
  {
    id: 'gin-floral',
    categoryId: 'gin',
    name: 'Джин цветочный',
    nameEn: 'Floral Gin',
    partnerId: 'partner-gin',
    image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400',
    description: 'Цветочные и травяные ноты для более мягкого профиля.',
    descriptionEn: 'Floral and herbal notes for a softer profile.',
  },
  {
    id: 'gin-citrus',
    categoryId: 'gin',
    name: 'Джин цитрусовый',
    nameEn: 'Citrus Gin',
    partnerId: 'partner-gin',
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400',
    description: 'Яркие цитрусовые акценты для освежающих вариаций.',
    descriptionEn: 'Bright citrus accents for refreshing variations.',
  },
  {
    id: 'vermouth-red',
    categoryId: 'vermouth',
    name: 'Вермут красный',
    nameEn: 'Red Vermouth',
    partnerId: 'general',
    image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400',
    description: 'Сладкий красный вермут — основа канонического Негрони.',
    descriptionEn: 'Sweet red vermouth — the base of the canonical Negroni.',
  },
  {
    id: 'vermouth-white',
    categoryId: 'vermouth',
    name: 'Вермут белый',
    nameEn: 'White Vermouth',
    partnerId: 'partner-vermouth',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400',
    description: 'Более сухой и лёгкий профиль для элегантных твистов.',
    descriptionEn: 'Drier, lighter profile for elegant twists.',
  },
  {
    id: 'vermouth-dry',
    categoryId: 'vermouth',
    name: 'Вермут сухой',
    nameEn: 'Dry Vermouth',
    partnerId: 'partner-vermouth',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400',
    description: 'Минимальная сладость, травяные ноты.',
    descriptionEn: 'Minimal sweetness, herbal notes.',
  },
  {
    id: 'bitter-campari',
    categoryId: 'bitter',
    name: 'Кампари',
    nameEn: 'Campari',
    partnerId: 'general',
    image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=400',
    description: 'Классический итальянский биттер — неизменный ингредиент Негрони.',
    descriptionEn: 'Classic Italian bitter — the constant ingredient of the Negroni.',
  },
  {
    id: 'bitter-local',
    categoryId: 'bitter',
    name: 'Локальные биттеры',
    nameEn: 'Local Bitters',
    partnerId: 'partner-bitter',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400',
    description: 'Региональные биттеры и настойки для уникальных вариаций.',
    descriptionEn: 'Regional bitters and tinctures for unique variations.',
  },
  {
    id: 'liqueur-honey',
    categoryId: 'liqueur',
    name: 'Медовые ликёры',
    nameEn: 'Honey Liqueurs',
    partnerId: 'general',
    image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400',
    description: 'Мягкая сладость и медовые ноты для тёплых твистов.',
    descriptionEn: 'Soft sweetness and honey notes for warm twists.',
  },
  {
    id: 'liqueur-herbal',
    categoryId: 'liqueur',
    name: 'Травяные ликёры',
    nameEn: 'Herbal Liqueurs',
    partnerId: 'general',
    image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400',
    description: 'Травяные и цветочные акценты для сложных профилей.',
    descriptionEn: 'Herbal and floral accents for complex profiles.',
  },
];

// Хелперы
export function getPartnerById(id: string): Partner | undefined {
  return partners.find((p) => p.id === id);
}

export function getGeneralPartner(): Partner | undefined {
  return partners.find((p) => p.isGeneralPartner);
}

export function getCategoryById(id: string): DrinkCategory | undefined {
  return drinkCategories.find((c) => c.id === id);
}

export function getDrinksByCategory(categoryId: string): Drink[] {
  return drinks.filter((d) => d.categoryId === categoryId);
}

export function getDrinkById(id: string): Drink | undefined {
  return drinks.find((d) => d.id === id);
}
