export interface Curation {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  recipeIds: string[];
  icon: string;
}

export const curations: Curation[] = [
  {
    id: 'summer',
    title: 'Летние Негрони',
    titleEn: 'Summer Negroni',
    description: 'Освежающие вариации для тёплого сезона — с фруктами, травами и цитрусами. Идеальны для террасы, барбекю или вечернего коктейля на закате.',
    descriptionEn: 'Refreshing variations for the warm season — with fruits, herbs and citrus. Perfect for a terrace, barbecue or sunset cocktail.',
    recipeIds: ['sochi', 'krasnodar', 'spb'],
    icon: '☀️',
  },
  {
    id: 'siberian',
    title: 'Сибирские и северные твисты',
    titleEn: 'Siberian & Northern Twists',
    description: 'Ягоды, хвоя, мёд — северные ингредиенты придают Негрони глубину и характер. Рецепты из самых холодных регионов России.',
    descriptionEn: 'Berries, pine, honey — northern ingredients add depth and character. Recipes from the coldest regions of Russia.',
    recipeIds: ['novosibirsk', 'irkutsk', 'kazan'],
    icon: '❄️',
  },
  {
    id: 'home-bar',
    title: 'Для домашнего бара',
    titleEn: 'For the Home Bar',
    description: 'Простые в приготовлении рецепты, которые не требуют редких ингредиентов. Начните с классики и двигайтесь к твистам.',
    descriptionEn: 'Easy-to-make recipes that don\'t require rare ingredients. Start with the classic and move to twists.',
    recipeIds: ['classic', 'moscow', 'kazan', 'sochi'],
    icon: '🏠',
  },
  {
    id: 'spicy-strong',
    title: 'Крепкие и пряные',
    titleEn: 'Strong & Spicy',
    description: 'Для тех, кто любит погорчее и покрепче. Имбирь, хвоя, биттеры — максимум характера в одном бокале.',
    descriptionEn: 'For those who like it bitter and strong. Ginger, pine, bitters — maximum character in one glass.',
    recipeIds: ['ekb', 'irkutsk', 'classic', 'moscow'],
    icon: '🔥',
  },
  {
    id: 'exotic',
    title: 'Экзотические вариации',
    titleEn: 'Exotic Variations',
    description: 'Необычные ингредиенты и неожиданные сочетания — умами, соевый соус, янтарный мёд, пшеничный ликёр. Негрони за пределами привычного.',
    descriptionEn: 'Unusual ingredients and unexpected combinations — umami, soy sauce, amber honey. Negroni beyond the ordinary.',
    recipeIds: ['vladivostok', 'kaliningrad', 'samara', 'yaroslavl'],
    icon: '🌏',
  },
];

export function getCurationById(id: string): Curation | undefined {
  return curations.find((c) => c.id === id);
}
