export interface FlavorProfile {
  bitter: number;
  sweet: number;
  sour: number;
  spicy: number;
  strong: number;
}

export interface Prebatch {
  name: string;
  ingredients: string[];
  steps: string[];
}

export interface Recipe {
  name: string;
  region: string;
  author: string;
  bar: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  barDescription: string;
  barCity: string;
  tags: string[];
  intro: string;
  image: string;
  method: string;
  glass: string;
  garnish: string;
  ice: string;
  prebatch: string | Prebatch;
  flavorProfile: FlavorProfile;
  ingredients: string[];
  steps: string[];
  /** Ссылка на Instagram автора (URL или @handle). Для кнопки на карточке. */
  authorInstagram?: string;
  /** Ссылка на Telegram автора (URL или @handle). Для кнопки на карточке. */
  authorTg?: string;
  /** Фото автора коктейля для карточки рецепта. */
  authorImage?: string;
  /** Ссылка на бар (сайт, Instagram и т.д.). Для кнопки на карточке. */
  barLink?: string;
}

export interface RecipeEntry {
  id: string;
  city: string;
  lat: number;
  lng: number;
  recipe: Recipe;
}

export const recipes: RecipeEntry[] = [
  {
    id: 'classic',
    city: 'Классика (Флоренция)',
    lat: 43.7696,
    lng: 11.2558,
    recipe: {
      name: 'Классический Негрони',
      region: 'Италия, Флоренция (1919)',
      author: 'Граф Камилло Негрони',
      bar: 'Caffè Casoni, Флоренция',
      difficulty: 'easy',
      category: 'классический',
      barDescription: 'Легендарный бар во Флоренции, где был создан первый Негрони в 1919 году.',
      barCity: 'Флоренция, Италия',
      tags: ['классика', 'эталон', '1919', 'оригинал'],
      intro: 'Каноническая формула 1:1:1, где можжевеловая сухость джина, травяная горечь кампари и винная сладость вермута встречаются в идеальном балансе.',
      image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1200',
      method: 'Перемешивание',
      glass: 'Рокс',
      garnish: 'Широкая апельсиновая цедра, выраженная над бокалом',
      ice: 'Крупный куб льда',
      prebatch: {
        name: 'Батч классического Негрони (барная заготовка)',
        ingredients: [
          '500 мл сухого джина',
          '500 мл Кампари',
          '500 мл сладкого красного вермута',
          'Цедра 1 апельсина (опционально, на 20-30 мин инфьюза)',
        ],
        steps: [
          'Смешайте компоненты в стерильной бутылке в пропорции 1:1:1.',
          'При желании быстро ароматизируйте апельсиновой цедрой и удалите её.',
          'Храните в холодильнике, перед подачей отмеряйте 90 мл на порцию и перемешивайте со льдом.',
        ],
      },
      flavorProfile: { bitter: 8, sweet: 5, sour: 2, spicy: 2, strong: 8 },
      ingredients: [
        '30 мл сухого джина',
        '30 мл Кампари',
        '30 мл сладкого красного вермута',
        'Крупный куб льда',
        'Апельсиновая цедра',
      ],
      steps: [
        'Охладите рокс-бокал и стакан для смешивания.',
        'Наполните стакан для смешивания плотным кубиковым льдом.',
        'Добавьте джин, Кампари и красный вермут.',
        'Перемешивайте 20-30 секунд до шелковистой текстуры и лёгкого разбавления.',
        'Процедите в рокс-бокал на крупный куб льда.',
        'Выжмите эфирные масла апельсиновой цедры над напитком, протрите кромку бокала и опустите цедру внутрь.',
      ],
    },
  },
  {
    id: 'yaroslavl',
    city: 'Ярославль',
    lat: 57.6299,
    lng: 39.8737,
    recipe: {
      name: 'Ярославский Негрони',
      region: 'Ярославль',
      author: 'Александра Таран',
      bar: 'бар Good Karma',
      difficulty: 'medium',
      category: 'травяной',
      barDescription: 'бар Good Karma, Ярославль. По следам купца Алексея Акимовича Судакова, открывшего первый бар американского типа при ресторане «Медведь».',
      barCity: 'Ярославль',
      tags: ['ярославль', 'джинт', 'сливянка', 'ромашка', 'региональный'],
      intro: '«Ярославский Негрони» полностью отражает дух ярославского гостеприимства. По следам купца, открывшего первый бар американского типа при ресторане «Медведь» — Алексея Акимовича Судакова. В составе — джин Gintl с Ярославского ЯЛВЗ, ликёр из копчёного чернослива по рецепту 1904 г и ромашковый биттер.',
      image: '/images/recipes/yaroslavl-negroni.jpeg',
      method: 'Перемешивание',
      glass: 'Рокс',
      garnish: 'Вишня или чернослив в шоколаде',
      ice: 'Крупный куб льда',
      prebatch: {
        name: 'Ромашковый кордиал п/ф',
        ingredients: ['Тибетская ромашка 12 г', 'Кордиал классика 1 л (1 л сахарного сиропа, 30 мл лимонной кислоты)'],
        steps: ['Ингредиенты в кастрюлю, довести до закипания.', 'Остудить, отфильтровать.'],
      },
      flavorProfile: { bitter: 4, sweet: 5, sour: 3, spicy: 4, strong: 7 },
      ingredients: ['30 мл джина Gintl (Ярославский ЯЛВЗ)', '30 мл сливянки (ликёр из копчёного чернослива)', '20 мл ромашкового кордиала п/ф', '15 мл Кампари или Люксардо Биттер', 'Вишня или чернослив в шоколаде для украшения'],
      steps: ['Наполните стакан для смешивания льдом.', 'Добавьте джин Gintl, сливянку, ромашковый кордиал и биттер.', 'Перемешайте 20–30 секунд.', 'Перелейте в бокал рокс со льдом.', 'Украсьте вишней или черносливом в шоколаде.'],
      authorImage: '/images/recipes/yaroslavl-negroni.jpeg',
      authorInstagram: 'https://www.instagram.com/alexandra_taran',
      authorTg: 'https://t.me/taranalexandra',
      barLink: 'https://www.instagram.com/goodkarma.bar',
    },
  },
];

