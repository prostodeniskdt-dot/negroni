import type { RecipeEntry } from '@/data/recipes';

export const TAG_GROUP_DEFINITIONS = [
  {
    id: 'style',
    title: 'Стиль и формат',
    description: 'Классика, твисты, авторские и сезонные вариации.',
    keywords: ['класс', 'твист', 'twist', 'автор', 'signature', 'сезон', 'бар', 'prebatch', 'батч'],
  },
  {
    id: 'taste',
    title: 'Вкус и аромат',
    description: 'Быстрый подбор по вкусовому профилю.',
    keywords: ['горь', 'слад', 'кисл', 'прян', 'цитрус', 'трав', 'ягод', 'фрукт', 'дым', 'кофе', 'сух'],
  },
  {
    id: 'ingredients',
    title: 'Ингредиенты',
    description: 'Ключевые напитки, добавки и акценты.',
    keywords: ['джин', 'вермут', 'биттер', 'кампари', 'ликер', 'ликёр', 'аперитив', 'апельс', 'грейп', 'тоник'],
  },
  {
    id: 'geo',
    title: 'География и контекст',
    description: 'Региональные, локальные и событийные подборки.',
    keywords: ['москва', 'петербург', 'санкт', 'сибир', 'юг', 'снг', 'росси', 'регион', 'локал', 'город'],
  },
] as const;

export type TagGroup = {
  id: string;
  title: string;
  description: string;
  keywords: readonly string[];
  tags: string[];
};

export function getTagGroupId(tag: string): string {
  const normalized = tag.toLowerCase();
  return (
    TAG_GROUP_DEFINITIONS.find((group) =>
      group.keywords.some((keyword) => normalized.includes(keyword))
    )?.id ?? 'other'
  );
}

export function groupTagsByCategory(tags: string[]): TagGroup[] {
  const groups: TagGroup[] = [
    ...TAG_GROUP_DEFINITIONS.map((group) => ({ ...group, tags: [] as string[] })),
    {
      id: 'other',
      title: 'Другое',
      description: 'Дополнительные теги из редакции.',
      keywords: [],
      tags: [],
    },
  ];

  tags.forEach((tag) => {
    const group = groups.find((item) => item.id === getTagGroupId(tag));
    group?.tags.push(tag);
  });

  return groups
    .map((group) => ({
      ...group,
      tags: group.tags.sort((a, b) => a.localeCompare(b, 'ru')),
    }))
    .filter((group) => group.tags.length > 0);
}

export function getPopularTagsFrom(entries: RecipeEntry[], limit = 10): string[] {
  const counts = new Map<string, { tag: string; count: number }>();

  entries.forEach((entry) => {
    entry.recipe.tags.forEach((tag) => {
      const key = tag.toLowerCase();
      const existing = counts.get(key);
      if (existing) {
        existing.count += 1;
      } else {
        counts.set(key, { tag, count: 1 });
      }
    });
  });

  return Array.from(counts.values())
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, 'ru'))
    .slice(0, limit)
    .map((item) => item.tag);
}
