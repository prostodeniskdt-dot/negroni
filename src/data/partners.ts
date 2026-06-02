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

// Партнёры (заглушки)
export const partners: Partner[] = [
  {
    id: 'general',
    name: 'Генеральный партнёр',
    nameEn: 'General Partner',
    isGeneralPartner: true,
    description: 'Общие рецепты без указания конкретного бара и бренда. Классические вариации от генерального партнёра.',
    descriptionEn: 'General recipes without a specific bar or brand. Classic variations from the general partner.',
    phone: '+7 (495) 123-45-67',
    phoneLabel: 'BAR BOSS ONLINE',
    phoneLabelEn: 'BAR BOSS ONLINE',
  },
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
    id: 'bartenders-united-london-dry',
    categoryId: 'gin',
    name: 'BARTENDERS UNITED LONDON DRY GIN',
    nameEn: 'BARTENDERS UNITED LONDON DRY GIN',
    partnerId: 'partner-bartenders-united',
    image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=900',
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
    recipeHints: 'classic-negroni,dry-negroni,signature-negroni',
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
  {
    id: 'gin-classic',
    categoryId: 'gin',
    name: 'Джин классический',
    nameEn: 'Classic Gin',
    partnerId: 'general',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400',
    tagline: 'Сухая база для канонического Негрони',
    taglineEn: 'A dry base for a canonical Negroni',
    description: 'Универсальный лондонский сухой джин для классической тройки.',
    descriptionEn: 'Universal London dry gin for the classic trio.',
    producer: 'Negroni Museum Selection',
    producerEn: 'Negroni Museum Selection',
    origin: 'Великобритания / учебная карточка',
    originEn: 'United Kingdom / demo card',
    abv: '40%',
    volume: '700 мл',
    tastingNotes: 'Можжевельник, лимонная цедра, сухие травы, чистый финиш',
    serve: 'Лучше работает в классике 1:1:1 с красным вермутом и биттером.',
    serveEn: 'Best in the 1:1:1 classic with red vermouth and bitter.',
    buyUrl: 'https://barbossonline.ru/',
    buyLabel: 'Уточнить у партнёра',
    buyLabelEn: 'Ask partner',
    purchaseNote: 'Заглушка карточки: здесь будет ссылка на магазин, дистрибьютора или страницу бренда.',
    purchaseNoteEn: 'Demo card: this place will contain a store, distributor or brand link.',
    recipeHints: 'classic-negroni,moscow-negroni',
    sortOrder: 10,
    isActive: false,
  },
  {
    id: 'gin-floral',
    categoryId: 'gin',
    name: 'Джин цветочный',
    nameEn: 'Floral Gin',
    partnerId: 'partner-bartenders-united',
    image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400',
    tagline: 'Для мягких авторских твистов',
    taglineEn: 'For soft signature twists',
    description: 'Цветочные и травяные ноты для более мягкого профиля.',
    descriptionEn: 'Floral and herbal notes for a softer profile.',
    producer: 'Gin House',
    producerEn: 'Gin House',
    origin: 'Россия / демо-партнёр',
    originEn: 'Russia / demo partner',
    abv: '43%',
    volume: '500 мл',
    tastingNotes: 'Лаванда, ромашка, кориандр, цитрусовые корки',
    serve: 'Подходит для белых и цветочных твистов Негрони.',
    serveEn: 'Fits white and floral Negroni twists.',
    buyUrl: 'https://barbossonline.ru/',
    buyLabel: 'Где купить',
    buyLabelEn: 'Where to buy',
    purchaseNote: 'Добавьте контакты поставщика, условия заказа и географию доставки.',
    purchaseNoteEn: 'Add supplier contacts, order terms and delivery geography.',
    recipeHints: 'floral-negroni,white-negroni',
    sortOrder: 20,
    isActive: false,
  },
  {
    id: 'gin-citrus',
    categoryId: 'gin',
    name: 'Джин цитрусовый',
    nameEn: 'Citrus Gin',
    partnerId: 'partner-bartenders-united',
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400',
    description: 'Яркие цитрусовые акценты для освежающих вариаций.',
    descriptionEn: 'Bright citrus accents for refreshing variations.',
    isActive: false,
  },
  {
    id: 'vermouth-red',
    categoryId: 'vermouth',
    name: 'Вермут красный',
    nameEn: 'Red Vermouth',
    partnerId: 'general',
    image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400',
    tagline: 'Сладкий вермут для классической связки',
    taglineEn: 'Sweet vermouth for the classic build',
    description: 'Сладкий красный вермут — основа канонического Негрони.',
    descriptionEn: 'Sweet red vermouth — the base of the canonical Negroni.',
    producer: 'Vermouth & Co',
    producerEn: 'Vermouth & Co',
    origin: 'Италия / учебная карточка',
    originEn: 'Italy / demo card',
    abv: '16%',
    volume: '750 мл',
    tastingNotes: 'Полынь, карамель, специи, апельсиновая корка',
    serve: 'Охлаждать после открытия, использовать в классике и выдержанных вариациях.',
    serveEn: 'Keep chilled after opening, use in classics and aged variations.',
    buyUrl: 'https://barbossonline.ru/',
    buyLabel: 'Перейти к партнёру',
    buyLabelEn: 'Open partner page',
    purchaseNote: 'Здесь можно разместить актуальную цену, город и способ покупки.',
    purchaseNoteEn: 'Place current price, city and purchase method here.',
    recipeHints: 'classic-negroni,barrel-negroni',
    sortOrder: 10,
    isActive: false,
  },
  {
    id: 'vermouth-white',
    categoryId: 'vermouth',
    name: 'Вермут белый',
    nameEn: 'White Vermouth',
    partnerId: 'general',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400',
    description: 'Более сухой и лёгкий профиль для элегантных твистов.',
    descriptionEn: 'Drier, lighter profile for elegant twists.',
    isActive: false,
  },
  {
    id: 'vermouth-dry',
    categoryId: 'vermouth',
    name: 'Вермут сухой',
    nameEn: 'Dry Vermouth',
    partnerId: 'general',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400',
    description: 'Минимальная сладость, травяные ноты.',
    descriptionEn: 'Minimal sweetness, herbal notes.',
    isActive: false,
  },
  {
    id: 'bitter-campari',
    categoryId: 'bitter',
    name: 'Кампари',
    nameEn: 'Campari',
    partnerId: 'general',
    image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=400',
    tagline: 'Горькое сердце Негрони',
    taglineEn: 'The bitter heart of Negroni',
    description: 'Классический итальянский биттер — неизменный ингредиент Негрони.',
    descriptionEn: 'Classic Italian bitter — the constant ingredient of the Negroni.',
    producer: 'Bitter Lab',
    producerEn: 'Bitter Lab',
    origin: 'Италия / учебная карточка',
    originEn: 'Italy / demo card',
    abv: '25%',
    volume: '700 мл',
    tastingNotes: 'Горький апельсин, травы, коренья, красные ягоды',
    serve: 'Использовать как основной горький компонент или сравнивать с локальными биттерами.',
    serveEn: 'Use as the core bitter component or compare with local bitters.',
    buyUrl: 'https://barbossonline.ru/',
    buyLabel: 'Информация о покупке',
    buyLabelEn: 'Purchase info',
    purchaseNote: 'В реальной карточке будет ссылка на партнёрский каталог или форму заявки.',
    purchaseNoteEn: 'A real card will link to the partner catalog or request form.',
    recipeHints: 'classic-negroni,boulevardier',
    sortOrder: 10,
    isActive: false,
  },
  {
    id: 'bitter-local',
    categoryId: 'bitter',
    name: 'Локальные биттеры',
    nameEn: 'Local Bitters',
    partnerId: 'general',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400',
    description: 'Региональные биттеры и настойки для уникальных вариаций.',
    descriptionEn: 'Regional bitters and tinctures for unique variations.',
    isActive: false,
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
    isActive: false,
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
    isActive: false,
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