// Helper functions
export function getRecipeById(id: string): RecipeEntry | undefined {
  return recipes.find((r) => r.id === id);
}

export function getAllRegions(): string[] {
  const set = new Set<string>();
  recipes.forEach((r) => { if (r.recipe.region) set.add(r.recipe.region); });
  return Array.from(set).sort();
}

export function getAllTags(): string[] {
  const set = new Map<string, string>();
  recipes.forEach((r) => {
    r.recipe.tags.forEach((t) => { set.set(t.toLowerCase(), t); });
  });
  return Array.from(set.keys()).sort().map((k) => set.get(k)!);
}

export function getAllCategories(): string[] {
  const set = new Set<string>();
  recipes.forEach((r) => { if (r.recipe.category) set.add(r.recipe.category); });
  return Array.from(set).sort();
}

export function getAllDifficulties(): Array<'easy' | 'medium' | 'hard'> {
  return ['easy', 'medium', 'hard'];
}

export function filterRecipes(opts: {
  query?: string;
  region?: string;
  tags?: string[];
  flavor?: Record<string, [number, number]>;
  ingredients?: string;
  category?: string;
  difficulty?: string;
}): RecipeEntry[] {
  let result = [...recipes];

  if (opts.query) {
    const q = opts.query.trim().toLowerCase();
    if (q) {
      result = result.filter((r) => {
        const name = r.recipe.name.toLowerCase();
        const city = r.city.toLowerCase();
        const region = r.recipe.region?.toLowerCase() ?? '';
        const intro = r.recipe.intro?.toLowerCase() ?? '';
        return name.includes(q) || city.includes(q) || region.includes(q) || intro.includes(q);
      });
    }
  }

  if (opts.region) {
    result = result.filter((r) => r.recipe.region === opts.region);
  }

  if (opts.tags && opts.tags.length) {
    const lt = opts.tags.map((t) => t.toLowerCase());
    result = result.filter((r) =>
      lt.some((t) => r.recipe.tags.some((rt) => rt.toLowerCase() === t))
    );
  }

  if (opts.flavor) {
    const keys = Object.keys(opts.flavor);
    if (keys.length) {
      result = result.filter((r) => {
        const fp = r.recipe.flavorProfile;
        if (!fp) return false;
        return keys.every((key) => {
          const range = opts.flavor![key];
          if (!Array.isArray(range)) return true;
          const val = (fp as unknown as Record<string, number>)[key] || 0;
          return val >= range[0] && val <= range[1];
        });
      });
    }
  }

  if (opts.ingredients) {
    const ingQuery = opts.ingredients.trim().toLowerCase().split(/[,;]+/).map((s) => s.trim()).filter(Boolean);
    if (ingQuery.length) {
      result = result.filter((r) => {
        const ings = r.recipe.ingredients.join(' ').toLowerCase();
        return ingQuery.every((q) => ings.includes(q));
      });
    }
  }

  if (opts.category) {
    result = result.filter((r) => r.recipe.category === opts.category);
  }

  if (opts.difficulty) {
    result = result.filter((r) => r.recipe.difficulty === opts.difficulty);
  }

  return result;
}
