import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { getRecipeById } from '@/data/recipes';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const recipe = getRecipeById(id)?.recipe;
  if (!recipe?.metaTitle) return {};
  return {
    title: recipe.metaTitle,
    description: recipe.metaDescription || recipe.intro,
  };
}

export default function RecipeLayout({ children }: { children: ReactNode }) {
  return children;
}
