import { readFile } from 'fs/promises';
import path from 'path';
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
    try {
      const sharp = (await import('sharp')).default;
      const image = sharp(source).rotate();
      const meta = await image.metadata();
      const width = meta.width ?? maxWidth;
      const height = meta.height ?? maxWidth;
      const jpeg = await image
        .resize({ width: maxWidth, height: maxWidth, fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 82, mozjpeg: true })
        .toBuffer();
      const resized = await sharp(jpeg).metadata();
      return {
        src: `data:image/jpeg;base64,${jpeg.toString('base64')}`,
        width: resized.width ?? width,
        height: resized.height ?? height,
      };
    } catch {
      const extension = path.extname(absolute).toLowerCase();
      const mime = extension === '.png' ? 'image/png' : extension === '.jpg' || extension === '.jpeg' ? 'image/jpeg' : '';
      if (!mime) return null;
      return {
        src: `data:${mime};base64,${source.toString('base64')}`,
        width: maxWidth,
        height: Math.round(maxWidth * 0.75),
      };
    }
  } catch {
    return null;
  }
}

async function toPdfRecipe(entry: RecipeEntry): Promise<PdfRecipe> {
  const recipe = entry.recipe;
  const prebatch = asPrebatches(recipe.prebatch);
  const [image, authorImage] = await Promise.all([
    fileToJpeg(getRecipePageImage(recipe), 1100),
    fileToJpeg(getRecipeAuthorImage(recipe), 720),
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
    authorImage: authorImage?.src ?? null,
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
