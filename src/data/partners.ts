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
    description:
      'Первый премиальный London Dry джин с российскими корнями — совместный проект JOIA и ведущих барменов.',
    descriptionEn:
      'The first premium London Dry gin with Russian roots — a joint project by JOIA and leading bartenders.',
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
    name: 'Bartenders United London Dry Gin',
    nameEn: 'Bartenders United London Dry Gin',
    partnerId: 'partner-bartenders-united',
    image: '/images/partners/bartenders-united-london-dry-gin.png',
    tagline: 'Премиальный сухой джин 43%. Флагман линейки Bartenders United.',
    taglineEn: 'Premium dry gin at 43% ABV. The flagship of the Bartenders United line.',
    description:
      'Строгий, плотный, терруарный London Dry из Санкт-Петербурга. Семь ботаникалов выстраивают профиль от хвойного фундамента через парфюмерный каффир-лайм до нуммирующего финиша сычуанского перца и сибирской минеральности.',
    descriptionEn:
      'A strict, dense, terroir-driven London Dry from Saint Petersburg. Seven botanicals build a profile from a piney foundation through perfumed kaffir lime to the numbing finish of Sichuan pepper and Siberian minerality.',
    producer: 'NIVA Distillery по заказу JOIA',
    producerEn: 'NIVA Distillery for JOIA',
    origin: 'Санкт-Петербург, Россия',
    originEn: 'Saint Petersburg, Russia',
    abv: '43%',
    volume: '0,7 л',
    tastingNotes:
      'Аромат: цедра лимона и мандарина, хвойный можжевельник, парфюмерный каффир-лайм, саган-дайля. Вкус: можжевельник, цитрус, ангелика, сычуанский перец, исландский мох, сухой минеральный финиш.',
    serve:
      'Сухая структура и яркая цитрусовая ароматика делают джин идеальной базой для классического Негрони: он держит баланс с Кампари и сладким вермутом, не уступая горечи и не теряя хвойного ядра.',
    serveEn:
      'Dry structure and bright citrus aromatics make it an ideal base for a classic Negroni: it holds balance with Campari and sweet vermouth without losing its juniper core.',
    buyUrl: 'https://joiastore.ru/product/dzhin_bartenders_yunayted_london_dray_0_7l/',
    buyLabel: 'Смотреть на JOIA',
    buyLabelEn: 'View on JOIA',
    purchaseNote:
      'На этикетке — два бармена, олицетворяющие соавторов проекта: Дениса Барабанова (CEO JOIA) и Ричарда (креативный директор DKG). Команда объединила экспертизу JOIA в премиальном винном сегменте и миксологический опыт ирландского агентства DKG — за плечами проекты The Dead Rabbit, Guinness Open Gate, Johnnie Walker Experience, Gunpowder Gin и Shed Distillery. Девиз бренда — Raise the bar: джин создан для барменов, чтобы поднять планку вкуса и объединить профессиональное сообщество.',
    purchaseNoteEn:
      'The label shows two bartenders representing co-creators Denis Barabanov (CEO, JOIA) and Richard (Creative Director, DKG). The team combined JOIA’s premium wine expertise with DKG’s mixology background — including The Dead Rabbit, Guinness Open Gate, Johnnie Walker Experience, Gunpowder Gin and Shed Distillery. Brand motto: Raise the bar.',
    recipeHints: 'classic,yaroslavl',
    sortOrder: 1,
    isActive: true,
    notebookStyle: true,
    isNew: false,
    storyTitle: 'История создания',
    storyTitleEn: 'Creation story',
    tastingTitle: 'Дегустационные ноты',
    tastingTitleEn: 'Tasting notes',
    companyBlockTitle: 'О бренде',
    companyBlockTitleEn: 'About the brand',
    companyName: 'Bartenders United / JOIA',
    companyNameEn: 'Bartenders United / JOIA',
    companyContacts: [
      'Технология London Dry: дистилляция ботаникалов и цитрусовых в медном кубе с джин-корзиной, без сахара, ароматизаторов и красителей.',
      'Крепость 43%, мелкосерийное производство, классический медный аламбик, ручная работа.',
      'В линейке скоро: джин «Земляника и личи», затем табачный и умами-профили. Платформа bartendersunited.ru — для гест-бартендингов, обмена опытом и поддержки молодых талантов.',
    ],
    companyContactsEn: [
      'London Dry technology: botanicals and citrus distilled in a copper pot still with a gin basket, with no sugar, flavourings or colourings.',
      '43% ABV, small-batch production, classic copper alembic, handcrafted.',
      'Coming soon in the line: Wild Strawberry & Lychee, then tobacco and umami profiles. Platform bartendersunited.ru supports guest shifts, knowledge sharing and young talent.',
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
