import { readFile } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { getRecipeById, recipes, type Prebatch, type RecipeEntry } from '@/data/recipes';
import { getRecipeAuthorImage, getRecipePageImage } from '@/lib/public-recipes';
import type { PdfRecipe } from '@/lib/pdf/RecipesPdf';

const difficultyLabel: Record<string, string> = {
  easy: 'Легко',
  medium: 'Средне',
  hard: 'Сложно',
};

const flavorLabels = [
  ['bitter', 'Горечь'],
  ['sweet', 'Сладость'],
  ['sour', 'Кислотность'],
  ['spicy', 'Пряность'],
  ['strong', 'Крепость'],
] as const;

function present(value?: string | null) {
  const text = value?.trim();
  if (!text || text === '—' || text === '-') return '';
  return text;
}

function asPrebatches(value: RecipeEntry['recipe']['prebatch']): {
  note: string;
  batches: Prebatch[];
} {
  if (typeof value === 'string') return { note: present(value), batches: [] };
  if (Array.isArray(value)) return { note: '', batches: value };
  if (value && typeof value === 'object') return { note: '', batches: [value] };
  return { note: '', batches: [] };
}

async function fileToJpeg(publicPath: string | undefined, maxWidth: number) {
  if (!publicPath) return null;
  const clean = publicPath.split('?')[0].split('#')[0];
  if (!clean.startsWith('/') || clean.startsWith('//')) return null;

  let decoded = clean;
  try {
    decoded = decodeURIComponent(clean);
  } catch {
    decoded = clean;
  }

  const absolute = path.join(process.cwd(), 'public', decoded.replace(/^\/+/, ''));
  try {
    const source = await readFile(absolute);
    const jpeg = await sharp(source)
      .rotate()
      .resize({ width: maxWidth, height: maxWidth, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 74, mozjpeg: true })
      .toBuffer();
    return `data:image/jpeg;base64,${jpeg.toString('base64')}`;
  } catch {
    return null;
  }
}

async function toPdfRecipe(entry: RecipeEntry): Promise<PdfRecipe> {
  const recipe = entry.recipe;
  const prebatch = asPrebatches(recipe.prebatch);
  const [image, authorImage] = await Promise.all([
    fileToJpeg(getRecipePageImage(recipe), 1100),
    fileToJpeg(getRecipeAuthorImage(recipe), 360),
  ]);

  return {
    slug: entry.id,
    name: recipe.name,
    region: present(recipe.region),
    city: present(entry.city),
    author: present(recipe.author),
    bar: present(recipe.bar),
    barCity: present(recipe.barCity),
    intro: present(recipe.intro),
    story: present(recipe.story),
    image,
    authorImage,
    method: present(recipe.method),
    glass: present(recipe.glass),
    garnish: present(recipe.garnish),
    ice: present(recipe.ice),
    difficulty: difficultyLabel[recipe.difficulty] ?? '',
    category: present(recipe.category),
    ingredients: (recipe.ingredients ?? []).map((item) => item.trim()).filter(Boolean),
    steps: (recipe.steps ?? []).map((item) => item.trim()).filter(Boolean),
    prebatchNote: prebatch.note,
    prebatches: prebatch.batches
      .map((batch) => ({
        name: present(batch.name) || 'Заготовка',
        ingredients: (batch.ingredients ?? []).map((item) => item.trim()).filter(Boolean),
        steps: (batch.steps ?? []).map((item) => item.trim()).filter(Boolean),
      }))
      .filter((batch) => batch.ingredients.length > 0 || batch.steps.length > 0),
    flavor: flavorLabels.map(([key, label]) => ({
      label,
      value: Math.max(0, Math.min(10, Number(recipe.flavorProfile?.[key] ?? 0))),
    })),
  };
}

export async function loadPdfRecipes(ids: string[]): Promise<PdfRecipe[]> {
  const unique = [...new Set(ids.map((id) => id.trim()).filter(Boolean))];
  const entries = unique
    .map((id) => getRecipeById(id))
    .filter((entry): entry is RecipeEntry => Boolean(entry));
  return Promise.all(entries.map(toPdfRecipe));
}

export function allRecipeIds() {
  return recipes.map((entry) => entry.id);
}
