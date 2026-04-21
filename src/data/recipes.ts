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
    id: 'moscow',
    city: 'Москва',
    lat: 55.7558,
    lng: 37.6173,
    recipe: {
      name: 'Московский Негрони',
      region: 'Москва',
      author: 'Команда BAR BOSS ONLINE',
      bar: '—',
      difficulty: 'easy',
      category: 'классический',
      barDescription: 'Городская интерпретация классики с локальным биттером.',
      barCity: 'Москва',
      tags: ['классика', 'биттер', 'цитрус'],
      intro: 'Акцент на классической тройке, усиленной локальным биттером. Городская, энергичная версия Негрони.',
      image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800',
      method: 'Stir',
      glass: 'Rocks',
      garnish: 'Апельсиновая цедра',
      ice: 'Big ice cube',
      prebatch: {
        name: 'Настойка «Московский биттер»',
        ingredients: ['500 мл нейтрального спирта или водки', 'Цедра 2 апельсинов', '1 палочка корицы', '5–6 зёрен кардамона', '1 ст. л. сушёного шиповника'],
        steps: ['Смешайте все ингредиенты в банке, плотно закройте.', 'Настаивайте 5–7 дней в тёмном прохладном месте, периодически встряхивая.', 'Процедите через фильтр и храните в бутылке.'],
      },
      flavorProfile: { bitter: 7, sweet: 4, sour: 3, spicy: 3, strong: 8 },
      ingredients: ['40 мл джина', '40 мл Кампари', '40 мл красного вермута', '2 дэша биттера «Московский» (по желанию)', 'Апельсиновая цедра для украшения'],
      steps: ['Наполните стакан для смешивания льдом.', 'Добавьте джин, Кампари и вермут.', 'Перемешайте 20–30 секунд.', 'Перелейте в бокал со свежим льдом (или подайте без льда).', 'Выжмите цедру апельсина над бокалом и опустите в напиток.'],
    },
  },
  {
    id: 'spb',
    city: 'Санкт-Петербург',
    lat: 59.9343,
    lng: 30.3351,
    recipe: {
      name: 'Петербургский Негрони',
      region: 'Санкт-Петербург',
      author: 'Команда BAR BOSS ONLINE',
      bar: '—',
      difficulty: 'medium',
      category: 'цветочный',
      barDescription: 'Петербургская школа с акцентом на элегантность и сухие профили.',
      barCity: 'Санкт-Петербург',
      tags: ['сухой', 'цветочный', 'лаванда', 'белый вермут'],
      intro: 'Более сухой и аристократичный вариант с белым вермутом и лавандой.',
      image: 'https://images.unsplash.com/photo-1583845112203-299a1b337b1c?w=800',
      method: 'Stir',
      glass: 'Rocks',
      garnish: 'Грейпфрут или апельсин',
      ice: 'Large cube',
      prebatch: {
        name: 'Лавандовый сироп',
        ingredients: ['200 мл воды', '200 г сахара', '1–2 ч. л. сушёной лаванды'],
        steps: ['Смешайте воду и сахар, доведите до кипения.', 'Добавьте лаванду, снимите с огня и настаивайте 10–15 минут.', 'Процедите и охладите.'],
      },
      flavorProfile: { bitter: 6, sweet: 3, sour: 2, spicy: 2, strong: 7 },
      ingredients: ['35 мл джина', '35 мл Кампари', '35 мл белого вермута', '5 мл лавандового сиропа (по желанию)', 'Ломтик грейпфрута или апельсина'],
      steps: ['Смешайте в стакане со льдом джин, Кампари и белый вермут.', 'Добавьте лавандовый сироп при желании.', 'Аккуратно перемешайте, перелейте в бокал.', 'Украсьте долькой грейпфрута или апельсина.'],
    },
  },
  {
    id: 'kazan',
    city: 'Казань',
    lat: 55.8304,
    lng: 49.0661,
    recipe: {
      name: 'Казанский Негрони',
      region: 'Казань',
      author: 'Команда BAR BOSS ONLINE',
      bar: '—',
      difficulty: 'easy',
      category: 'медовый',
      barDescription: 'Татарские традиции мёда в современной коктейльной форме.',
      barCity: 'Казань',
      tags: ['мёд', 'сладкий', 'региональный', 'татарский'],
      intro: 'Мёд из татарских пасек добавляет мягкую сладость и медовую глубину.',
      image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800',
      method: 'Stir',
      glass: 'Rocks',
      garnish: 'Апельсин',
      ice: 'Cubed ice',
      prebatch: { name: 'Медовый микс', ingredients: ['150 г цветочного мёда', '150 мл тёплой воды'], steps: ['Растворите мёд в тёплой воде до однородности.', 'Охладите и храните в холодильнике до недели.'] },
      flavorProfile: { bitter: 6, sweet: 5, sour: 2, spicy: 1, strong: 7 },
      ingredients: ['40 мл джина', '40 мл Кампари', '40 мл красного вермута', 'Чайная ложка мёда (татарский мёд)', 'Апельсин'],
      steps: ['В стакане для смешивания растворите мёд в небольшом количестве вермута.', 'Добавьте лёд, джин, Кампари и остальной вермут.', 'Перемешайте, перелейте в бокал со льдом.', 'Украсьте долькой апельсина.'],
    },
  },
  {
    id: 'sochi',
    city: 'Сочи',
    lat: 43.6028,
    lng: 39.7342,
    recipe: {
      name: 'Сочинский Негрони',
      region: 'Сочи',
      author: 'Команда BAR BOSS ONLINE',
      bar: '—',
      difficulty: 'easy',
      category: 'травяной',
      barDescription: 'Южная свежесть с базиликом и мятой — курортный стиль.',
      barCity: 'Сочи',
      tags: ['травы', 'свежий', 'летний', 'базилик', 'мята'],
      intro: 'Южный, свежий и зелёный Негрони с базиликом, мятой и цитрусом.',
      image: 'https://images.unsplash.com/photo-1564758564527-9afa6c73baf1?w=800',
      method: 'Build',
      glass: 'Rocks',
      garnish: 'Базилик, мята, лайм',
      ice: 'Cubed ice',
      prebatch: 'Для этого рецепта достаточно свежих трав и цитрусов — отдельные заготовки не требуются.',
      flavorProfile: { bitter: 6, sweet: 4, sour: 4, spicy: 1, strong: 6 },
      ingredients: ['40 мл джина', '40 мл Кампари', '40 мл красного вермута', 'Свежий базилик, мята', 'Долька лайма'],
      steps: ['В бокале слегка помните базилик и мяту.', 'Добавьте лёд, джин, Кампари и вермут.', 'Аккуратно перемешайте.', 'Украсьте веточкой базилика и долькой лайма.'],
    },
  },
  {
    id: 'ekb',
    city: 'Екатеринбург',
    lat: 56.8389,
    lng: 60.6057,
    recipe: {
      name: 'Уральский Негрони',
      region: 'Екатеринбург',
      author: 'Команда BAR BOSS ONLINE',
      bar: '—',
      difficulty: 'medium',
      category: 'пряный',
      barDescription: 'Уральский характер — структурный и согревающий.',
      barCity: 'Екатеринбург',
      tags: ['пряный', 'имбирь', 'крепкий'],
      intro: 'Характерный, структурный Негрони с лёгким имбирным теплом.',
      image: 'https://images.unsplash.com/photo-1570598912132-0ba1dc952b24?w=800',
      method: 'Stir',
      glass: 'Rocks',
      garnish: 'Апельсиновая цедра',
      ice: 'Large cube',
      prebatch: 'Имбирь можно настоять на вермуте заранее, чтобы получить более ровную пряность.',
      flavorProfile: { bitter: 7, sweet: 4, sour: 2, spicy: 4, strong: 8 },
      ingredients: ['40 мл джина', '40 мл Кампари', '40 мл красного вермута', 'Кусочек имбиря (по желанию)', 'Апельсиновая цедра'],
      steps: ['При желании натрите край бокала имбирём.', 'Смешайте в стакане со льдом все три компонента.', 'Перелейте в бокал со льдом.', 'Украсьте цедрой апельсина.'],
    },
  },
  {
    id: 'novosibirsk',
    city: 'Новосибирск',
    lat: 55.0084,
    lng: 82.9357,
    recipe: {
      name: 'Сибирский Негрони',
      region: 'Новосибирск',
      author: 'Команда BAR BOSS ONLINE',
      bar: '—',
      difficulty: 'medium',
      category: 'ягодный',
      barDescription: 'Сибирские ягоды — облепиха и клюква в коктейльном формате.',
      barCity: 'Новосибирск',
      tags: ['ягоды', 'кислый', 'северный', 'облепиха', 'клюква'],
      intro: 'Холодный и яркий, с акцентом на северные ягоды.',
      image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800',
      method: 'Stir',
      glass: 'Rocks',
      garnish: 'Ягоды и апельсин',
      ice: 'Cubed ice',
      prebatch: 'Ягодный кордиаль из облепихи или клюквы можно приготовить заранее для серии коктейлей.',
      flavorProfile: { bitter: 6, sweet: 4, sour: 5, spicy: 1, strong: 7 },
      ingredients: ['40 мл джина', '40 мл Кампари', '40 мл красного вермута', 'Ягоды облепихи или клюквы (по желанию)', 'Апельсин'],
      steps: ['Смешайте джин, Кампари и вермут со льдом.', 'Перелейте в бокал.', 'Добавьте несколько ягод облепихи или клюквы.', 'Украсьте долькой апельсина.'],
    },
  },
  {
    id: 'vladivostok',
    city: 'Владивосток',
    lat: 43.1198,
    lng: 131.8869,
    recipe: {
      name: 'Владивостокский Негрони',
      region: 'Владивосток',
      author: 'Команда BAR BOSS ONLINE',
      bar: '—',
      difficulty: 'hard',
      category: 'экзотический',
      barDescription: 'Дальневосточный умами — азиатские акценты в классической формуле.',
      barCity: 'Владивосток',
      tags: ['умами', 'азиатский', 'соевый', 'экзотический'],
      intro: 'Умами-версия Негрони с аккуратной нотой соевого соуса и цитрусов.',
      image: 'https://images.unsplash.com/photo-1600093463592-9f61807aef11?w=800',
      method: 'Stir',
      glass: 'Rocks',
      garnish: 'Мандариновая или лаймовая цедра',
      ice: 'Cubed ice',
      prebatch: 'Можно заранее смешать небольшую партию вермута с каплей соевого соуса для более контролируемого вкуса.',
      flavorProfile: { bitter: 6, sweet: 3, sour: 3, spicy: 2, strong: 8 },
      ingredients: ['40 мл джина', '40 мл Кампари', '40 мл красного вермута', 'Капля соевого соуса (по желанию)', 'Цедра мандарина или лайма'],
      steps: ['Смешайте в стакане со льдом джин, Кампари и вермут.', 'Добавьте каплю соевого соуса для глубины (по вкусу).', 'Перелейте в бокал со льдом.', 'Украсьте цедрой мандарина или лайма.'],
    },
  },
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
      intro: 'Каноническая формула 1:1:1, с которой начинается любая история Негрони.',
      image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=800',
      method: 'Stir',
      glass: 'Rocks',
      garnish: 'Апельсиновая цедра',
      ice: 'Large cube',
      prebatch: { name: 'Батч классического Негрони 1:1:1', ingredients: ['330 мл джина', '330 мл Кампари', '330 мл красного вермута'], steps: ['Смешайте все ингредиенты в бутылке.', 'Охладите в холодильнике и подавайте, разбавляя льдом при перемешивании.'] },
      flavorProfile: { bitter: 8, sweet: 4, sour: 2, spicy: 2, strong: 8 },
      ingredients: ['30 мл джина', '30 мл Кампари', '30 мл красного вермута (сладкий)', 'Апельсиновая цедра'],
      steps: ['Наполните стакан для смешивания льдом.', 'Влейте джин, Кампари и красный вермут в равных частях.', 'Перемешайте 20–30 секунд.', 'Перелейте в бокал со льдом (или без — по желанию).', 'Выжмите цедру апельсина над бокалом и опустите в напиток.'],
    },
  },
  {
    id: 'kaliningrad',
    city: 'Калининград',
    lat: 54.7104,
    lng: 20.5109,
    recipe: {
      name: 'Калининградский Негрони',
      region: 'Калининград',
      author: 'Команда BAR BOSS ONLINE',
      bar: '—',
      difficulty: 'easy',
      category: 'медовый',
      barDescription: 'Балтийский характер с янтарным мёдом и ликёром.',
      barCity: 'Калининград',
      tags: ['мёд', 'янтарь', 'балтийский', 'ликёр'],
      intro: 'Балтийский характер с намёком на янтарный мёд или ликёр.',
      image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=800',
      method: 'Stir',
      glass: 'Rocks',
      garnish: 'Апельсин',
      ice: 'Large cube',
      prebatch: 'Небольшое количество янтарного ликёра можно заранее смешать с вермутом для более мягкого профиля.',
      flavorProfile: { bitter: 6, sweet: 5, sour: 2, spicy: 1, strong: 7 },
      ingredients: ['40 мл джина', '40 мл Кампари', '40 мл красного вермута', 'Кусочек янтарного мёда или ликёр (по желанию)', 'Апельсин'],
      steps: ['Смешайте в стакане со льдом джин, Кампари и вермут.', 'При желании добавьте каплю мёда или ликёра.', 'Перелейте в бокал со льдом.', 'Украсьте долькой апельсина.'],
    },
  },
  {
    id: 'krasnodar',
    city: 'Краснодар',
    lat: 45.0357,
    lng: 38.9753,
    recipe: {
      name: 'Кубанский Негрони',
      region: 'Краснодар',
      author: 'Команда BAR BOSS ONLINE',
      bar: '—',
      difficulty: 'easy',
      category: 'фруктовый',
      barDescription: 'Солнечный и плодовый — летний Негрони с арбузом.',
      barCity: 'Краснодар',
      tags: ['фруктовый', 'арбуз', 'летний', 'мята'],
      intro: 'Солнечный, плодовый Негрони с мятой и сезонным арбузом.',
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800',
      method: 'Build',
      glass: 'Rocks',
      garnish: 'Мята, арбуз, апельсин',
      ice: 'Cubed ice',
      prebatch: 'Арбузный сок или пюре можно приготовить заранее и хранить в холодильнике не более суток.',
      flavorProfile: { bitter: 5, sweet: 6, sour: 3, spicy: 1, strong: 6 },
      ingredients: ['40 мл джина', '40 мл Кампари', '40 мл красного вермута', 'Веточка мяты, долька арбуза (по сезону)', 'Апельсин'],
      steps: ['Смешайте джин, Кампари и вермут со льдом.', 'Перелейте в бокал.', 'Украсьте мятой и при желании маленьким кусочком арбуза и апельсином.'],
    },
  },
  {
    id: 'samara',
    city: 'Самара',
    lat: 53.1959,
    lng: 50.1008,
    recipe: {
      name: 'Самарский Негрони',
      region: 'Самара',
      author: 'Команда BAR BOSS ONLINE',
      bar: '—',
      difficulty: 'easy',
      category: 'злаковый',
      barDescription: 'Поволжская мягкость с пшеничным акцентом.',
      barCity: 'Самара',
      tags: ['злаковый', 'мягкий', 'пшеничный'],
      intro: 'Поволжская вариация с лёгким злаковым акцентом и цитрусовой свежестью.',
      image: 'https://images.unsplash.com/photo-1504274066651-8d31a536b11a?w=800',
      method: 'Stir',
      glass: 'Rocks',
      garnish: 'Апельсин и злаковый снэк',
      ice: 'Cubed ice',
      prebatch: 'Можно заранее подготовить смесь вермута с лёгким пшеничным ликёром для более мягкого профиля.',
      flavorProfile: { bitter: 6, sweet: 4, sour: 3, spicy: 1, strong: 7 },
      ingredients: ['40 мл джина', '40 мл Кампари', '40 мл красного вермута', '5 мл пшеничного ликёра (по желанию)', 'Апельсиновая цедра'],
      steps: ['Наполните стакан для смешивания льдом.', 'Влейте джин, Кампари, вермут и, по желанию, пшеничный ликёр.', 'Перемешайте до охлаждения.', 'Перелейте в бокал со льдом и украсьте апельсином.'],
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
      bar: 'Good Karma bar',
      difficulty: 'medium',
      category: 'травяной',
      barDescription: 'Good Karma bar, Ярославль. По следам купца Алексея Акимовича Судакова, открывшего первый бар американского типа при ресторане «Медведь».',
      barCity: 'Ярославль',
      tags: ['ярославль', 'джинт', 'сливянка', 'ромашка', 'региональный'],
      intro: '«Ярославский Негрони» полностью отражает дух ярославского гостеприимства. По следам купца, открывшего первый бар американского типа при ресторане «Медведь» — Алексея Акимовича Судакова. В составе — джин Gintl с Ярославского ЯЛВЗ, ликёр из копчёного чернослива по рецепту 1904 г и ромашковый биттер.',
      image: '/images/yaroslavl-negroni.png',
      method: 'Stir',
      glass: 'Rocks',
      garnish: 'Вишня или чернослив в шоколаде',
      ice: 'Large cube',
      prebatch: {
        name: 'Ромашковый кордиал п/ф',
        ingredients: ['Тибетская ромашка 12 г', 'Кордиал классика 1 л (1 л сахарного сиропа, 30 мл лимонной кислоты)'],
        steps: ['Ингредиенты в кастрюлю, довести до закипания.', 'Остудить, отфильтровать.'],
      },
      flavorProfile: { bitter: 4, sweet: 5, sour: 3, spicy: 4, strong: 7 },
      ingredients: ['30 мл джина Gintl (Ярославский ЯЛВЗ)', '30 мл сливянки (ликёр из копчёного чернослива)', '20 мл ромашкового кордиала п/ф', '15 мл Кампари или Luxardo Bitter', 'Вишня или чернослив в шоколаде для украшения'],
      steps: ['Наполните стакан для смешивания льдом.', 'Добавьте джин Gintl, сливянку, ромашковый кордиал и биттер.', 'Перемешайте 20–30 секунд.', 'Перелейте в бокал рокс со льдом.', 'Украсьте вишней или черносливом в шоколаде.'],
      authorInstagram: 'https://www.instagram.com/alexandra_taran',
      authorTg: 'https://t.me/taranalexandra',
      barLink: 'https://www.instagram.com/goodkarma.bar',
    },
  },
  {
    id: 'irkutsk',
    city: 'Иркутск',
    lat: 52.2869,
    lng: 104.3050,
    recipe: {
      name: 'Байкальский Негрони',
      region: 'Иркутск',
      author: 'Команда BAR BOSS ONLINE',
      bar: '—',
      difficulty: 'hard',
      category: 'хвойный',
      barDescription: 'Байкальская чистота — хвойная настойка и кристальный лёд.',
      barCity: 'Иркутск',
      tags: ['хвойный', 'байкал', 'чистый', 'настойка'],
      intro: 'Чистый и прохладный профиль с еловыми нотами вокруг темы Байкала.',
      image: 'https://images.unsplash.com/photo-1551029506-0805c4f9b867?w=800',
      method: 'Stir',
      glass: 'Rocks',
      garnish: 'Цедра лимона и еловая веточка',
      ice: 'Large crystal-clear cube',
      prebatch: { name: 'Хвойная настойка', ingredients: ['500 мл водки', 'Небольшая горсть молодых еловых побегов', 'Цедра 1 лимона'], steps: ['Залейте побеги и цедру водкой.', 'Настаивайте 3–5 дней, затем процедите.', 'Используйте по 5–10 мл на коктейль.'] },
      flavorProfile: { bitter: 7, sweet: 3, sour: 3, spicy: 2, strong: 8 },
      ingredients: ['35 мл джина', '35 мл Кампари', '35 мл красного вермута', '5 мл хвойной настойки', 'Цедра лимона'],
      steps: ['Наполните стакан для смешивания льдом.', 'Влейте джин, Кампари, вермут и хвойную настойку.', 'Перемешайте 20–30 секунд и перелейте в охлаждённый бокал со льдом.', 'Украсьте цедрой лимона и небольшой еловой веточкой.'],
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
