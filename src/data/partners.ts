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
  phone?: string;
  phoneLabel?: string;
  phoneLabelEn?: string;
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
  tagline?: string;
  taglineEn?: string;
  description: string;
  descriptionEn: string;
  producer?: string;
  producerEn?: string;
  origin?: string;
  originEn?: string;
  abv?: string;
  volume?: string;
  tastingNotes?: string;
  serve?: string;
  serveEn?: string;
  buyUrl?: string;
  buyLabel?: string;
  buyLabelEn?: string;
  purchaseNote?: string;
  purchaseNoteEn?: string;
  recipeHints?: string;
  sortOrder?: number;
  isActive?: boolean;
  notebookStyle?: boolean;
  isNew?: boolean;
  companyBlockTitle?: string;
  companyBlockTitleEn?: string;
  companyName?: string;
  companyNameEn?: string;
  companyContacts?: string[];
  companyContactsEn?: string[];
  storyTitle?: string;
  storyTitleEn?: string;
  tastingTitle?: string;
  tastingTitleEn?: string;
}

// Партнёры
export const partners: Partner[] = [
  {
    id: 'partner-bartenders-united',
    name: 'Bartenders United / JOIA',
    nameEn: 'Bartenders United / JOIA',
    isGeneralPartner: false,
    description: 'Премиальный сухой джин новой линейки Bartenders United от JOIA.',
    descriptionEn: 'Premium dry gin from the new Bartenders United line by JOIA.',
    link: 'https://joiastore.ru/product/dzhin_bartenders_yunayted_london_dray_0_7l/',
    phone: '+7 (495) 495-95-95',
    phoneLabel: 'JOIA / партнёрский отдел',
    phoneLabelEn: 'JOIA / partner desk',
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
];

// Напитки
export const drinks: Drink[] = [
  {
    id: 'bartenders-united-london-dry',
    categoryId: 'gin',
    name: 'BARTENDERS UNITED LONDON DRY GIN',
    nameEn: 'BARTENDERS UNITED LONDON DRY GIN',
    partnerId: 'partner-bartenders-united',
    image: '/images/partners/bartenders-united-london-dry-gin.png',
    tagline: 'Новинка. Премиальный сухой джин 43% алк.',
    taglineEn: 'New arrival. Premium dry gin at 43% ABV.',
    description:
      'Первая новинка новой линейки Bartenders United на сайте JOIA. Джин создан основателем JOIA совместно с ведущими барменами и креативной командой из Дублина.',
    descriptionEn:
      'The first release from the new Bartenders United line on JOIA. Created by the JOIA founder together with leading bartenders and a Dublin-based creative team.',
    producer: 'NIVA DISTILLERY по заказу JOIA',
    producerEn: 'NIVA DISTILLERY for JOIA',
    origin: 'Санкт-Петербург, Россия',
    originEn: 'Saint Petersburg, Russia',
    abv: '43%',
    volume: '0.7 л',
    tastingNotes:
      'Аромат: цедра лимона и мандарина, травянистые ноты и свежий можжевельник. Вкус: можжевельник, цитрус, саган-дайля, сычуанский перец, чистый сухой финиш.',
    serve:
      'Отлично работает в классическом Негрони, сухих твистах и highball-подаче с тоником и цитрусом.',
    serveEn:
      'Performs well in classic Negroni, dry twists, and highball serves with tonic and citrus.',
    buyUrl: 'https://joiastore.ru/product/dzhin_bartenders_yunayted_london_dray_0_7l/',
    buyLabel: 'Смотреть на JOIA',
    buyLabelEn: 'View on JOIA',
    purchaseNote:
      'Креативная команда бренда работала с международным опытом проектов Shed Distillery, Gunpowder Gin, The Dead Rabbit, Johnnie Walker Experience и Guinness Open Gate.',
    purchaseNoteEn:
      'The creative team brings international experience from Shed Distillery, Gunpowder Gin, The Dead Rabbit, Johnnie Walker Experience, and Guinness Open Gate.',
    recipeHints: 'classic,yaroslavl',
    sortOrder: 1,
    isActive: true,
    notebookStyle: true,
    isNew: true,
    storyTitle: 'Описание / легенда',
    storyTitleEn: 'Story / legend',
    tastingTitle: 'Дегустация',
    tastingTitleEn: 'Tasting',
    companyBlockTitle: 'Компания',
    companyBlockTitleEn: 'Company',
    companyName: 'JOIA',
    companyNameEn: 'JOIA',
    companyContacts: [
      'Создан основателем JOIA совместно с ведущими барменами.',
      'Технология: London dry, дистилляция малыми партиями в медном аламбике.',
      'В ближайшее время: земляника-личи, далее вкусы табака и умами.',
    ],
    companyContactsEn: [
      'Created by the JOIA founder with leading bartenders.',
      'London dry technology, small-batch copper alembic distillation.',
      'Upcoming line extension: strawberry-lychee, then tobacco and umami profiles.',
    ],
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

export function getCategoryBySlug(slug: string): DrinkCategory | undefined {
  return drinkCategories.find((c) => c.slug === slug || c.id === slug);
}

export function getDrinksByCategory(categoryId: string): Drink[] {
  return drinks
    .filter((d) => d.categoryId === categoryId)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.name.localeCompare(b.name, 'ru'));
}

export function getDrinkById(id: string): Drink | undefined {
  return drinks.find((d) => d.id === id);
}

export function getDrinkByCategoryAndId(categorySlug: string, drinkId: string): Drink | undefined {
  const category = getCategoryBySlug(categorySlug);
  if (!category) return undefined;
  return drinks.find((d) => d.categoryId === category.id && d.id === drinkId);
}
